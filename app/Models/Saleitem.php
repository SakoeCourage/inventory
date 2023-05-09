<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Saleitem extends Model
{
    use HasFactory;
    protected $guarded = [];
    public function profit(): Attribute
    {
        return Attribute::make(
            get: fn ($amount) => $amount / 100,
            set: fn ($amount) => $amount * 100,
        );
    }
    public function amount(): Attribute
    {
        return Attribute::make(
            get: fn ($amount) => $amount / 100,
            set: fn ($amount) => $amount * 100,
        );
    }
    public function price(): Attribute
    {
        return Attribute::make(
            get: fn ($amount) => $amount / 100,
            set: fn ($amount) => $amount * 100,
        );
    }
    
    public function discountRate(): Attribute
    {
        return Attribute::make(
            get: fn ($amount) => $amount / 100,
            set: fn ($amount) => $amount * 100,
        );
    }

    public function productsmodels(){
        return $this->belongsTo(Productsmodels::class,'productsmodel_id');
    }
}
