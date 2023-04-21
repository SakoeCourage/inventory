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

    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? false, function ($query, $search) {
            $related_model = Productsmodels::where('model_name', 'Like', '%' . $search . '%')->get('product_id');
            $query->where('product_name', 'Like', '%' . $search . '%')
            ->orWhereIn('id',$related_model->toArray());
        })->when($filters['sort'] ?? false, function ($query, $sort) {
            if ($sort === 'created_asc') {
                $query->orderBy('created_at', 'asc');
            } else if ($sort === 'created_desc') {
                $query->orderBy('created_at', 'desc');
            }
        });
    }
}
