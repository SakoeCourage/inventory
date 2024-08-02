<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    protected $guarded = [];


    public function basicQuantity()
    {
        return $this->belongsTo(BasicSellingQuantity::class, 'basic_selling_quantity_id', 'id');
    }
    public function models()
    {
        return $this->hasMany(Productsmodels::class);
    }
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function storeProducts()
    {
        return $this->hasManyThrough(StoreProduct::class, Productsmodels::class, 'product_id', 'productsmodel_id');
    }

    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? false, function ($query, $search) {
            $related_model = Productsmodels::where('model_name', 'Like', '%' . $search . '%')->get('product_id');
            $query->where('product_name', 'Like', '%' . $search . '%')
                ->orWhereIn('id', $related_model->toArray());
        })->when($filters['category'] ?? false, function ($query, $category) {
            $query->where('category_id', $category);
        });
    }

    public function scopeDeepSearch($query, array $filters)
    {

        $query->when($filters['search'] ?? false, function ($query, $search) {
            $related_model = Productsmodels::where('model_name', 'Like', '%' . $search . '%')->pluck('product_id');
            $query->where('product_name', 'Like', '%' . $search . '%')
                ->orWhereIn('id', $related_model);
        })->when($filters['category'] ?? false, function ($query, $category) {
            $query->where('category_id', $category);
        });
    }



}
