<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserSetting extends Model
{
    /** @use HasFactory<\Database\Factories\UserSettingFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'settings',
    ];

    protected $casts = [
        'settings' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public static function defaultSettings(): array
    {
        return [
            'mail_setting' => [
                'new_expense_request' => true,
                'new_invoice' => true,
                'out_of_stock' => true,
                'stock_reduction' => true,
            ],
        ];
    }

}
