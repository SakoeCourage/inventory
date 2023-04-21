<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Productsupplier extends Model
{
    protected $table = 'productsupplier';
    use HasFactory;
    protected $guarded = [];

    public function supplier(){
        return $this->belongsTo(Supplier::class);
    }
}