<?php

namespace App\Imports;

use App\Enums\StockActionEnum;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use App\Models\Productsmodels;
use App\Models\StoreProduct;
use App\Models\Productstockhistory;
use Illuminate\Support\Facades\DB;

class StoreProductSheetImport implements ToCollection, WithHeadingRow
{
    protected $storeId;
    protected $productData = [];
    protected $stockHistories = [];
    public function __construct(int $storeId)
    {
        $this->storeId = $storeId;
    }

    function updateOrCreateProductStockHistories()
    {
        $entries = $this->stockHistories;

        if (count($entries) == 0) {
            return;
        }

        $productsmodelIds = array_column($entries, 'productsmodel_id');
        $currentDate = Carbon::now()->format('Y-m-d');
        $currentUser = auth()->user()->id;
        $currentStore = auth()->user()->storePreference->store_id;

        // Fetch the last entries for each productsmodel_id
        $lastEntries = Productstockhistory::whereIn('productsmodel_id', $productsmodelIds)
            ->where("store_id", $this->storeId)
            ->orderBy('created_at', 'desc')
            ->get()
            ->groupBy('productsmodel_id');

        DB::transaction(function () use ($entries, $lastEntries, $currentDate, $currentStore, $currentUser) {
            foreach ($entries as $entry) {
                // Create the new entry
                Productstockhistory::create([
                    'productsmodel_id' => $entry['productsmodel_id'],
                    'description' => "Excel import - " . $currentDate,
                    'action_type' => StockActionEnum::Appreciate,
                    'quantity' => $entry['quantity'] ?? 0,
                    'net_quantity' => $entry['quantity_in_stock'] ?? 0,
                    'user_id' => $currentUser,
                    'store_id' => $currentStore,
                ]);
            }
        });
    }

    public function collection(Collection $rows)
    {
        $expectedHeaders = [
            'product_name',
            'model_name',
            'packaging_unit',
            'basic_unit',
            'quantity_of_packaging_unit',
            'quantity_of_basic_unit',
        ];



        if ($rows->isEmpty() || array_diff($expectedHeaders, array_keys($rows->first()->toArray()))) {
            throw new \Exception('Headers do not match the expected format.');
        }


        $modelNames = $rows->pluck('model_name')->unique()->map(function ($name) {
            return strtolower($name);
        })->toArray();

        $productModels = Productsmodels::with('product')
            ->whereIn('model_name', $modelNames)
            ->get();

        foreach ($productModels as $productModel) {
            $this->productData[] = [
                "product_name" => strtolower($productModel->product->product_name),
                "product_model" => strtolower($productModel->model_name),
                "product_id" => $productModel->product_id,
                "product_model_id" => $productModel->id,
                "quantity_per_collection" => $productModel->quantity_per_collection,
                "in_collection" => $productModel->in_collection,
            ];
        }

        foreach ($rows as $row) {
            $productName = strtolower($row['product_name']);
            $modelName = strtolower($row['model_name']);
            $invalidValues = ['', '-', null];

            $productModelData = collect($this->productData)->firstWhere(function ($data) use ($productName, $modelName) {
                return $data['product_name'] === $productName && $data['product_model'] === $modelName;
            });

            if ($productModelData == null) {
                continue;
            }


            
            $quantityToAdd = 0;
            
            if ($productModelData['in_collection']) {
                $quantityToAdd =
                (in_array($row['quantity_of_packaging_unit'], $invalidValues) ? 0 : $row['quantity_of_packaging_unit'])
                * $productModelData['quantity_per_collection']
                + (in_array($row['quantity_of_basic_unit'], $invalidValues) ? 0 : $row['quantity_of_basic_unit']);
            } else {
                $quantityToAdd = in_array($row['quantity_of_basic_unit'], $invalidValues) ? 0 : $row['quantity_of_basic_unit'];
            }

            if($quantityToAdd == 0){
                continue;
            }
            
            $storeProduct = StoreProduct::firstOrCreate([
                'productsmodel_id' => $productModelData['product_model_id'],
                'store_id' => $this->storeId,
            ]);

            $storeProduct->increment('quantity_in_stock', $quantityToAdd);

            $this->stockHistories[] = [
                'productsmodel_id' => $storeProduct->productsmodel_id,
                'quantity' => $quantityToAdd,
                'quantity_in_stock' => $storeProduct->quantity_in_stock

            ];

        }
        $this->updateOrCreateProductStockHistories();
    }
}
