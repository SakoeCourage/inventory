<?php

namespace App\Http\Controllers;

use App\Models\Expensedefinition;
use Illuminate\Http\Request;

class ExpensedefinitionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Expensedefinition $definition, Request $request)
    {
        return $definition->latest()->paginate(10)->withQueryString();
    }
    /**
     * Display a listing of the resource.
     */
    public function toselect(Expensedefinition $definition)
    {
        return $definition->latest()->get(['id','name']);
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
            'name' => ['required', 'string', 'max:255'],
        ]);

        Expensedefinition::updateOrCreate([
            'id' => $request->id ?? null,
        ],[
            'name' => $request->name
        ]);

        return response('ok');
    }

    /**
     * Display the specified resource.
     */
    public function show(Expensedefinition $expensedefinition)
    {
       
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Expensedefinition $expensedefinition)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Expensedefinition $expensedefinition)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:expensedefinitions,name,' . $expensedefinition->id],
        ]);

        $expensedefinition->update(
            [
                'name' => $request->name
            ]
        );

        return response('ok');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Expensedefinition $expensedefinition)
    {
        $expensedefinition->delete();
    }
}