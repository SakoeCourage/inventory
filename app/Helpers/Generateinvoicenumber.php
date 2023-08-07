<?php

namespace App\helpers;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class Generateinvoicenumber
{

    /**
     * @param string $table
     * @param string $field
     * @param string $prefix
     */
    public static function generateSaleInvoice($prefix,$table, $field,$max=16)
    {  
        $currentYear = date('y'); // Last two digits of the current year
        $currentMonth = date('m'); // Current month
        $currentDay = date('d'); // Current day

        $incrementalLength =$max - mb_strlen($prefix.$currentYear.$currentMonth.$currentDay) ; // Length of the incremental part
        $incremental = self::getNextIncremental($table, $field, $currentDay, $incrementalLength);

        // Pad the incremental with leading zeros if necessary
        $incremental = str_pad($incremental, $incrementalLength, '0', STR_PAD_LEFT);

        return $prefix . $currentYear . $currentMonth . $currentDay . $incremental;
    }

    private static function getNextIncremental($table, $field, $currentDay, $length)
    {
        // Fetch the latest sale_invoice for the current day
        $lastSale = DB::table($table)->whereDate('created_at','=',Carbon::today())->orderBy($field, 'desc')->first();

        if (!$lastSale) {
            // If no previous sale for the current day, start with 1
            return 1;
        }

        // Extract the last 5 characters from the sale_invoice and convert it to an integer
        $lastIncremental = (int) substr($lastSale->sale_invoice, -$length);

        // Increment the last incremental
        $nextIncremental = $lastIncremental + 1;

        // Ensure the next incremental doesn't exceed the max length
        $nextIncremental = str_pad($nextIncremental, $length, '0', STR_PAD_LEFT);

        return $nextIncremental;
    }


}