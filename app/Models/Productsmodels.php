<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Productsmodels extends Model
{
    use HasFactory;

    protected $guarded = [];
    public function unitPrice(): Attribute
    {
        return Attribute::make(
            get: fn ($unit_price) => $unit_price / 100,
            set: fn ($unit_price) => $unit_price * 100,
        );
    }
    public function pricePerCollection(): Attribute
    {
        return Attribute::make(
            get: fn ($unit_price) => $unit_price / 100,
            set: fn ($unit_price) => $unit_price * 100,
        );
    }
    public function costPerCollection(): Attribute
    {
        return Attribute::make(
            get: fn ($unit_price) => $unit_price / 100,
            set: fn ($unit_price) => $unit_price * 100,
        );
    }
    public function costPerUnit(): Attribute
    {
        return Attribute::make(
            get: fn ($unit_price) => $unit_price / 100,
            set: fn ($unit_price) => $unit_price * 100,
        );
    }

    public function suppliers()
    {
        return $this->hasMany(Productsupplier::class,'productsmodel_id','id');
    }


    public function product()
    {
        return $this->belongsTo(Product::class);
    }


    public function collectionType()
    {
        return $this->belongsTo(CollectionType::class, 'collection_method', 'id');
    }


    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? false, function ($query, $search) {
            $query->where('model_name', 'Like', '%' . $search . '%');
        })->when($filters['sort'] ?? false, function ($query, $sort) {
            if ($sort === 'created_asc') {
                $query->orderBy('created_at', 'asc');
            } else if ($sort === 'created_desc') {
                $query->orderBy('created_at', 'desc');
            }
        });
    }
}
