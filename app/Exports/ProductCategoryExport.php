<?php

namespace App\Exports;

use App\Models\Category;
use App\Models\Product;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class ProductCategoryExport implements WithMultipleSheets
{

    protected $categories = null;
    protected  $product_ids = null;

    public function __construct($product_ids)
    {
        $this->product_ids = $product_ids;

        if ($product_ids != null && (is_array(value: $product_ids) && !empty($product_ids))) {

            $product_listed_categories = Product::whereIn("id", $product_ids)
                ->get()
                ->pluck("category_id")
                ->unique();
            $this->categories = Category::whereIn("id",$product_listed_categories)->get();
            
        } else {
            $this->categories = Category::all();
        }
    }

    public function sheets(): array
    {
        $sheets = [];

        foreach ($this->categories as $category) {
            $sheets[] = new CategorySheetExport($category,$this->product_ids);
        }
        return $sheets;
    }
}
