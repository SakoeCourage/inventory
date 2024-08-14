<?php

namespace App\Http\Controllers;

use App\Models\Store;
use App\Models\StoreProduct;
use App\Models\User;
use App\Models\UserCurrentStoreSelection;
use App\Services\ProductStockService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use \Illuminate\Support\Facades\DB;

class StoreController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Store $store, Request $request)
    {
        return [
            'stores' => $store->with('branch')->filter(request()->only(['search', 'branch']))
                ->latest()->paginate(10)->withQueryString()
                ->through(fn($currentStore) =>
                    [
                        'id' => $currentStore->id,
                        'updated_at' => $currentStore->updated_at,
                        'created_at' => $currentStore->created_at,
                        'store_name' => $currentStore->store_name,
                        'branch_name' => $currentStore->branch?->branch_name,
                        'store_branch_id' => $currentStore->branch?->id

                    ]),
            'filters' => $request->only(['search', 'branch']),
            'full_url' => trim($request->fullUrlWithQuery(request()->only('search', 'branch')))
        ];
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
    }

    public function toggleUserPreferredStore(Request $request)
    {
        UserCurrentStoreSelection::where("user_id", Auth()->user()->id)
            ->update([
                'store_id' => $request->store_id
            ]);

        return response("Store Preference Changed", 200);
    }
    public function toSelect()
    {
        return Store::with('branch')->get()
            ->map(fn($entry) => [
                'id' => $entry->id,
                'store_name' => $entry->store_name,
                'branch_name' => $entry->branch?->branch_name
            ])
        ;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Store $store)
    {
        $varlidation_result = $request->validate([
            'store_name' => ['required', 'string', 'min:3', 'unique:stores,store_name'],
            'store_branch_id' => ['required']
        ]);

        $store->create($varlidation_result);

        return response("New Store Add", 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(Store $store)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Store $store)
    {


    }

    /**
     * Update the specified resource in storage.
     */
    public function updateorcreate(Request $request, Store $store)
    {
        $id = $request->id ?? null;
        $request->validate([
            'store_name' => ['required', 'string', 'min:3', 'unique:stores,store_name,' . $id],
            'store_branch_id' => ['required']
        ]);
        Store::updateOrCreate(['id' => $id ?? null], $request->all());
        return response("Store Updated", 204);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Store $store)
    {
        $result = $store->delete();

        if ($result) {
            return response("Store Deleted", 204);
        }

        return response("Store Not Found", 404);
    }


    public function toggleProductToStore(Request $request, ProductStockService $stockService)
    {

        $validationResponse = $request->validate([
            'store_id' => ['required'],
            'model_id' => ['required']
        ]);

        $model_in_store = StoreProduct::where([
            'store_id' => $validationResponse['store_id'],
            'productsmodel_id' => $validationResponse['model_id']
        ])->first();

        if ($model_in_store) {
            \Illuminate\Support\Facades\DB::transaction(function () use ($model_in_store, $stockService, $request) {
                if ($model_in_store->quantity_in_stock > 0) {
                    $stockService->decreasestock((object) [
                        'quantity' => $model_in_store->quantity_in_stock,
                        'description' => 'for store reset',
                        'productsmodel_id' => $request['model_id']
                    ]);
                }
                $model_in_store->delete();
            });

        } else {
            StoreProduct::create([
                'store_id' => $validationResponse['store_id'],
                'productsmodel_id' => $validationResponse['model_id'],
                'quantity_in_stock' => 0
            ]);
        }
        $model = \App\Models\Productsmodels::with(['collectionType', 'product' => ['basicQuantity']])
            ->where("id", $validationResponse['model_id'])
            ->first();

        return response()->json($model, \Illuminate\Http\Response::HTTP_OK);
    }

    public function setInitialStoreProductQuantity(Request $request, ProductStockService $stockService)
    {
        $validationResponse = $request->validate([
            'store_id' => ['required'],
            'model_id' => ['required'],
            'quantity' => ['required', 'numeric', 'min:1']
        ]);

        $model_in_store = StoreProduct::where([
            'store_id' => $validationResponse['store_id'],
            'productsmodel_id' => $validationResponse['model_id']
        ])->first();

        if ($model_in_store) {
            DB::transaction(function () use ($model_in_store, $validationResponse, $stockService, $request) {
                $stockService->increasestock((object) [
                    'quantity' => $request['quantity'],
                    'description' => 'from manual initial stock entry',
                    'productsmodel_id' => $request['model_id'],
                    'store_id' => $request['store_id']
                ]);
            });
        } else {
            return response("Store Product Not Found", \Illuminate\Http\Response::HTTP_NOT_FOUND);
        }

        return response("Store Product Updated", \Illuminate\Http\Response::HTTP_OK);
    }

    public function productQuantityToStore(Request $request, ProductStockService $stockService)
    {
        $validationResponse = $request->validate([
            'store_id' => ['required'],
            'model_id' => ['required'],
            'quantity' => ['required', 'numeric', 'min:1']
        ]);

        DB::transaction(function () use ($validationResponse, $stockService, $request) {
            StoreProduct::create([
                'store_id' => $validationResponse['store_id'],
                'productsmodel_id' => $validationResponse['model_id']
            ]);

            $stockService->increasestock((object) [
                'quantity' => $request['quantity'],
                'description' => 'from manual initial stock entry',
                'productsmodel_id' => $request['model_id'],
                'store_id' => $request['store_id']

            ]);
        });

        return response("Store Product Updated", \Illuminate\Http\Response::HTTP_OK);
    }

}
