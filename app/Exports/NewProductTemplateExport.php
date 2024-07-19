<?php

namespace App\Exports;

use Illuminate\Database\Eloquent\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class NewProductTemplateExport implements WithMultipleSheets
{


    public function __construct()
    {

    }
    public function sheets(): array
    {
        $sheets = [];
        foreach (range(1, 2) as $entry) {
            $sheets[] = new NewProductSheetExport("Name of Category ${entry}");
        }
        return $sheets;
    }
}
