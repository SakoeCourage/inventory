<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use App\Models\Productsmodels;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Supplier::get(['id','supplier_name','supplier_contact']);
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
        $request->validate([
            'supplier_name' => ['required','string'],
            'supplier_contact' => ['required','min:10','max:10']
        ]);
        
        Supplier::updateOrCreate([
            'supplier_name'=> $request->supplier_name,
            'supplier_contact'=> $request->supplier_contact
        ],
        []);

    }

    /**
     * Display the specified resource.
     */
    public function show(Supplier $supplier)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Supplier $supplier)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
 
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Supplier $supplier)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Supplier $supplier)
    {
        //
    }
}
