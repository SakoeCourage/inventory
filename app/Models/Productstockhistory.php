<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Enums\StockActionEnum;

class Productstockhistory extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'action_type' => StockActionEnum::class
    ];

    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['date'] ?? false, function ($query, $date) {
            $query->whereDate('created_at', $date);
        })->when($filters['sort'] ?? false, function ($query, $sort) {
            if ($sort === 'created_asc') {
                $query->orderBy('created_at', 'asc');
            } else if ($sort === 'created_desc') {
                $query->orderBy('created_at', 'desc');
            }
        });
    }
}
