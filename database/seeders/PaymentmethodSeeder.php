<?php

namespace Database\Seeders;

use App\Models\Paymentmethod;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PaymentmethodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $methods = array('Cash', 'Mobile Money', 'Bank');

        foreach ($methods as $key => $value) {
            Paymentmethod::create([
                'method' => $value
            ]);
        }
    }
}