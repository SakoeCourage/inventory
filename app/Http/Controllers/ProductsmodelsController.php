<?php

namespace App\Http\Controllers;

use App\Models\Productsmodels;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductsmodelsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Display a listing of the resource.
     */
    public function getProductModelsFromProductId($id)
    {
        $models = Productsmodels::where('product_id', $id)->filter(request()->only(['search']))
        ->latest()->paginate(10)->withQueryString()
        ->through(function($item){
            return[
                'id' => $item->id,
                'model_name'=> $item->model_name
            ];
        })
        ;
        return $models;
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }
    /**
     * Show the form for creating a new resource.
     */
    public function searchProductWithModels(Product $product)
    {
        return [
            'products' => $product->with('models')->filter(request()->only(['search', 'sort']))
                ->latest()->paginate(10)->withQueryString()
                // ->through(fn ($currentproduct) =>
                // [
                //     'id' => $currentproduct->id,
                //     'updated_at' => $currentproduct->updated_at,
                //     'product_name' => $currentproduct->product_name,
                //     'quantity_in_stock' => $currentproduct->quantity_in_stock,
                //     'basic_quantity' => $currentproduct->basicQuantity->symbol

                // ])
                ,
            'filters' => request()->only(['search', 'sort'])
        ];
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
    public function show(Productsmodels $productsmodels)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Productsmodels $productsmodels)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Productsmodels $productsmodels)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Productsmodels $productsmodels)
    {
        //
    }
}
