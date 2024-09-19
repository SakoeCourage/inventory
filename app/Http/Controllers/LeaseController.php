<?php

namespace App\Http\Controllers;

use App\Enums\SaleEnum;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class LeaseController extends Controller
{
    public function index()
    {

    }

    public function handleOnLeaseSettled($saleId)
    {
        $sale = \App\Models\Sale::find($saleId);
        //Update the sale type from lease to regular 
        // Change timestamp to now
        
        $sale->update([
            'created_at'=> Carbon::now(),
            'updated_at' => Carbon::now(),
            'sale_type' => SaleEnum::Regular->value
        ]);

        return response("Sale Updated",Response::HTTP_NO_CONTENT);
    }

    public function handleOnLeasePayment($saleId,Request $request){

        $validationResponse = $request->validate([
                
        ]);

       \Illuminate\Support\Facades\DB::transaction(function()use($saleId,$request){
            $sale = $sale = \App\Models\Sale::find($saleId);
       });
    }
    
}
