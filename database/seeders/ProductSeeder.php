<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\BasicSellingQuantity;
use App\Models\Productsmodels;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($item = 0; $item < 70; $item++) {
            $newproduct =  Product::create([
                'product_name' => fake()->words(2,true),
                'basic_selling_quantity_id' => rand(1, 8),
                'has_models' => true,
                'quantity_in_stock' => 0,
                'category_id' => rand(1,36)
            ]);
    
            for($models=0; $models < rand(15,25); $models ++) {
                $incollection = rand(0,1);
                Productsmodels::create([
                    'model_name' => fake()->words(2,true),
                    'unit_price' => fake()->numberBetween(1,200),
                    'in_collection' => (Boolean)$incollection,
                    'price_per_collection' => (Boolean)$incollection ? fake()->numberBetween(6,200): null,
                    'quantity_per_collection' => (Boolean)$incollection ? fake()->numberBetween(12,200): null,
                    'collection_method' => rand(1, 7),
                    'product_id' => $newproduct->id
                ]);
            }
        }
    }
}
