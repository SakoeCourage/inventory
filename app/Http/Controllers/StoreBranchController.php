<?php

namespace App\Http\Controllers;

use App\Models\StoreBranch;
use Illuminate\Http\Request;

class StoreBranchController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(StoreBranch $store_branch, Request $request)
    {
        return [
            'branches' => $store_branch->filter(request()->only(['search']))
                ->latest()->paginate(10)->withQueryString()
                ->through(fn($c_store_branch) =>
                    [
                        'id' => $c_store_branch->id,
                        'updated_at' => $c_store_branch->updated_at,
                        'created_at' => $c_store_branch->created_at,
                        'branch_name' => $c_store_branch->branch_name,

                    ]),
            'filters' => $request->only(['search']),
            'full_url' => trim($request->fullUrlWithQuery(request()->only('search')))
        ];
    }

    public function toSelect(){
        return StoreBranch::all();
    }
    /**
     * Show the form for creating a new resource.
     */
    public function updateorcreate(Request $request)
    {
        $id = $request->id ?? null;
        $request->validate([
            'branch_name' => ['required', "unique:store_branches,branch_name,{$request->id}"],
        ]);

        StoreBranch::updateOrCreate(['id' => $id ?? null], $request->all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            "branch_name" => ["required", "string", "min:3",]
        ]);

        StoreBranch::create($data);
        return response("New Branch Created", 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(StoreBranch $storeBranch)
    {

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(StoreBranch $storeBranch)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, StoreBranch $storeBranch)
    {
        $data = $request->validate([
            "branch_name" => ["required", "string", "min:3","unique:store_branches,branch_name,except,".$storeBranch->id]
        ]);

        $storeBranch->update($data);

        return response("Branch Updated", 204);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(StoreBranch $storeBranch)
    {
        $storeBranch->delete();

        return response("Branch Deleted", 204);
    }
}
