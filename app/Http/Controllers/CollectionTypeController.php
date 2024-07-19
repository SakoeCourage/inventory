<?php

namespace App\Http\Controllers;

use App\Models\CollectionType;
use Illuminate\Http\Request;

class CollectionTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(CollectionType $collectionType)
    {
        return [
            'packages' => $collectionType->filter(request()->only(['search']))
                ->latest()->paginate(10)->withQueryString()
                ->through(function ($currentCategory) {
                    return [
                        'id' => $currentCategory->id,
                        'created_at' => $currentCategory->created_at,
                        'type' => $currentCategory->type
                    ];
                }),
            'filters' => request()->only('search')
        ];
    }
    /**
     * Display a listing of the resource to select.
     */
    public function toselect()
    {
        return CollectionType::get('type');
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
    public function show(CollectionType $collectionType)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CollectionType $collectionType)
    {

    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $id = $request->id ?? null;
        $request->validate([
            'type' => ['required', 'unique:collection_types,type,' . $id],
        ]);
        
        CollectionType::updateOrCreate(['id' => $id ?? null], $request->all());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CollectionType $collectionType)
    {
        $collectionType->delete();
    }
}
