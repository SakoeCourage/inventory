<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use App\Models\Product;
use App\Models\Productsmodels;
use App\Models\Productstockhistory;
use App\Enums\StockActionEnum;

class ProductStockService
{


    public function increasestock($request)
    {

        DB::transaction(function () use ($request) {
            $product_model = Productsmodels::find($request->productsmodel_id);
            $product_model->increment('quantity_in_stock', $request->quantity);
            $last_record = Productstockhistory::where('productsmodel_id', $request->productsmodel_id)->get()->last();
            $newStockHistory = Productstockhistory::create([
                'productsmodel_id' => $request->productsmodel_id,
                'user_id' => 1,
                'action_type' => StockActionEnum::Appreciate,
                'quantity' => $request->quantity,
                'description' => $request->description ?? 'from ' .'username',
                'net_quantity' => $last_record ? $last_record->net_quantity + $request->quantity : $request->quantity
            ]);
            $product_model->product->increment('quantity_in_stock',$newStockHistory->quantity);
        });
    }

    public function decreasestock($request)
    {
        DB::transaction(function () use ($request) {
            $product_model = Productsmodels::find($request->productsmodel_id);
            $product_model->decrement('quantity_in_stock', $request->quantity);
            $last_record = Productstockhistory::where('productsmodel_id', $request->productsmodel_id)->get()->last();
            $newStockHistory = Productstockhistory::create([
                'productsmodel_id' => $request->productsmodel_id,
                'user_id' => 1,
                'action_type' => StockActionEnum::Depreciate,
                'quantity' => $request->quantity,
                'description' => $request->description ?? 'for sale',
                'net_quantity' => $last_record ? $last_record->net_quantity - $request->quantity : 0 - $request->quantity
            ]);
            $product_model->product->decrement('quantity_in_stock',$newStockHistory->quantity);
        });
    }
}
