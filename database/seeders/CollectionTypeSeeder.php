<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\CollectionType;

class CollectionTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $collections = ["carton", "box", "case", "crate", "pallet", "bundle", "bag"];
        for ($item = 0; $item < count($collections); $item++) {
            foreach ($collections as $collection) {
                $collection = new CollectionType();
                $collection->type = $collections[$item];
                $collection->save();
                $item += 1;
            }
        }
    }
}
