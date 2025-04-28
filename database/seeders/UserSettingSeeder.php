<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\User::with('settings')->each(function ($user) {
            if (!$user->settings) {
                $user->settings()->create([
                    'settings' =>  \App\Models\UserSetting::defaultSettings(),
                ]);
            }
        });
    }
}
