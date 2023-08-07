<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\Saleitem;
use Illuminate\Http\Request;
use App\Models\Productsmodels;
use App\Models\Businessprofile;
use Illuminate\Validation\Rule;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use App\Services\ProductStockService;
use App\Helpers\Generateinvoicenumber;

class SaleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Sale $sale, Request $request)
    {
        return [
            'sales' => $sale->filter(request()->only('search', 'day'))->with('salerepresentative:id,name')->withCount('refunds')->latest()->paginate(10),
            'filters' => request()->only('search', 'day'),
            'full_url' => trim($request->fullUrlWithQuery(request()->only('search', 'day')))
        ];
    }


    public function tosearch(Sale $sale, Request $request)
    {
        return [
            'sales' => $sale->deepfilter(request()->only('search', 'day'))->with('salerepresentative:id,name')->withCount('refunds')->latest()->paginate(10),
            'filters' => request()->only('search', 'day'),
            'full_url' => trim($request->fullUrlWithQuery(request()->only('search', 'day')))
        ];
    }


    /**
     * Display the specified resource.
     */
    public function showinvoice($invoiceID)
    {
        $newdata = Sale::with(['saleitems' => ['productsmodels' => ['product' => ['basicQuantity'], 'collectionType']], 'salerepresentative', 'paymentmethod'])->where('id', $invoiceID)->firstOrFail();
        return response([...$newdata->toArray(), 'business_profile' => Businessprofile::get()->first()], 200);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    function handleOutofStock(Collection $errors, Collection $sales_collection, ProductStockService $productStockService)
    {
        if ($errors->count()) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'out_of_stock' => $errors
            ]);
        } else {
            $sales_collection->each(function ($value, $key) use ($productStockService) {
                $productStockService->decreasestock($value);
            });
        }
    }


    public function getProfitMargin($quantity, $sp, $cp)
    {
        return ($sp * $quantity ?? 0) - ($cp * $quantity ?? 0);
    }


    public function calculateProfitMargin($incol, $no_of_coll, $price_per_coll, $cost_per_coll, $no_of_units, $price_per_unit, $cost_per_unit)
    {
        $profit = 0;
        if ($incol) {
            $profit = $this->getProfitMargin($no_of_coll, $price_per_coll, $cost_per_coll) + $this->getProfitMargin($no_of_units, $price_per_unit, $cost_per_unit);
        } else {
            $profit = $this->getProfitMargin($no_of_units, $price_per_unit, $cost_per_unit);
        }
        return $profit;
    }


    


    public function store(Request $request, ProductStockService $productStockService, ProductController $productController)
    {
        $newdata = null;
        $request->validate([
            'customer_fullname' => ['nullable', 'string', 'max:255'],
            'customer_contact' => ['nullable', 'string', 'min:10', 'max:10'],
            'payment_method' => ['required'],
            'sub_total' => ['required'],
            'balance' => ['nullable'],
            'amount_paid' => ['nullable', Rule::when(fn() => $request->amount_paid < $request->total, ['min:' . $request->total])],
            'discount_rate' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'total' => ['required'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required'],
            'items.*.productsmodel_id' => ['required', 'distinct'],
            'items.*.quantity' => ['required', 'min:0', 'not_in:0'],
            'items.*.in_collection' => ['required', 'boolean'],
        ]);

        DB::transaction(function () use ($request, $productStockService, &$newdata) {

            $newSale = Sale::create([
                'customer_contact' => $request->customer_contact,
                'customer_name' => $request->customer_fullname,
                'sub_total' => $request->sub_total,
                'total_amount' => $request->total,
                'paymentmethod_id' => $request->payment_method,
                'user_id' => auth()->user()->id,
                'discount_rate' => $request->discount_rate,
                'balance' => $request->balance ?? 0,
                'amount_paid' => $request->amount_paid ?? $request->total,
                'sale_invoice' =>Generateinvoicenumber::generateSaleInvoice('SALE-','sales','sale_invoice')
            ]);

            foreach ($request->items as $key => $value) {
                Saleitem::create([
                    'sale_id' => $newSale->id,
                    'productsmodel_id' => $value['productsmodel_id'],
                    'price' => $value['unit_price'],
                    'quantity' => $value['quantity'],
                    'amount' => $value['amount'],
                    'profit' => $this->calculateProfitMargin(
                        $value['in_collection'],
                        $value['collections'],
                        $value['price_per_collection'],
                        $value['cost_per_collection'],
                        $value['units'],
                        $value['unit_price'],
                        $value['cost_per_unit']
                    )
                ]);
                $productStockService->decreasestock((Object) $value);
            }
            PaymenthistoryController::Newpayament((object) array_merge($request->toArray(), ['sale_id' => $newSale->id]));

            $newdata = Sale::with(['saleitems' => ['productsmodels' => ['product' => ['basicQuantity'], 'collectionType']], 'salerepresentative', 'paymentmethod'])->where('id', $newSale->id)->firstOrFail();
        });
        return [...$productController->productAndModelsJoin(), 'newsale' => [...$newdata->toArray(), 'business_profile' => Businessprofile::get()->first()]];
    }

    /**
     * Display the specified resource.
     */
    public function show(Sale $sale)
    {
        return [
            'sale' => $sale,
            'sale_representative' => $sale->salerepresentative->name,
            'payment_method' => $sale->paymentmethod->method,

            'sale_items' => $sale->saleitems->map(function ($value, $key) {
                return [
                    'amount' => $value->amount,
                    'id' => $value->id,
                    'unit_price' => $value->price,
                    'sale_product' => Productsmodels::with(['collectionType:id,type', 'product:id,product_name',])->find($value->productsmodel_id),
                    'basic_selling_quantity' => Productsmodels::find($value->productsmodel_id)->basicQuantity()->symbol,
                    'quantity' => $value->quantity,
                    'is_refunded' => $value->is_refunded

                ];
            })
        ];
    }

    /**
     * Display the specified resource.
     */
    public function getSaleFromInvoice(Sale $sale)
    {
        return [
            'sale' => $sale,
            'payment_method' => $sale->paymentmethod,
            'line_items' => $sale->saleitems->map(function ($value, $key) {
                return [
                    'sale_item' => $value,
                    'product_model' => $value->productsmodels,
                    'product' => $value->productsmodels->product,
                    'basic_selling_quantity' => $value->productsmodels->product->basicQuantity,
                    'collection_method' => $value->productsmodels->collectionType,

                ];
            })

        ];
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Sale $sale)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Sale $sale)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Sale $sale)
    {
        //
    }
}