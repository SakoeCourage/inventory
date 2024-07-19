<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Illuminate\Support\Collection;

class NewProductSheetExport implements FromCollection, WithHeadings, WithTitle, WithStyles, WithColumnWidths
{
    protected $sheetname;

    public function __construct($sheetname)
    {
        $this->sheetname = $sheetname;
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return new Collection([
            [
                'product_name' => '',
                'model_name' => '',
                'packaging_unit' => '',
                'quantity_per_packaging_unit' => '',
                'basic_unit' => '',
                'price_per_packaging_unit' => '',
                'price_per_basic_unit' => '',
                'cost_per_packaging_unit' => '',
                'cost_per_basci_unit' => '',
            ]
        ]);
    }

    public function headings(): array
    {
        return [
            'Product Name',
            'Model Name',
            'Packaging Unit',
            'Quantity Per Packaging Unit',
            'Basic Unit',
            'Price Per Packaging Unit',
            'Price Per Basic Unit',
            'Cost Per Packaging Unit',
            'Cost Per Basic Unit'
        ];
    }

    public function title(): string
    {
        return $this->sheetname;
    }

    public function styles(Worksheet $sheet)
    {
        $sheet->getStyle('A1:I1')->getFont()->setBold(true);
        $sheet->getStyle('A1:I1')->getBorders()->getAllBorders()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN);
        $sheet->getStyle('A2:I' . ($sheet->getHighestRow()))->getBorders()->getAllBorders()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN);
    }

    public function columnWidths(): array
    {
        return [
            'A' => 20,
            'B' => 20,
            'C' => 20,
            'D' => 20,
            'E' => 25,
            'F' => 25,
            'G' => 25,
            'H' => 25,
            'I' => 25
        ];
    }
}
