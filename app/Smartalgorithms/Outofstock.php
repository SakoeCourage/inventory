<?php

namespace App\Smartalgorithms;

use App\Models\Saleitem;
use Carbon\Carbon;
use DateTime;
use Illuminate\Database\Eloquent\Collection;


readonly class Outofstock
{
    private  DateTime $two_weeks_ago;

    private  Collection $get_recent_sale_items;


    public function __construct()
    {

        $this->two_weeks_ago = Carbon::now()->subWeek(2);
        $this->get_recent_sale_items = Saleitem::with(['productsmodels' => ['product']])->whereDate('created_at', '>=', $this->two_weeks_ago)->latest()->get();
    }



    public function getProductsellinghabit($mod_id): float
    {

        $model_sales = $this->get_recent_sale_items->where('productsmodel_id', $mod_id);
        $model_sales_count = $model_sales->count();
        return floor($model_sales->sum('quantity') / $model_sales_count);
    }



    public function CategorizedHabits($quantity_in_stock, $average_seling_quantity): string
    {
        $category = 'EnoughInStock';
        if ($quantity_in_stock <= 0) {
            $category = "OutOfStock";
        } elseif (($quantity_in_stock > 0) && ($quantity_in_stock < $average_seling_quantity)) {
            $category = "BelowRecommended";
        }
        return $category;
    }



    public function main(): object
    {

        $most_sold_product_models = $this->get_recent_sale_items->pluck('productsmodels')->unique();
        $most_sold_with_habits = $most_sold_product_models->map(function ($product_model, $key) {
            $average_seling_quantity = $this->getProductsellinghabit($product_model->id);
            return [
                'stock_level' => $this->CategorizedHabits($product_model->quantity_in_stock, $average_seling_quantity),
                'models_quantity_in_stock' => $product_model->quantity_in_stock,
                'percentage' => floor(($product_model->quantity_in_stock / $average_seling_quantity) * 100),
                'recommended_quantity' => $average_seling_quantity,
                'model_name' => $product_model->model_name,
                'product_name' => $product_model->product->product_name,
                'model_id' => $product_model->id,
                'product_id' => $product_model->product->id,

            ];
        });

        return $most_sold_with_habits;
    }
}
