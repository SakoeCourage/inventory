<?php

namespace App\Http\Controllers;

use App\Models\Productsupplier;
use App\Models\Productsmodels;
use Illuminate\Http\Request;

class ProductsupplierController extends Controller
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
    public function store(Request $request)
    {
        //
    }
    public function getSupplierPergivenProductModel(Productsmodels $model)
    {
        
        return Productsupplier::with('supplier')->where('productsmodel_id',$model->id)->latest()->paginate(10);
    }


    /**
     * Display the specified resource.
     */
    public function show(Productsupplier $productsupplier)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Productsupplier $productsupplier)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Productsupplier $productsupplier)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Productsupplier $productsupplier)
    {
        //
    }
}
