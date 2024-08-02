<?php

namespace App\Http\Controllers;

use App\Models\Productsmodels;
use App\Models\Product;
use App\Models\StoreProduct;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProductsmodelsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Display a listing of the resource.
     */
    public function getProductModelsFromProductId($id)
    {
        $models = Productsmodels::where('product_id', $id)->filter(request()->only(['search']))
            ->latest()->paginate(10)->withQueryString()
            ->through(function ($item) {
                return [
                    'id' => $item->id,
                    'model_name' => $item->model_name
                ];
            })
        ;
        return $models;
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }
    /**
     * Show the form for creating a new resource.
     */
    public function searchProductWithModels(Product $product)
    {

        $storeId = auth()->user()->storePreference->store_id;

        // Fetch products with their related models and categories
        $productsQuery = Product::query()
            ->with([
                'models' => function ($query) use ($storeId) {
                    // Apply constraint to models to include only those in the store
                    $query->whereHas('storeProducts', function ($subQuery) use ($storeId) {
                        $subQuery->where('store_id', $storeId);
                    });
                },
                'category'
            ])
            ->whereHas('storeProducts', function ($query) use ($storeId) {
                $query->where('store_id', $storeId);
            })
            ->when(request('search'), function ($query) {
                $search = request('search');
                $query->where(function ($query) use ($search) {
                    $query->where('product_name', 'like', '%' . $search . '%')
                        ->orWhereHas('models', function ($subQuery) use ($search) {
                            $subQuery->where('model_name', 'like', '%' . $search . '%');
                        });
                });
            })
            ->latest()
            ->select('products.*')
            ->paginate(10)
            ->withQueryString();

        // Format the response using a closure
        $formattedProducts = $productsQuery->through(function ($product) {
            return [
                'id' => $product->id,
                'product_name' => $product->product_name,
                'category' => [
                    'id' => $product->category->id,
                    'category' => $product->category->category,
                ],
                'basic_selling_quantity_id' => $product->basic_selling_quantity_id,
                'created_at' => $product->created_at->toIso8601String(),
                'updated_at' => $product->updated_at->toIso8601String(),
                'has_models' => $product->has_models,
                'models' => $product->models->map(function ($model) {
                    return [
                        'id' => $model->id,
                        'model_name' => $model->model_name,
                        'unit_price' => $model->unit_price,
                        'cost_per_unit' => $model->cost_per_unit,
                        'price_per_collection' => $model->price_per_collection,
                        'cost_per_collection' => $model->cost_per_collection,
                        'quantity_in_stock' => $model->quantity_in_stock,
                        'quantity_per_collection' => $model->quantity_per_collection,
                        'in_collection' => $model->in_collection,
                        'collection_method' => $model->in_collection ? $model->collectionType?->type : null,
                        'created_at' => $model->created_at->toIso8601String(),
                        'updated_at' => $model->updated_at->toIso8601String(),
                    ];
                }),
            ];
        });

        return [
            'products' => $formattedProducts,
            'filters' => request()->only(['search', 'sort']),
        ];
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
    public function show(Productsmodels $productsmodels)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Productsmodels $productsmodels)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Productsmodels $productsmodels)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Productsmodels $productsmodels)
    {
        //
    }
}
