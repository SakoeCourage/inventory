<?php

namespace App\Http\Controllers;

use App\Models\BasicSellingQuantity;
use App\Models\CollectionType;
use App\Models\Product;
use App\Models\Productsmodels;
use App\Models\StoreProduct;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Helpers\PaginationHelper;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Product $product, Request $request)
    {
        return [
            'products' => $product->withCount("models")->filter(request()->only(['search', 'category']))
                ->latest()->paginate(10)->withQueryString()
                ->through(fn($currentproduct) =>
                    [
                        'id' => $currentproduct->id,
                        'updated_at' => $currentproduct->updated_at,
                        'product_name' => $currentproduct->product_name,
                        'quantity_in_stock' => $currentproduct->quantity_in_stock,
                        'basic_quantity' => $currentproduct->basicQuantity->symbol,
                        'category_name' => $currentproduct->category->category,
                        "models_count" => $currentproduct->models_count
                    ]),
            'filters' => $request->only(['search', 'category']),
            'full_url' => trim($request->fullUrlWithQuery(request()->only('search', 'category')))
        ];
    }
    /**
     * Display a listing of the resource.
     */
    public function getProductByIdandName($id, $product_name)
    {
        $product = Product::where('id', $id)->where('product_name', $product_name)->firstOrFail();

        return [
            'product' => $product,
            'basic_quantity' => $product->basicQuantity
        ];
    }


    public function productAndModelsJoin(Request $request)
    {

        $storeId = $request->user()->storePreference->store_id;

        $productsCollection = DB::table('store_products')
            ->join('productsmodels', 'store_products.productsmodel_id', '=', 'productsmodels.id')
            ->join('products', 'productsmodels.product_id', '=', 'products.id')
            ->join('basic_selling_quantities', 'products.basic_selling_quantity_id', '=', 'basic_selling_quantities.id')
            ->where('store_products.store_id', $storeId)
            ->select(
                'products.id as product_id',
                'products.product_name',
                'products.has_models',
                'products.category_id',
                'products.created_at as product_created_at',
                'products.updated_at as product_updated_at',
                'basic_selling_quantities.id as basic_quantity_id',
                'basic_selling_quantities.name as basic_quantity_name',
                'basic_selling_quantities.symbol as basic_quantity_symbol',
                'basic_selling_quantities.created_at as basic_quantity_created_at',
                'basic_selling_quantities.updated_at as basic_quantity_updated_at'
            )
            ->distinct()
            ->get();




        return [
            'models' => DB::table('store_products')
                ->join('productsmodels', 'store_products.productsmodel_id', '=', 'productsmodels.id')
                ->leftJoin('collection_types', 'productsmodels.collection_method', '=', 'collection_types.id')
                ->where('store_products.store_id', $storeId)
                ->select(
                    'productsmodels.id',
                    'productsmodels.model_name',
                    DB::raw('productsmodels.unit_price / 100 as unit_price'),
                    'store_products.quantity_in_stock as quantity_in_stock',
                    'productsmodels.in_collection',
                    DB::raw('productsmodels.price_per_collection / 100 as price_per_collection'),
                    'productsmodels.quantity_per_collection',
                    DB::raw('productsmodels.cost_per_unit / 100 as cost_per_unit'),
                    DB::raw('productsmodels.cost_per_collection / 100 as cost_per_collection'),
                    'productsmodels.collection_method',
                    'productsmodels.product_id',
                    'productsmodels.created_at',
                    'productsmodels.updated_at',
                    'collection_types.id as collection_type_id',
                    'collection_types.type as collection_type'
                )
                ->distinct()
                ->get(),
            'products' => $productsCollection->map(function ($product) {
                return [

                    'id' => $product->product_id,
                    'product_name' => $product->product_name,
                    'has_models' => $product->has_models,
                    'category_id' => $product->category_id,
                    'created_at' => $product->product_created_at,
                    'updated_at' => $product->product_updated_at,
                    'basic_quantity' => [
                        'id' => $product->basic_quantity_id,
                        'name' => $product->basic_quantity_name,
                        'symbol' => $product->basic_quantity_symbol,
                        'created_at' => $product->basic_quantity_created_at,
                        'updated_at' => $product->basic_quantity_updated_at,
                    ]
                ];
            })
        ];
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_name' => ['required', 'string', 'unique:products,product_name'],
            'basic_selling_quantity' => ['required'],
            'category' => ['required'],
            'product_models' => ['required', 'array', 'min:1']
        ]);

        DB::transaction(function () use ($request) {
            $newproduct = Product::create([
                'product_name' => $request->product_name,
                'category_id' => $request->category,
                'basic_selling_quantity_id' => BasicSellingQuantity::where('name', $request->basic_selling_quantity)->firstOrFail()->id,
                'has_models' => true,
                'quantity_in_stock' => 0
            ]);

            foreach ($request->product_models as $model) {
                Productsmodels::create([
                    'model_name' => $model['model_name'],
                    'unit_price' => $model['unit_price'],
                    'in_collection' => $model['in_collection'],
                    'price_per_collection' => $model['price_per_collection'] ?? null,
                    'quantity_per_collection' => $model['quantity_per_collection'] ?? null,
                    'collection_method' => $model['in_collection'] ? CollectionType::where('type', $model['collection_method'])->firstOrFail()->id : null,
                    'product_id' => $newproduct->id
                ]);
            }

            return response('ok', 200);
        });
    }

    /**
     * Display the specified resource.
     */
    public function show($product)
    {
        $product = Product::where('id', $product);
        return [
            'product' => $product->get(['id', 'product_name', 'category_id'])->first(),
            'basic_selling_quantity' => $product->first()->basicQuantity,
            'models' => $product->first()->models->map(function ($model) {
                return [
                    'id' => $model->id,
                    'collection_method' => (bool) $model->in_collection ? CollectionType::where('id', $model->collection_method)->firstOrFail()->type : null,
                    'in_collection' => (bool) $model->in_collection,
                    'model_name' => $model->model_name,
                    'price_per_collection' => $model->price_per_collection,
                    'quantity_per_collection' => $model->quantity_per_collection,
                    'unit_price' => $model->unit_price,
                ];
            })
        ];
    }


    public function getUnattendedProductsWithCategoriesAndModels()
    {
        $products = Product::deepSearch(request()->only('search', 'category'))
            ->join('productsmodels', 'products.id', '=', 'productsmodels.product_id')
            ->join('categories', 'products.category_id', 'categories.id')
            ->where('productsmodels.quantity_in_stock', 0)
            ->selectRaw(
                'categories.category,
                products.product_name,
                products.id as product_id,
                productsmodels.id as model_id,
                productsmodels.model_name ,
                productsmodels.quantity_in_stock
                '
            )
            ->get()
            ->groupBy(['category', 'product_name']);

        return [
            'products' => PaginationHelper::paginate($products, 5),
            'filters' => request()->only('search', 'category'),
            'full_url' => trim(request()->fullUrlWithQuery(request()->only('search', 'category')))
        ];
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        // return $product;
        $request->validate([
            'product_name' => ['required', 'string', 'unique:products,product_name,' . $product->id],
            'basic_selling_quantity' => ['required', 'string'],
            'product_models' => ['required', 'array', 'min:1'],
            'category' => ['required'],
        ]);

        DB::transaction(function () use ($request, $product) {
            $product->update([
                'product_name' => $request->product_name,
                'product_name' => $request->product_name,
                'category_id' => $request->category,
                'basic_selling_quantity_id' => BasicSellingQuantity::where('name', $request->basic_selling_quantity)->firstOrFail()->id,
            ]);

            foreach ($request->product_models as $model) {
                $product->models()->updateOrCreate(
                    [
                        'id' => $model['id'] ?? null,

                    ],
                    [
                        'model_name' => $model['model_name'],
                        'unit_price' => $model['unit_price'],
                        'in_collection' => $model['in_collection'],
                        'price_per_collection' => $model['price_per_collection'] ?? null,
                        'quantity_per_collection' => $model['quantity_per_collection'] ?? null,
                        'collection_method' => $model['in_collection'] ? CollectionType::where('type', $model['collection_method'])->firstOrFail()->id : null,
                        'product_id' => $product->id
                    ]
                );
            }

            return response('ok', 200);
        });
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
    }
}
