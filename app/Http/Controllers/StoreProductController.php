<?php

namespace App\Http\Controllers;

use App\Models\StoreProduct;
use App\Models\Productsmodels;
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
                        'model_id' => $currentproduct->models->id,
                        'product_id' => $currentproduct->models->product->id,
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
    public function InStoreProducts(Request $request)
    {
        $storeId = \Illuminate\Support\Facades\Auth::user()->storePreference->store_id;

        $availableProducts = \App\Models\Product::filter(request()->only(['search', 'category']))
            ->whereHas('models.storeProducts', function ($query) use ($storeId) {
                $query->where('store_id', $storeId);
            })->with([
                        'models' => function ($query) use ($storeId) {
                            $query->whereHas('storeProducts', function ($subQuery) use ($storeId) {
                                $subQuery->where('store_id', $storeId);
                            });
                        }
                    ])
            ->latest()->paginate(10)->withQueryString()
            ->through(fn($currentproduct) =>
                [
                    'id' => $currentproduct->id,
                    'updated_at' => $currentproduct->updated_at,
                    'product_name' => $currentproduct->product_name,
                    'quantity_in_stock' => $currentproduct->quantity_in_stock,
                    'basic_quantity' => $currentproduct->basicQuantity->symbol,
                    'category_name' => $currentproduct->category->category
                ]);

        return [
            'products' => $availableProducts,
            'filters' => $request->only(['search', 'category']),
            'full_url' => trim($request->fullUrlWithQuery(request()->only('search', 'category')))
        ]
        ;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    public function NotInStoreProductsModels(Request $request)
    {
        $excludedStoreId = $request->user()?->storePreference?->store_id;

        $productModels = Productsmodels::with(['stores'])
            ->whereDoesntHave('stores', function ($query) use ($excludedStoreId) {
                $query->where('store_id', $excludedStoreId);
            })
            ->join('products', 'productsmodels.product_id', '=', 'products.id')
            ->join('basic_selling_quantities', 'products.basic_selling_quantity_id', '=', 'basic_selling_quantities.id')
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->leftJoin('collection_types', 'productsmodels.collection_method', '=', 'collection_types.id')
            ->selectRaw("
                products.product_name as product_name,
                productsmodels.id as model_id,
                productsmodels.model_name as model_name,
                basic_selling_quantities.symbol as basic_quantity,
                categories.category as category_name,
                productsmodels.in_collection as in_collection,
                productsmodels.quantity_per_collection as units_per_collection,
                collection_types.type as collection_type  
            ")
            ->where(function ($query) use ($request) {
                $sk = $request?->search;
                if ($sk) {
                    $query->where('product_name', 'Like', '%' . $sk . '%')
                        ->orWhere('model_name', 'Like', "%" . $sk . "%")
                    ;
                }
            })
            ->orderBy('product_name')
            ->paginate(10)
            ->withQueryString()
            ->through(fn($current) => [
                'model_id' => $current->model_id,
                'product_name' => $current->product_name,
                'model_name' => $current->model_name,
                'basic_quantity' => $current->basic_quantity,
                'category_name' => $current->category_name,
                'in_collection' => $current->in_collection,
                'collection_type' => $current?->collection_type,
                'units_per_collection' => $current->units_per_collection,
                'stores' => $current->stores
            ]);

        return [
            'products' => $productModels,
            'filters' => $request->only(['search']),
            'full_url' => trim($request->fullUrlWithQuery(request()->only('search')))
        ];
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
