<?php

namespace App\Http\Controllers;

use App\Models\Paymentmethod;
use Illuminate\Http\Request;

class PaymentmethodController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function toselect()
    {
        return Paymentmethod::get(['id', 'method']);
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
    public function show(Paymentmethod $paymentmethod)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Paymentmethod $paymentmethod)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Paymentmethod $paymentmethod)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Paymentmethod $paymentmethod)
    {
        //
    }
}