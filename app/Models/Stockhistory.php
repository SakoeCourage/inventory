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

    public function supplier()
    {
        return $this->hasOne(Supplier::class, 'id', 'supplier_id');
    }

    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? false, function ($query, $search) {
            $query->where('purchase_invoice_number', 'Like', '%' . $search . '%');
        })->when($filters['record_date'] ?? false, function ($query, $day) {
            $day = date('Y-m-d', strtotime($day));
            $query->whereDate('record_date', $day);
        })->when($filters['supplier'] ?? false, function ($query, $supplier) {
            $query->where('supplier_id', $supplier);
        })
        ;
    }
}
