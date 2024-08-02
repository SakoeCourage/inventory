<?php

namespace App\Imports;

use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\BeforeImport;
use Maatwebsite\Excel\Concerns\Importable;

class StoreProductImport implements WithMultipleSheets
{
    protected $storeId;
    protected $sheetNames = [];
    use Importable;

    public function __construct(int $storeId)
    {
        $this->storeId = $storeId;
    }

    public function sheets(): array
    {
        $spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load(request()->file('template_file')->getPathname());
        $sheetNames = $spreadsheet->getSheetNames();
        
        $sheetImports = [];
        foreach ($sheetNames as $sheetName) {
            $sheetImports[$sheetName] = new StoreProductSheetImport($this->storeId);
        }

        return $sheetImports;
    }
}
