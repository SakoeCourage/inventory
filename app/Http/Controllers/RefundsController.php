<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\Refunds;
use App\Models\Productstockhistory;
use App\Services\ProductStockService;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class RefundsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return [
            'history' => Productstockhistory::where('description', 'product return (sale refund)')
                ->with(['author', 'productsmodel' => ['collectionType', 'product' => ['basicQuantity']]])->filter(request()->only('date'))->latest()
                ->paginate(10)->withQueryString()
                ->through(function ($currentItem) {
                    return [
                        'quantity' => $currentItem->quantity,
                        'action_type' => $currentItem->action_type,
                        'created_at' => $currentItem->created_at,
                        'basic_quantity' => $currentItem->productsmodel->product->basicQuantity->name,
                        'id' => $currentItem->id,
                        'model_name' => $currentItem->productsmodel->model_name,
                        'product_name' => $currentItem->productsmodel->product->product_name,
                        'in_collection' => $currentItem->productsmodel->in_collection,
                        'collection_method' => $currentItem->productsmodel->collectionType ? $currentItem->productsmodel->collectionType->type : null,
                        'quantity_per_collection' => $currentItem->productsmodel->quantity_per_collection,
                        'author' => $currentItem->author->name
                    ];
                }),
            'filters' => request()->only('date'),
            'full_url' => trim(request()->fullUrlWithQuery(request()->only('date')))
        ];

    }

    public function generateNewSalediscount(object $sale, Request $request): float
    {
        $new_discount = 0.00;
        if ($request->sale_discount_amount > 0) {
            $depreciated_subtotal = (double) $sale->sub_total - (double) $request->sale_discount_amount;
            $depreciated_total_paid = (double) $sale->total_amount - (double) $request->sale_discount_amount;
            $new_discount = 100 - ((100 * $depreciated_total_paid) / $depreciated_subtotal);
            $new_discount = (double) number_format($new_discount, 2);
        }

        return $new_discount;
    }


    public function getUnitsAndCollectins(object $sale_data, $quantity)
    {
        $units = (bool) $sale_data->in_collection ? (integer) ($quantity) % (integer) ($sale_data->quantity_per_collection ?? 1) : (integer) ($quantity);
        $collections = (bool) $sale_data->in_collection ? floor((integer) ($quantity) / (integer) ($sale_data->quantity_per_collection ?? 1)) : 0;

        return (object) [
            'units' => $units,
            'collections' => $collections
        ];
    }


    public function CalculateSaleAmount(object $refund_data, $quantity)
    {
        $getUnitsAndCollectins = $this->getUnitsAndCollectins($refund_data, $quantity);
        $newlineamount = (((double) ($refund_data->price_per_unit ?? 0) * $getUnitsAndCollectins->units ?? 0) + ((double) ($refund_data->price_per_collection ?? 0) * (double) ($getUnitsAndCollectins->collections ?? 0)));

        return $newlineamount;
    }

    public function CalculateSaleProfit(object $refund_data, $quantity)
    {
        $getUnitsAndCollectins = $this->getUnitsAndCollectins($refund_data, $quantity);
        $currentSaleAmount = $this->CalculateSaleAmount($refund_data, $quantity);

        $lineCost = (((double) ($refund_data->cost_per_unit ?? 0) * $getUnitsAndCollectins->units ?? 0) + ((double) ($refund_data->cost_per_collection ?? 0) * (double) ($getUnitsAndCollectins->collections ?? 0)));
        return $currentSaleAmount - $lineCost;
    }



    public function create(Request $request, ProductStockService $productstockservice)
    {
        $sale = Sale::with('saleitems')->where('id', request()->sale_id)->firstOrFail();
        $sale_item = $sale->saleitems;
        $paymenthistory = $sale->paymenthistory;

        DB::transaction(function () use ($sale, $request, $sale_item, $productstockservice, $paymenthistory) {
            $newRefund = Refunds::create([
                'sale_id' => $sale->id,
                'previous_sale_data' => $sale

            ]);
            $new_subtotal = ($sale->sub_total - $request->store_credit) < 0 ? 0 : $sale->sub_total - $request->store_credit;


            $sale->update([
                'sub_total' => $new_subtotal,
                'amount_paid' => $new_subtotal,
                'balance' => 0,
                'discount_rate' => 0.00,
                'total_amount' => $new_subtotal
            ]);


            $sale->paymenthistory->firstOrFail()->update([
                'amount' => $new_subtotal
            ]);

            foreach ($request->sale_items as $key => $value) {
                if ($value['quantity_to_refund'] > 0) {
                    $current_sale_item = $sale_item->where('id', $value['saleitem_id'])->first();
                    $difference = (integer) $current_sale_item->quantity - (integer) $value['quantity_to_refund'];
                    $new_amount = $this->CalculateSaleAmount((object) $value, $difference);
                    $new_profit = $this->CalculateSaleProfit((object) $value, $difference);


                    $current_sale_item->update([
                        'price' => $value['price_per_unit'],
                        'quantity' => $difference,
                        'amount' => $new_amount,
                        'profit' => $new_profit,
                        'is_refunded' => 1
                    ]);


                    $productstockservice->increasestock((object) [
                        'productsmodel_id' => $value['model_id'],
                        'quantity' => $value['quantity_to_refund'],
                        'description' => 'product return (sale refund)'
                    ]);
                }
            }
        });

        return response('refunded');


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
    public function show(Refunds $refunds)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Refunds $refunds)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Refunds $refunds)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Refunds $refunds)
    {
        //
    }
}