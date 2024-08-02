<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Productstockhistory;
use App\Models\Productsmodels;
use App\Models\Stockhistory;
use App\Models\StoreProduct;
use App\Models\Supplier;
use App\Services\ProductStockService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class ProductstockhistoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($id)
    {
        $models = Productsmodels::where('productsmodel_id', $id)->filter(request()->only('date'))
            ->latest()->paginate(10)->withQueryString();
        return $models;
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }
    public function stockhistory($id)
    {
        return [
            'history' =>  Productstockhistory::with('author:id,name')->where([
                'productsmodel_id'=> $id,
                'store_id' => auth()->user()->storePreference->store_id
            ])->filter(request()->only('date'))
            ->latest()->paginate(10)->withQueryString(),
            'filters'=> request()->only('date')
        ];
    }



    public function increaseStock($model_id, ProductStockService $productStockServie)
    {
        if (request()->quantity <= 0) {
            throw ValidationException::withMessages([
                'quantity' => 'This field is requied'
            ]);
        }
        request()->validate([
            'quantity' => ['required'],
            'description' => ['required', 'string', 'max:255'],
            'productsmodel_id' => ['required'],
        ]);

        DB::transaction(function () use ($productStockServie) {
            if (isset(request()->supplier_name) && isset(request()->supplier_contact)) {
                Supplier::updateOrCreate([
                    'supplier_name' => request()->supplier_name,
                    'productsmodel_id' => request()->productsmodel_id
                ], [
                    'supplier_name' => request()->supplier_name,
                    'supplier_contact' => request()->supplier_contact,
                    'productsmodel_id' => request()->productsmodel_id
                ]);
            }
            $product_model = Productsmodels::find(request()->productsmodel_id);
            $product = Productsmodels::find(request()->productsmodel_id)->product;
            Stockhistory::create([
                'stock_products' => [
                    ['product_id' => $product->id ,
                     'model_id' => $product_model->id,
                     'quantity' => request()->quantity,
                     'cost_per_unit' => $product_model->cost_per_unit,
                     'cost_per_collection' => $product_model->cost_per_collection,
                     'in_collection' =>(Boolean)$product_model->in_collection,
                    ]
                ],
                // remember to append auth user name
                'purchase_invoice_number' => 'User Stock Addition - ',
                'supplier_id' => null,
                'record_date' =>now()
                ]);
            $productStockServie->increaseStock((object)[
                'description' => request()->description,
                'action_type' => 'addition',
                'quantity' => request()->quantity,
                'productsmodel_id' => request()->productsmodel_id,
            ]);
        });
    }


    public function decreaseStock($model_id, ProductStockService $productStockServie)
    {
        if (request()->quantity <= 0) {
            throw ValidationException::withMessages([
                'quantity' => 'This field is requied'
            ]);
        }
        request()->validate([
            'quantity' => ['required'],
            'description' => ['required', 'string', 'max:255'],
            'productsmodel_id' => ['required'],
        ]);

        DB::transaction(function () use ($productStockServie) {
            $productStockServie->decreasestock((object)[
                'description' => request()->description,
                'action_type' => 'reduction',
                'quantity' => request()->quantity,
                'productsmodel_id' => request()->productsmodel_id,
            ]);
        });
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $model = Productsmodels::where('id', $id);
        $store_id = request()->user()->storePreference->store_id;

        return [
            'model' => $model->get(['id', 'model_name', 'unit_price', 'quantity_in_stock', 'in_collection', 'price_per_collection', 'quantity_per_collection','cost_per_unit','cost_per_collection'])->firstOrFail(),
            'collection_method' => $model->first()->in_collection == 1 ? $model->first()->collectionType->type : '',
            'product' => $model->first()->product,
            'basic_quantity' => $model->first()->product()->first()->basicQuantity->symbol,
            'has_suppliers' =>  $model->first()->suppliers->count(),
            'stock_quantity' => StoreProduct::where(['productsmodel_id'=>$id,'store_id'=>$store_id])->get("quantity_in_stock")?->first()?->quantity_in_stock,
            'availability' =>StoreProduct::where(['productsmodel_id'=>$id,'store_id'=>$store_id])->exists()
        ];
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Productstockhistory $productstockhistory)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Productstockhistory $productstockhistory)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Productstockhistory $productstockhistory)
    {
        //
    }
}
