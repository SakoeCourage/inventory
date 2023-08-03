<?php

namespace Database\Seeders;
use App\Models\BasicSellingQuantity;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BasicSellingQuantitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $quantities = ["unit", "Ounce", "Gram","Bottle","Can","Kilogram", "Meter", "Square Foot", "Yard", "Pair"];
        $symbols = ["unit", 'oz', 'g',"bottle","Can", 'kg', 'm', 'ft', 'yd', 'pair'];
        for ($item = 0; $item < count($quantities); $item++) {
            foreach ($quantities as $quantity) {
                $quantity = new BasicSellingQuantity();
                $quantity->name = $quantities[$item];
                $quantity->symbol = $symbols[$item];
                $quantity->save();
                $item += 1;
            }
        }
    
    }
}
