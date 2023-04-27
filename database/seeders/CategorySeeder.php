<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $productCategories = ["Clothing and accessories",  "Beauty and personal care",  "Home and kitchen appliances",  "Electronics and gadgets",  "Toys and games",  "Sports and outdoor equipment",  "Books and magazines",  "Food and beverages",  "Health and wellness products",  "Pet supplies",  "Automotive parts and accessories",  "Office supplies and stationery",  "Furniture and home decor",  "Jewelry and watches",  "Musical instruments and equipment",  "Arts and crafts supplies",  "Party and celebration supplies",  "Travel gear and luggage",  "Home improvement and tools",  "Baby and maternity products",  "Garden and outdoor living",  "Fitness and exercise equipment",  "School and educational supplies",  "Photography and video equipment",  "Cleaning and household supplies",  "Musical recordings and media",  "Industrial and construction equipment",  "Gifts and novelty items",  "Hunting and fishing equipment",  "Safety and security equipment",  "Religious items and supplies",  "Pet grooming and hygiene products",  "Party and event rentals",  "Craft beer and wine",  "Art and collectibles",  "Gaming consoles and video games","Others"];
        for ($i = 0; $i < count($productCategories); $i++) {
            Category::create(
                ['category' => $productCategories[$i]]
            );
        }
    }
}
