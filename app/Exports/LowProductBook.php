<?php

namespace App\Exports;

use App\Models\Category;
use App\Models\Productsmodels;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class LowProductBook implements WithMultipleSheets
{
    protected $model_ids;

    public function __construct($model_ids){
        $this->model_ids = $model_ids;
    }

    public function sheets(): array
    {
        $categories = null;
        $productModels = Productsmodels::with(['product' => ['category']])->whereIn('id', $this->model_ids)->get();
        
        $categories = $productModels->pluck('product.category')->unique();

        $sheets = [];
        foreach ($categories as $category) {
            $sheets[] = new LowProductsSheetExport($category, $this->model_ids);
        }
        return $sheets;
    }
}
