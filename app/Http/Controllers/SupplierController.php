<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use App\Models\Productsmodels;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class SupplierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Supplier::get(['id', 'supplier_name', 'supplier_contact']);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function toSupplierTable(Supplier $supplier)
    {
        return [
            'suppliers' => $supplier->filter(request()->only(['search']))
                ->latest()->paginate(10)->withQueryString()
                ->through(function ($currentSupplier) {
                    return [
                        'id' => $currentSupplier->id,
                        'created_at' => $currentSupplier->created_at,
                        'supplier_contact' => $currentSupplier->supplier_contact,
                        'supplier_name' => $currentSupplier->supplier_name
                    ];
                }),
            'filters' => request()->only('search')
        ];
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'supplier_name' => ['required', 'string'],
            'supplier_contact' => ['required', 'min:10', 'max:10']
        ]);

        Supplier::updateOrCreate(
            [
                'supplier_name' => $request->supplier_name,
                'supplier_contact' => $request->supplier_contact
            ],
            []
        );
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
    public function edit(Request $request)
    {
        $request->validate([
            'supplier_name' => ['required'],
            'supplier_contact' => ['required', 'min:10', 'max:10']
        ]);
        if (Supplier::where([
            'supplier_name'=> $request->supplier_name,
            'supplier_contact'=> $request->supplier_contact
        ])->first()){
            throw ValidationException::withMessages([
                'supplier_name' => 'supplier data already exist'
            ]);
        }


     Supplier::updateOrCreate(['id' => $request->id ?? null], $request->all());
    }

    /**
     * Show the form for editing the specified resource.
     */

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Supplier $supplier)
    {
       return $supplier->delete();
    }
}
