<?php

namespace App\Http\Controllers;

use App\Models\StoreProduct;
use Illuminate\Http\Request;
use App\Imports\StoreProductImport;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;

class StoreProductController extends Controller
{


    public function import(Request $request)
    {
        $request->validate([
            'template_file' => 'required|file|mimes:xlsx,csv',
        ]);

        $file = $request->file('template_file');
        $storeId = $request->user()?->storePreference->store_id;

        try {
            DB::transaction(function () use ($storeId, $file) {
                Excel::import(new StoreProductImport($storeId), $file);
            });

            return response()->json(['message' => 'Import successful'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Import failed: ' . $e->getMessage()], 400);
        }
    }

    /**
     * Display a listing of the resource.
     */
    public function index(StoreProduct $store_product, Request $request)
    {
  
        return [
            'products' => $store_product->where('store_id', $request->user()->storePreference?->store_id)->with([
                'models' => [
                    'product' => ['basicQuantity', 'category'],
                    'collectionType'
                ]
            ])
            ->filter(request()->only(['search', 'category']))
                ->paginate(10)->withQueryString()
                ->through(fn($currentproduct) =>
                    [
                        'id' => $currentproduct->id,
                        'updated_at' => $currentproduct->updated_at,
                        'product_name' => $currentproduct->models->product->product_name,
                        'quantity_in_stock' => $currentproduct->quantity_in_stock,
                        'model_name' => $currentproduct->models->model_name,
                        'basic_quantity' => $currentproduct->models->product->basicQuantity->symbol,
                        'category_name' => $currentproduct->models->product->category->category,
                        'in_collection' => $currentproduct->models->in_collection,
                        'collection_type' => $currentproduct->models?->collectionType?->type,
                        'units_per_collection' => $currentproduct->models?->quantity_per_collection,
                        'quantity' => $currentproduct->quantity_in_stock
                    ]),
            'filters' => $request->only(['search', 'category']),
            'full_url' => trim($request->fullUrlWithQuery(request()->only('search', 'category')))
        ];
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(StoreProduct $storeProduct)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(StoreProduct $storeProduct)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, StoreProduct $storeProduct)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(StoreProduct $storeProduct)
    {
        //
    }
}
