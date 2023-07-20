<?php 

namespace App\helpers;
use Carbon\Carbon;
use Illuminate\Validation\ValidationException;

Class Datehelper{

static function getForMaxMonth(string $month)
    {
        $currentDate = Carbon::now();
        $currentMonth = $currentDate->format('m');
        $currentYear = $currentDate->format('Y');

        $inputDate = Carbon::createFromFormat('Y-m', $month);
        $inputMonth = $inputDate->format('m');
        $inputYear = $inputDate->format('Y');


        if ($inputYear > $currentYear || ($inputYear == $currentYear && $inputMonth > $currentMonth)) {
            throw ValidationException::withMessages([
                'month' => "Improper month selection"
            ]);
        }
    }


}