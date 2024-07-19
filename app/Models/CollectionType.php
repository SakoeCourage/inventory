<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CollectionType extends Model
{
    use HasFactory;

    protected $guarded = [];
    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? false, function ($query, $search) {
            $query->where('type', 'Like', '%' . $search . '%');
        })->when($filters['sort'] ?? false, function ($query, $sort) {
            if ($sort === 'created_asc') {
                $query->orderBy('created_at', 'asc');
            } else if ($sort === 'created_desc') {
                $query->orderBy('created_at', 'desc');
            }
        });
    }
}
