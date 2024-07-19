<?php

namespace App\Imports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use App\Models\Category;
use App\Models\BasicSellingQuantity;
use App\Models\CollectionType;
use App\Models\Product;
use App\Models\Productsmodels;
use DB;

class ProductImport implements ToCollection
{
    protected $incomingProductCategories = [];
    protected $productsFromSheets = [];

    public function collection(Collection $rows)
    {
        $this->processRows($rows);
        $this->validateAndSaveData();
    }

    protected function processRows(Collection $rows)
    {
        foreach ($rows as $row) {
            $productName = $row[0];
            $modelName = $row[1];
            $packagingUnit = $row[2];
            $quantityPerPackagingUnit = $row[3];
            $basicUnit = $row[4];
            $pricePerPackagingUnit = $row[5];
            $pricePerBasicUnit = $row[6];
            $costPerPackagingUnit = $row[7];
            $costPerBasicUnit = $row[8];

            $this->productsFromSheets[] = [
                "product_name" => $productName,
                "basic_selling_quantity_name" => $basicUnit,
                "model_name" => $modelName,
                "unit_price" => $pricePerBasicUnit,
                "price_per_collection" => $pricePerPackagingUnit,
                "in_collection" => $packagingUnit !== "" && $packagingUnit !== "-",
                "collection_method_name" => $packagingUnit !== "" && $packagingUnit !== "-" ? $packagingUnit : null,
                "quantity_per_collection" => $quantityPerPackagingUnit,
                "cost_per_unit" => $costPerBasicUnit,
                "cost_per_collection" => $costPerPackagingUnit,
            ];

            $this->incomingProductCategories[] = strtolower($productName);
        }

        $this->incomingProductCategories = array_unique($this->incomingProductCategories);
    }

    protected function validateAndSaveData()
    {
        DB::transaction(function () {
            $existingProductCategories = Category::pluck('category')->map('strtolower')->toArray();
            $missingProductCategories = array_diff($this->incomingProductCategories, $existingProductCategories);
            $missingCategoriesData = [];
            foreach ($missingProductCategories as $category) {
                $missingCategoriesData[] = ['category' => ucfirst($category)];
            }
            // Category::insert($missingCategoriesData);
            
            $incomingBasicUnits = array_unique(array_map('strtolower', array_column($this->productsFromSheets, 'basic_selling_quantity_name')));
            $existingBasicUnits = BasicSellingQuantity::pluck('name')->map('strtolower')->toArray();
            $missingBasicUnits = array_diff($incomingBasicUnits, $existingBasicUnits);
            
            $missingBasicUnitsData = [];
            foreach ($missingBasicUnits as $unit) {
                $missingBasicUnitsData[] = ['name' => ucfirst($unit), 'symbol' => '']; // Add correct symbol
            }
            // BasicSellingQuantity::insert($missingBasicUnitsData);
            
            $incomingCollectionMethods = array_unique(array_map('strtolower', array_filter(array_column($this->productsFromSheets, 'collection_method_name'))));
            $existingCollectionMethods = CollectionType::pluck('type')->map('strtolower')->toArray();
            $missingCollectionMethods = array_diff($incomingCollectionMethods, $existingCollectionMethods);
            dd($missingCollectionMethods);
            
            $missingCollectionMethodsData = [];
            foreach ($missingCollectionMethods as $method) {
                $missingCollectionMethodsData[] = ['type' => ucfirst($method)];
            }
            CollectionType::insert($missingCollectionMethodsData);

            foreach ($this->productsFromSheets as $productData) {
                $basicSellingQuantity = BasicSellingQuantity::where('name', ucfirst($productData['basic_selling_quantity_name']))->first();
                $collectionMethod = CollectionType::where('type', ucfirst($productData['collection_method_name']))->first();
                $category = Category::where('category', ucfirst($productData['product_name']))->first();

                $product = Product::updateOrCreate(
                    ['product_name' => $productData['product_name']],
                    [
                        'basic_selling_quantity_id' => $basicSellingQuantity ? $basicSellingQuantity->id : null,
                        'category_id' => $category ? $category->id : null,
                        'has_models' => true,
                        'quantity_in_stock' => 0, // Set to appropriate value
                    ]
                );

                Productsmodels::updateOrCreate(
                    [
                        'product_id' => $product->id,
                        'model_name' => $productData['model_name'],
                    ],
                    [
                        'unit_price' => $productData['unit_price'],
                        'quantity_in_stock' => 0, // Set to appropriate value
                        'in_collection' => $productData['in_collection'],
                        'collection_method' => $collectionMethod ? $collectionMethod->id : null,
                        'price_per_collection' => $productData['price_per_collection'],
                        'quantity_per_collection' => $productData['quantity_per_collection'],
                        'cost_per_unit' => $productData['cost_per_unit'],
                        'cost_per_collection' => $productData['cost_per_collection'],
                    ]
                );
            }
        });
    }
}
