<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Expenseitems extends Model
{
    use HasFactory;

    public function expensedefinition(){
        return $this->belongsTo(Expensedefinition::class);
    }
    protected $guarded = [];
    public function amount(): Attribute {
        return Attribute::make(
            get: fn ($value) => $value / 100,
            set: fn ($value) => $value * 100,
        );
    }
}
