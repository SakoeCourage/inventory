<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProformaInvoice extends Model
{
    use HasFactory;
    protected $guarded = [];

    protected $casts = [
        'form_data' => 'json',
    ];

    public function totalAmount(): Attribute
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
    public function amountPaid(): Attribute
    {
        return Attribute::make(
            get: fn ($amount) => $amount / 100,
            set: fn ($amount) => $amount * 100,
        );
    }
    public function balance(): Attribute
    {
        return Attribute::make(
            get: fn ($amount) => $amount / 100,
            set: fn ($amount) => $amount * 100,
        );
    }
    public function subTotal(): Attribute
    {
        return Attribute::make(
            get: fn ($amount) => $amount / 100,
            set: fn ($amount) => $amount * 100,
        );
    }
    public function saleitems(){
        return $this->hasMany(ProformaInvoiceSaleItems::class,'proforma_invoice_id');
    } 
  
    public function salerepresentative(){
        return $this->belongsTo(User::class,'user_id');
    }

    public function paymentmethod(){
        return $this->belongsTo(Paymentmethod::class,'paymentmethod_id');
    }

    public function scopeFilter($query, array $filters){
        $query->when($filters['search'] ?? false, function($query, $search){
            $query->where('customer_name', 'Like', '%' . $search . '%');
        })->when($filters['day'] ?? false, function($query,$day){
                $day = date('Y-m-d', strtotime($day));
                $query->whereDate('created_at',$day);
    });
    }

}
