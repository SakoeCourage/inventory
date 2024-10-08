<?php

namespace App\Exports;

use App\Models\Category;
use App\Models\Product;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class CategorySheetExport implements FromCollection, WithHeadings, WithTitle, WithStyles, WithColumnWidths
{
    protected $category;
    protected $product_ids;

    public function __construct(Category $category, $product_ids = null)
    {
        $this->category = $category;
        $this->product_ids = $product_ids;
    }

    public function collection()
    {
        return Product::where('category_id', $this->category->id)
            ->when($this->product_ids,function($query){
                $query->whereIn('products.id', $this->product_ids);
            })
            ->join('basic_selling_quantities', 'products.basic_selling_quantity_id', '=', 'basic_selling_quantities.id')
            ->leftJoin('productsmodels', 'products.id', '=', 'productsmodels.product_id')
            ->leftJoin('collection_types', 'productsmodels.collection_method', '=', 'collection_types.id')
            ->select([
                'products.product_name',
                'productsmodels.model_name',
                'productsmodels.in_collection',
                'productsmodels.quantity_per_collection',
                'basic_selling_quantities.name as basic_unit',
                'collection_types.type as collection_type'
            ])
            ->get()
            ->map(function ($product) {
                return [
                    'product_name' => $product->product_name,
                    'model_name' => $product->model_name,
                    'packaging_unit' => $product->in_collection ? $product->collection_type : '-',
                    'basic_unit' => $product->basic_unit,
                    'quantity_of_packaging_unit' => $product->in_collection ? null : '-',
                    'quantity_of_basic_unit' => null,
                ];
            });
    }

    public function headings(): array
    {
        return [
            'Product Name',
            'Model Name',
            'Packaging Unit',
            'Basic Unit',
            'Quantity of Packaging Unit',
            'Quantity of Basic Unit',
        ];
    }

    public function title(): string
    {
        return $this->category->category;
    }

    public function styles(Worksheet $sheet)
    {
        $sheet->getStyle('A1:F1')->getFont()->setBold(true);
        $sheet->getStyle('A1:F1')->getBorders()->getAllBorders()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN);
        $sheet->getStyle('A2:F' . ($sheet->getHighestRow()))->getBorders()->getAllBorders()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN);
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
        ];
    }
}

