<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use Illuminate\Database\Seeder;


class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            // CollectionTypeSeeder::class,
            RoleSeeder::class,
            UserSeeder::class,
            // BasicSellingQuantitySeeder::class,
            // ProductSeeder::class,
            // SupplierSeeder::class,
            // CategorySeeder::class,
            PaymentmethodSeeder::class
        ]);
    }
}
