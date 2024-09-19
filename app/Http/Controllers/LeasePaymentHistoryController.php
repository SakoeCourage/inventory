<?php

namespace App\Http\Controllers;

use App\Models\LeasePaymentHistory;
use App\Models\Paymenthistory;
use App\Models\Sale;
use Illuminate\Http\Request;

class LeasePaymentHistoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($saleId)
    {
        $sale = Sale::where("id", $saleId)
            ->with(['leasePaymentHistory' => function($query) {
                $query->orderBy('created_at', 'desc')->with('paymentMethod');
            }])
            ->first();
    
        return response($sale, 200);
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

    }

    /**
     * Display the specified resource.
     */
    public function show(LeasePaymentHistory $leasePaymentHistory)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(LeasePaymentHistory $leasePaymentHistory)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $saleId)
    {
        $request->validate([
            'payment_method' => ['required'],
            'amount' => ['required']
        ]);

        $sale = Sale::where([
            "id" => $saleId,
            'sale_type' => 'lease'
        ])
            ->with("leasePaymentHistory")->get()->first();
        
        if($sale == null){
            return response("Sale Not Found", 404);
        }

        \Illuminate\Support\Facades\DB::transaction(function()use($sale,$request,$saleId){

            if ($sale && $sale->leasePaymentHistory->isNotEmpty()) {
                $latestLeasePayment = $sale->leasePaymentHistory
                    ->sortByDesc('created_at')
                    ->first();
    
                $adjustedAmountPayed = $request->amount > abs($latestLeasePayment->balance)
                    ? abs($latestLeasePayment->balance)
                    : $request->amount;
    
                $newBalance = $latestLeasePayment->balance + $adjustedAmountPayed;
    
                LeasePaymentHistory::create([
                    'sale_id' => $sale->id,
                    'amount' => $adjustedAmountPayed,
                    'balance' => $newBalance,
                    'paymentmethod_id' => $request->payment_method
                ]);
    
                Paymenthistory::create([
                    'paymentmethod_id' => $request->payment_method,
                    'sender' => $sale->customer_name,
                    'store_id' => $request->user()?->storePreference->store_id,
                    'sale_id' => $sale->id,
                    'amount' => $adjustedAmountPayed
                ]);
    
                $isLeaseSettled = $newBalance >= 0 ;

                if ($isLeaseSettled) {
                    Sale::where("id", "=",$saleId)->update([
                        'sale_type' => \App\Enums\SaleEnum::Regular->value,
                        'paymentmethod_id' => $request->payment_method
                    ]);
                }
            }
        });
        return response("Payment Successful", 200);
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LeasePaymentHistory $leasePaymentHistory)
    {
        //
    }
}
