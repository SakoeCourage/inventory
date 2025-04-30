<?php

namespace App\Smartalgorithms;

use App\Models\Saleitem;
use Carbon\Carbon;
use DateTime;
use Illuminate\Database\Eloquent\Collection;


class Outofstock
{
    private DateTime $two_weeks_ago;
    private Collection $get_recent_sale_items;



    public function __construct(public int $store_id,public ?array $product_models = null)
    {

        $sale_items = Saleitem::query()
            ->join('store_products', 'saleitems.productsmodel_id', '=', 'store_products.productsmodel_id')
            ->where('store_products.store_id', '=', $this->store_id)
            ->select(
                'saleitems.*',
                'store_products.quantity_in_stock',
            );

        if ($product_models) {
            $sale_items->whereIn('saleitems.productsmodel_id', $product_models);
        }

        $this->two_weeks_ago = Carbon::now()->subWeek(2);
        $this->get_recent_sale_items = $sale_items->with([
            'productsmodels' => [
                'product' => ['basicQuantity'],
                'collectionType'
            ]
        ])
            ->whereDate('saleitems.created_at', '>=', $this->two_weeks_ago)
            ->where('saleitems.quantity', '>', 0)->latest()->limit(20)->get();
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

    public function run(): object
    {
        $most_sold_product_models = $this->get_recent_sale_items->unique('productsmodel_id');

        $most_sold_with_habits = $most_sold_product_models->map(function ($product_sale_item, $key) {
            
            $product_model = $product_sale_item->productsmodels;
            $average_seling_quantity = $this->getProductsellinghabit($product_model->id);
            return [
                'stock_level' => $this->CategorizedHabits($product_sale_item->quantity_in_stock, $average_seling_quantity),
                'models_quantity_in_stock' => $product_sale_item->quantity_in_stock,
                'percentage' => floor(($product_sale_item->quantity_in_stock / $average_seling_quantity) * 100),
                'recommended_quantity' => $average_seling_quantity,
                'model_name' => $product_model->model_name,
                'product_name' => $product_model->product->product_name,
                'model_id' => $product_model->id,
                'product_id' => $product_model->product->id,
                'in_collection' => $product_model->in_collection,
                'basic_quantity' => $product_model->product->basicQuantity->name,
                'collection_type' => $product_model?->collectionType?->type,
                'quantity_per_collection' => $product_model?->quantity_per_collection
            ];
        });

        return $most_sold_with_habits;
    }
}
