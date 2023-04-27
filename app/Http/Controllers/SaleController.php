<?php

namespace App\Http\Controllers;

use App\Models\Productsmodels;
use App\Models\Sale;
use App\Models\Saleitem;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use App\Services\ProductStockService;
use Illuminate\Support\Facades\DB;
use Haruncpi\LaravelIdGenerator\IdGenerator;

class SaleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Sale $sale,Request $request)
    {   
       return[
        'sales' =>  $sale->filter(request()->only('search', 'day'))->with('salerepresentative:id,name')->latest()->paginate(10),
        'filters' => request()->only('search', 'day'),
        'full_url' =>trim($request->fullUrlWithQuery(request()->only('search','day')))
       ];
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
    public function store(Request $request,ProductStockService $productStockService,ProductController $productController)
    {
        $request->validate([
            'customer_fullname' => ['required', 'string', 'max:255'],
            'customer_contact' => ['required', 'string','min:10' ,'max:10'],
            'sub_total' => ['required'],
            'discount_rate' => ['nullable'],
            'total' => ['required'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required'],
            'items.*.productsmodel_id' => ['required', 'distinct'],
            'items.*.quantity' => ['required', 'min:0', 'not_in:0'],
            'items.*.in_collection' => ['required', 'boolean'],
        ]);
        DB::transaction(function () use ($request,$productStockService) {
            $sale_invoice = IdGenerator::generate(['table' => 'sales', 'field' => 'sale_invoice', 'length' => 14, 'prefix' => 'SALE-' . date('ymd')]);
            $newSale = Sale::create([
                'customer_contact' => $request->customer_contact,
                'customer_name' => $request->customer_fullname,
                'sub_total' => $request->sub_total,
                'total_amount' => $request->total,
                'user_id' => 1,
                'discount_rate' => $request->discount_rate,
                'sale_invoice'=>$sale_invoice
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
                $productStockService->decreasestock((Object)$value);
            }
        });
        return $productController->productAndModelsJoin();
    }

    /**
     * Display the specified resource.
     */
    public function show(Sale $sale)
    {
        return [
            'sale' => $sale,
            'sale_representative' => $sale->salerepresentative->name,
            'sale_items'=> $sale->saleitems->map(function($value,$key){
                return[
                    'amount' =>$value->amount,
                    'id' =>$value->id,
                    'unit_price' =>$value->price,
                    'sale_product'=> Productsmodels::with(['collectionType:id,type','product:id,product_name',])->find($value->productsmodel_id),
                    'basic_selling_quantity' => Productsmodels::find($value->productsmodel_id)->basicQuantity()->symbol,
                    'quantity'=> $value->quantity
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
