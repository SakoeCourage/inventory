<?php

namespace App\Http\Controllers;

use App\Enums\SaleEnum;
use App\Models\LeasePaymentHistory;
use App\Models\Sale;
use App\Models\Saleitem;
use Illuminate\Http\Request;
use App\Models\Productsmodels;
use App\Models\Businessprofile;
use Illuminate\Validation\Rule;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use App\Services\ProductStockService;
use Haruncpi\LaravelIdGenerator\IdGenerator;

class SaleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Sale $sale, Request $request)
    {
        return [
            'sales' => $sale->where([
                "sale_type" => $request->sale_type ?? SaleEnum::Regular->value,
                'store_id' => $request->user()->storePreference->store_id,
            ])->filter(request()->only('search', 'day'))
                ->with(['salerepresentative:id,name', 'leasePaymentHistory'])
                ->withCount('refunds')
                ->latest()
                ->paginate(10),
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
        $currentStore = Auth()->user()?->storePreference;
        return response([
            ...$newdata->toArray(),
            'business_profile' => Businessprofile::get()->first(),
            'store' => [
                'name' => $currentStore?->store->store_name,
                'branch' => $currentStore?->store?->branch?->branch_name
            ],
        ], 200);
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

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, ProductStockService $productStockService, ProductController $productController)
    {
        $newdata = null;
        $request->validate([
            'customer_fullname' => [
                Rule::when(fn() => $request->sale_type == "lease" | $request->sale_type == "un_collected", ['required', 'string', 'max:255']),
                'nullable',
            ],
            'customer_contact' => [
                Rule::when(fn() => $request->sale_type == "lease" | $request->sale_type == "un_collected", ['required', 'string', 'min:10', 'max:10']),
                'nullable',
            ],
            'payment_method' => ['nullable', Rule::when(fn() => $request->amount_paid != null || $request->sale_type == "regular", ['required'])],
            'sub_total' => ['required'],
            'balance' => ['nullable'],
            'amount_paid' => ['nullable', Rule::when(fn() => $request->sale_type == 'regular' && $request->amount_paid < $request->total, ['min:' . $request->total])],
            'discount_rate' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'total' => ['required'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required'],
            'items.*.productsmodel_id' => ['required', 'distinct'],
            'items.*.quantity' => ['required', 'min:0', 'not_in:0'],
            'items.*.in_collection' => ['required', 'boolean'],
            'sale_type' => ['required', 'string', 'in:regular,lease']
        ]);

        DB::transaction(function () use ($request, $productStockService, &$newdata) {
            $sale_invoice = IdGenerator::generate(['table' => 'sales', 'field' => 'sale_invoice', 'length' => 14, 'prefix' => 'SALE-' . date('ymd')]);

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
                'sale_invoice' => $sale_invoice,
                'sale_type' => $request->sale_type,
                'store_id' => $request->user()->storePreference->store_id
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

            if ($request->sale_type == 'regular') {
                PaymenthistoryController::Newpayament((object) array_merge($request->toArray(), ['sale_id' => $newSale->id]));
            } else {
                $newLeaseHistory = LeasePaymentHistory::create([
                    'sale_id' => $newSale->id,
                    'amount' => $newSale->amount_paid ?? 0,
                    'balance' => ($request->amount_paid ?? 0) - $newSale->total_amount,
                    'paymentmethod_id' => $request->payment_method ?? null
                ]);
            }

            $newdata = Sale::with(['saleitems' => ['productsmodels' => ['product' => ['basicQuantity'], 'collectionType']], 'salerepresentative', 'paymentmethod'])->where('id', $newSale->id)->firstOrFail();
        });
        return [
            ...$productController->productAndModelsJoin($request),
            'newsale' => [...$newdata->toArray(), 'business_profile' => Businessprofile::get()->first()]
        ];
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