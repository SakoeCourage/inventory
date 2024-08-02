<?php

namespace App\Services;

use App\Models\StoreProduct;
use Illuminate\Support\Facades\DB;
use App\Models\Product;
use App\Models\Productsmodels;
use App\Models\Productstockhistory;
use App\Enums\StockActionEnum;
use Illuminate\Support\Facades\Auth;

class ProductStockService
{
    public function increasestock($request)
    {
        DB::transaction(function () use ($request) {
         
            $store_product = StoreProduct::where([
                'store_id' => Auth::user()->storePreference->store_id,
                'productsmodel_id' => $request->productsmodel_id
            ]);

            $store_product->first()->increment('quantity_in_stock', $request->quantity);

            $last_record = Productstockhistory::where([
                'productsmodel_id' => $request->productsmodel_id,
                'store_id' => Auth::user()->storePreference->store_id
            ])->get()->last();

            $newStockHistory = Productstockhistory::create([
                'productsmodel_id' => $request->productsmodel_id,
                'user_id' => Auth::user()->id,
                'action_type' => StockActionEnum::Appreciate,
                'store_id' => Auth::user()->storePreference->store_id,
                'quantity' => $request->quantity,
                'description' => $request->description ?? 'from ' . Auth::user()->name,
                'net_quantity' => $last_record ? $last_record->net_quantity + $request->quantity : $request->quantity
            ]);
   
        });
    }

    public function decreasestock($request)
    {
        DB::transaction(function () use ($request) {
            $store_product = StoreProduct::where([
                'store_id' => Auth::user()->storePreference->store_id,
                'productsmodel_id' => $request->productsmodel_id
            ]);
            $store_balance = $store_product->first()->get('quantity_in_stock');
            
            if ($request->quantity > $store_balance->first()->quantity_in_stock) {
                throw \Illuminate\Validation\ValidationException::withMessages([
                    'out_of_stock' => "some products are be out of stock"
                ]);
            }
            $store_product->first()->decrement('quantity_in_stock', $request->quantity);

            $last_record = Productstockhistory::where([
                'productsmodel_id' => $request->productsmodel_id,
                'store_id' => Auth::user()->storePreference->store_id
            ])->get()->last();

            $newStockHistory = Productstockhistory::create([
                'productsmodel_id' => $request->productsmodel_id,
                'user_id' => Auth::user()->id,
                'action_type' => StockActionEnum::Depreciate,
                'store_id' => Auth::user()->storePreference->store_id,
                'quantity' => $request->quantity,
                'description' => $request->description ?? 'for sale',
                'net_quantity' => $last_record ? $last_record->net_quantity - $request->quantity : 0 - $request->quantity
            ]);
        });
    }
}
