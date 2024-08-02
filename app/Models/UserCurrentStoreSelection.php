<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserCurrentStoreSelection extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function storeBranch()
    {
        return $this->hasOneThrough(StoreBranch::class, Store::class, 'id', 'id', 'store_id', 'store_branch_id');
    }

    public function store() {
        return $this->belongsTo(Store::class, 'store_id');
    }

    

}
