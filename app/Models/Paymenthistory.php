<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Paymenthistory extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function amount(): Attribute
    {
        return Attribute::make(
            get: fn($amount) => $amount / 100,
            set: fn($amount) => $amount * 100
        );
    }

    public function paymentmethod()
    {
        return $this->belongsTo(Paymentmethod::class, 'paymentmethod_id');
    }

    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['paymentmethod'] ?? false, function ($query, $id) {
            $query->where('paymentmethod_id', $id);
        })
            ->when($filters['day'] ?? false, function ($query, $day) {
                $query->whereDate('created_at', $day);
            });
    }


}