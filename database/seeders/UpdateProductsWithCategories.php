<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UpdateProductsWithCategories extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $product = Product::all();
        $product->each(function($prod,$key){
            $prod->update([
                'category_id' => rand(1,36)
            ]);
        });
    }
}
