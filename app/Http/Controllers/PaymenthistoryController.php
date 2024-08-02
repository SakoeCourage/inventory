<?php

namespace App\Http\Controllers;

use App\Models\Paymenthistory;
use Illuminate\Http\Request;

class PaymenthistoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
       return [
            'data' => Paymenthistory::where('store_id',request()->user()->storePreference->store_id)->with('paymentmethod')->filter(request()->only('paymentmethod','day'))->latest()
            ->paginate()->withQueryString()
            ->through(function($history){
                return[
                    'created_at' => $history->created_at,
                    'payment_method' => $history->paymentmethod->method,
                    'sender' => $history->sender,
                    'amount' => $history->amount
                ];
            }),
            'filters' => request()->only('paymentmethod','day'),
            'full_url' => trim(request()->fullUrlWithQuery(request()->only('paymentmethod', 'day')))
       ];
    }

    /**
     * Show the form for creating a new resource.
     */
    static function Newpayament(object $data)
    {
        return Paymenthistory::create([
            'sender' => $data->customer_fullname ?? '',
            'paymentmethod_id' => $data->payment_method,
            'amount' => $data->total,
            'sale_id' => $data->sale_id,
            'store_id' => request()->user()->storePreference->store_id
        ]);
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
    public function show(Paymenthistory $paymenthistory)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Paymenthistory $paymenthistory)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Paymenthistory $paymenthistory)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Paymenthistory $paymenthistory)
    {
        //
    }
}