<?php

namespace App\Http\Controllers;

use App\Models\CollectionType;
use Illuminate\Http\Request;

class CollectionTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CollectionType $collectionType)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CollectionType $collectionType)
    {
        //
    }
}
