<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Category $category)
    {
        return [
            'category' => $category->filter(request()->only(['search']))
                ->latest()->paginate(10)->withQueryString()
                ->through(function ($currentCategory) {
                    return [
                        'id' => $currentCategory->id,
                        'created_at' => $currentCategory->created_at,
                        'category' => $currentCategory->category,
                        'product' => $currentCategory->products->count(),
                        'productsmodels' => $currentCategory->productsmodels->count(),
                        'in_stock' => $currentCategory->products->sum('quantity_in_stock')
                    ];
                }),
            'filters' => request()->only('search')
        ];
    }

    public function toselect()
    {
        return Category::orderBy('category', 'asc')->get(['id', 'category']);
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
    public function show(Category $category)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request)
    {
        if ($request->category === 'Others') {
            throw ValidationException::withMessages(
                ['category' => 'Cannot update or Create with this name']
            );
        }
        $id = $request->id ?? null;
        $request->validate([
            'category' => ['required', 'unique:categories,category,' . $id],
        ]);

        Category::updateOrCreate(['id' => $id ?? null], $request->all());
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        if($category->category == "Others"){
           throw  new \Exception('Others is read only');
        }
       DB::transaction(function()use($category){
        $otherCategory = Category::where('category', 'Others')->first();
        Product::where('category_id', $category->id)
            ->update([
                'category_id' => $otherCategory->id
            ]);
        $category->delete();
       });
    }
}
