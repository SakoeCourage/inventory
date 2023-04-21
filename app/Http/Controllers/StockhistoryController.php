<?php

namespace App\Http\Controllers;

use App\Models\Productsmodels;
use App\Models\Stockhistory;
use App\Models\Supplier;
use App\Models\Productsupplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use App\Services\ProductStockService;

class StockhistoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request,ProductStockService $productStockService)
    {
     
        $request->validate([
            'record_date' => ['required', 'date_format:Y-m-d'],
            'purchase_invoice_number' => ['required'],
            'supplier' => ['required'],
            'new_stock_products' => ['required', 'array', 'min:1'],
            'new_stock_products.*.product_id' => ['required'],
            'new_stock_products.*.in_collection' => ['required', 'boolean'],
            'new_stock_products.*.model_id' => ['required'],
            'new_stock_products.*.quantity' => ['required', 'numeric','min:0','not_in:0'],
            'new_stock_products.*.cost_per_collection' => ['required:if:new_stock_products.*.in_collection,=,true', 'numeric', 'min:0','not_in:0'],
            'new_stock_products.*.cost_per_unit' => ['required_if:new_stock_products.*.in_collection,=,false', 'numeric', 'min:0','not_in:0'],
        ]);


        DB::transaction(function()use($request,$productStockService){
             $currentSupplierName = Supplier::find($request->supplier)->supplier_name;
                // increase the stock values using the productstockservice
                // foreach one of the products add to productsupplier table the suppplier id and the product model_id
                // then add all the product and supplier to stockhistory table
                Stockhistory::create([
                    'supplier_id'=> $request->supplier,
                    'record_date'=> $request->record_date,
                    'stock_products'=> $request->new_stock_products,
                ]);
                foreach ($request->new_stock_products as $newStock) {
                    $currentmodel = Productsmodels::find($newStock['model_id']);
                    Productsupplier::firstOrCreate([
                        'supplier_id'=>$request->supplier,
                        'productsmodel_id'=>$newStock['model_id']
                    ],[
                        'supplier_id'=>$request->supplier,
                        'productsmodel_id'=>$newStock['model_id']
                    ]);
                    $productStockService->increasestock((Object)[
                        'productsmodel_id'=> $newStock['model_id'],
                        'quantity'=> $newStock['quantity'],
                        'description'=> 'new stock from a supplier '. $currentSupplierName,
                    ]);
                    $currentmodel->update([
                        'cost_per_collection' =>  $newStock['cost_per_collection'],
                        'cost_per_unit' =>  $newStock['cost_per_unit']
                    ]);
                }
        });
        
        return $request;
    }

    /**
     * Display the specified resource.
     */
    public function show(Stockhistory $stockhistory)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Stockhistory $stockhistory)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Stockhistory $stockhistory)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Stockhistory $stockhistory)
    {
        //
    }
}
