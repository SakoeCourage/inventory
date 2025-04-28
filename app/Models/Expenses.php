<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Expenses extends Model
{
    use HasFactory;
    protected $guarded = [];
    public function totalAmount(): Attribute {
        return Attribute::make(
            get: fn ($value) => $value / 100,
            set: fn ($value) => $value * 100,
        );
    }

    public function author(){
        return $this->belongsTo(User::class, 'user_id');
    }
    public function store(){   
        return $this->belongsTo(Store::class);
    } 
    public function expenseitems(){
        return $this->hasMany(Expenseitems::class,'expense_id','id');
    }

    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['filter'] ?? false, function ($query, $sort) {
            if ($sort === 'my submissions') {
                $query->where('user_id',Auth()->user()->id);
            } else if ($sort === 'all submissions') {
                return;
            }
        })
        ->when($filters['status'] ?? false, function ($query, $status) {
            if ( $status === 'pending') {
                $query->where('status',0);
            }else if($status === 'declined'){
                $query->where('status',2);
            }else if($status === 'approved'){
                $query->where('status',1);
            }
            else if ($status === 'all expenses') {
              $query->whereIn('status',[0,1,2]);
            }
        });
    }
}
