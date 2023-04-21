<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stockhistory extends Model
{
    use HasFactory;
    protected $guarded = [];

    protected $casts = [
        'stock_products' => 'array',
    ];

}
