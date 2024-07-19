<?php

namespace App\Http\Controllers;

use App\Models\Store;
use Illuminate\Http\Request;

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
}
