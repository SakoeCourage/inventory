<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? false, function ($query, $search) {
            $query->where('store_name', 'Like', '%' . $search . '%');
        })->when($filters['branch'] ?? false, function ($query, $branch_id) {
            $query->where('store_branch_id', $branch_id);
        });
        ;
    }

    public function branch (){
        return $this->belongsTo(StoreBranch::class,'store_branch_id');
    }

}
