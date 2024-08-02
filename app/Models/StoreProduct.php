<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StoreProduct extends Model
{
    use HasFactory;

    protected $guarded = [];


    public function models()
    {
        return $this->belongsTo(Productsmodels::class, 'productsmodel_id');
    }

    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? false, function ($query, $search) {
            $related_models = Productsmodels::query()
                ->with(['product'])
                ->where('model_name', 'like', '%' . $search . '%')
                ->orWhereHas('product', function ($query) use ($search) {
                    $query->where('product_name', 'like', '%' . $search . '%');
                })
                ->pluck('id');
            $query->whereIn('productsmodel_id', $related_models->toArray());
        })->when($filters['category'] ?? false, function ($query, $category) {
            $related_category_models = Productsmodels::query()
                ->whereHas('product', function ($query) use ($category) {
                    $query->where('category_id', $category);
                })
                ->pluck('id');
            $query->whereIn('productsmodel_id', $related_category_models);
        });
    }
}
