<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
class Sale extends Model
{
    use HasFactory;
    
    protected $guarded = [];

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
        return $this->hasMany(Saleitem::class,'sale_id');
    } 
    public function refunds(){
        return $this->hasMany(Saleitem::class,'sale_id')->where('is_refunded',1);
    } 
    public function salerepresentative(){
        return $this->belongsTo(User::class,'user_id');
    }
    public function paymenthistory(){
        return $this->hasOne(Paymenthistory::class,'sale_id');
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
    public function scopeDeepFilter($query, array $filters){
        $query->when($filters['search'] ?? false, function($query, $search){
            $query->where('customer_name', 'Like', '%' . $search . '%')
            ->orWhere('sale_invoice', 'Like', '%' . $search . '%')
            ;
        })->when($filters['day'] ?? false, function($query,$day){
                $day = date('Y-m-d', strtotime($day));
                $query->whereDate('created_at',$day);
    });
    }


    public function leasePaymentHistory (){
        return $this->hasMany(LeasePaymentHistory::class);
    }

    public function store(){   
        return $this->belongsTo(Store::class);
    } 

}
