<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class StoreUser extends Pivot
{
    use HasFactory;

    protected $table = "store_users";
    protected $guarded = [];

    protected $increment = true;


}
