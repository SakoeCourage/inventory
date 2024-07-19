<?php

namespace App\Http\Controllers;

use App\Models\BasicSellingQuantity;
use Illuminate\Http\Request;

class BasicSellingQuantityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(BasicSellingQuantity $basicSellingQuantity)
    {
        return [
            'basicQuantities' => $basicSellingQuantity->filter(request()->only(['search']))
                ->latest()->paginate(10)->withQueryString()
                ->through(function ($currentValue) {
                    return [
                        'id' => $currentValue->id,
                        'created_at' => $currentValue->created_at,
                        'name' => $currentValue->name,
                        'symbol' => $currentValue->symbol
                    ];
                }),
            'filters' => request()->only('search')
        ];
    }
    /**
     * Display a listing of the resource for select purpose.
     */
    public function toselect()
    {
        return BasicSellingQuantity::get('name');
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

    /**
     * Display the specified resource.
     */
    public function show(BasicSellingQuantity $basicSellingQuantity)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BasicSellingQuantity $basicSellingQuantity)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $id = $request->id ?? null;
        $request->validate([
            'name' => ['required', 'unique:basic_selling_quantities,name,' . $id],
            'symbol' => ['required', 'unique:basic_selling_quantities,symbol,' . $id],
        ]);

        BasicSellingQuantity::updateOrCreate(['id' => $id ?? null], $request->all());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BasicSellingQuantity $basicSellingQuantity)
    {
        $basicSellingQuantity->delete();
    }
}
