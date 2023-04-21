<?php

namespace App\Http\Controllers;

use App\Models\BasicSellingQuantity;
use Illuminate\Http\Request;

class BasicSellingQuantityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function update(Request $request, BasicSellingQuantity $basicSellingQuantity)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BasicSellingQuantity $basicSellingQuantity)
    {
        //
    }
}
