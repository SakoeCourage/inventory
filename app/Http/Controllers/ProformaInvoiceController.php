<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Businessprofile;
use App\Models\ProformaInvoice;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use App\Models\ProformaInvoiceSaleItems;

class ProformaInvoiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(ProformaInvoice $invoice, Request $request)
    {
        return [
            'invoices' => $invoice->where('store_id',$request->user()->storePreference->store_id)->filter(request()->only('search', 'day'))->with('salerepresentative:id,name')->latest()->paginate(10),
            'filters' => request()->only('search', 'day'),
            'full_url' => trim($request->fullUrlWithQuery(request()->only('search', 'day')))
        ];
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
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
    public function store(Request $request)
    {
        $newdata = null;
        $request->validate([
            'customer_fullname' => ['required', 'string', 'max:255'],
            'customer_contact' => ['required', 'string', 'min:10', 'max:10'],
            'payment_method' => ['nullable'],
            'sub_total' => ['required'],
            'balance' => ['nullable'],
            'amount_paid' => ['nullable', Rule::when(fn() => $request->amount_paid < $request->total, ['min:' . $request->total])],
            'discount_rate' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'total' => ['required'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required'],
            'items.*.productsmodel_id' => ['required', 'distinct'],
            'items.*.quantity' => ['required', 'min:0', 'not_in:0'],
            'items.*.in_collection' => ['required', 'boolean']
        ]);

        DB::transaction(function () use ($request,&$newdata) {
            $newInvoice = ProformaInvoice::create([
                'customer_contact' => $request->customer_contact,
                'customer_name' => $request->customer_fullname,
                'sub_total' => $request->sub_total,
                'total_amount' => $request->total,
                'paymentmethod_id' => $request->payment_method,
                'user_id' => auth()->user()->id,
                'discount_rate' => $request->discount_rate,
                'balance' => $request->balance ?? 0,
                'amount_paid' => $request->amount_paid ?? $request->total,
                'form_data' => $request->all(),
                'store_id' => $request->user()->storePreference->store_id
            ]);

            foreach ($request->items as $key => $value) {
                 ProformaInvoiceSaleItems::create([
                    'proforma_invoice_id' => $newInvoice->id,
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
            }
            $newdata = ProformaInvoice::with(['saleitems'=>['productsmodels'=>['product'=>['basicQuantity'],'collectionType']],'salerepresentative','paymentmethod'])->where('id',$newInvoice->id)->firstOrFail();
        });
        
        return response($newdata,200);
    }

    

    /**
     * Display the specified resource.
     */
    public function show($proformaInvoiceID)
    {
       
        $newdata = ProformaInvoice::with(['saleitems'=>['productsmodels'=>['product'=>['basicQuantity'],'collectionType']],'salerepresentative','paymentmethod'])->where('id',$proformaInvoiceID)->firstOrFail();
        return response([...$newdata->toArray(),'business_profile'=>Businessprofile::get()->first()], 200);
    }



    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProformaInvoice $proformaInvoice)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ProformaInvoice $proformaInvoice)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProformaInvoice $proformaInvoice)
    {
        return $proformaInvoice->delete();
    }
}
