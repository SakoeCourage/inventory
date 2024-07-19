<?php

namespace App\Exports;

use App\Models\Category;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class ProductCategoryExport implements WithMultipleSheets
{
    public function sheets(): array
    {
        $sheets = [];
        $categories = Category::all();
        foreach ($categories as $category) {
            $sheets[] = new CategorySheetExport($category);
        }
        return $sheets;
    }
}
