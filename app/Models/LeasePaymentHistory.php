<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;


class LeasePaymentHistory extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function amount(): Attribute {
        return Attribute::make(
            get: fn ($value) => $value / 100,
            set: fn ($value) => $value * 100,
        );
    }
    public function balance(): Attribute {
        return Attribute::make(
            get: fn ($value) => $value / 100,
            set: fn ($value) => $value * 100,
        );
    }

    public function paymentMethod(){
        return $this->belongsTo(Paymentmethod::class,"paymentmethod_id","id");
    }

}
