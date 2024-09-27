<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\SaleCollectedHistory;
use Illuminate\Http\Request;

class SaleCollectedHistoryController extends Controller
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

    }

    public function markSaleAsCollected(Request $request)
    {
        $request->validate([
            'sale_id' => ['required'],
            'collector_name' => ['required'],
            'collector_phone' => ['required'],
        ]);
        \Illuminate\Support\Facades\DB::transaction(function () use ($request) {
            $sale = Sale::find($request->sale_id);
            $sale->update([
                "sale_type" => \App\Enums\SaleEnum::Regular->value
            ]);

            if($sale == null){
                return response("Sale Not Found",404);
            }
            SaleCollectedHistory::create([
                'sale_id' => $sale->id,
                'collected_by_name'=> $request->collector_name,
                'collected_by_phone' => $request->collector_phone
            ]);
        });
        return response("ok",200);
    }
}
