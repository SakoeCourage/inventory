<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\IOFactory;
use App\Models\Category;
use App\Models\BasicSellingQuantity;
use App\Models\Productsmodels;
use App\Models\CollectionType;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use PhpParser\Node\Stmt\TryCatch;

class ProductImportController extends Controller
{
    function validateWorksheetNames($spreadsheet)
    {
        $worksheetNames = [];
        foreach ($spreadsheet->getSheetNames() as $sheetName) {
            if (empty($sheetName) || in_array(strtolower($sheetName), array_map('strtolower', $worksheetNames))) {
                throw new \Exception("Worksheet names are either missing or duplicated.");
            }
            $worksheetNames[] = $sheetName;
        }
        return $worksheetNames;
    }
    function validateHeaders($sheet)
    {
        $expectedHeaders = [
            'A1' => 'Product Name',
            'B1' => 'Model Name',
            'C1' => 'Packaging Unit',
            'D1' => 'Quantity Per Packaging Unit',
            'E1' => 'Basic Unit',
            'F1' => 'Price Per Packaging Unit',
            'G1' => 'Price Per Basic Unit',
            'H1' => 'Cost Per Packaging Unit',
            'I1' => 'Cost Per Basic Unit'
        ];

        foreach ($expectedHeaders as $cell => $value) {
            if ($sheet->getCell($cell)->getValue() !== $value) {
                throw new \Exception("Invalid Excel File Please Use Provided Template");
            }
        }
    }

    function collectProductData($sheet)
    {
        $productsFromSheets = [];
        
        $highestRow = $sheet->getHighestDataRow();
        for ($row = 2; $row <= $highestRow; $row++) {
            $productName = $sheet->getCell('A' . $row)->getValue();
            $modelName = $sheet->getCell('B' . $row)->getValue();
    
            // Skip rows where product name or model name is empty
            if (empty($productName) || empty($modelName)) {
                continue;
            }
    
            $productsFromSheets[] = [
                "product_name" => $productName,
                "basic_selling_quantity_id" => null,
                "basic_selling_quantity_name" => $sheet->getCell('E' . $row)->getCalculatedValue(),
                "model_name" => $modelName,
                "unit_price" => $sheet->getCell('G' . $row)->getCalculatedValue(),
                "price_per_collection" => $sheet->getCell('F' . $row)->getCalculatedValue(),
                "in_collection" => !empty($sheet->getCell('C' . $row)->getCalculatedValue()) ? (($sheet->getCell('C' . $row)->getCalculatedValue() !== '-') && !empty($sheet->getCell('D' . $row)->getCalculatedValue())) : false,
                "collection_method" => null,
                "collection_method_name" => !empty($sheet->getCell('C' . $row)->getCalculatedValue()) && $sheet->getCell('C' . $row)->getCalculatedValue() !== '-' ? $sheet->getCell('C' . $row)->getCalculatedValue() : null,
                "quantity_per_collection" => $sheet->getCell('D' . $row)->getCalculatedValue(),
                "cost_per_unit" => $sheet->getCell('I' . $row)->getCalculatedValue(),
                "cost_per_collection" => $sheet->getCell('H' . $row)->getCalculatedValue(),
            ];
        }
    
        return $productsFromSheets;
    }
    
    function groupAndNormalizeData($productsFromSheets)
    {
        $incomingBasicUnits = [];
        $incomingCollectionMethods = [];
        $incomingProductNames = [];
        $incomingModelNames = [];

        foreach ($productsFromSheets as $product) {
            $incomingBasicUnits[] = strtolower(trim($product['basic_selling_quantity_name']));
            $incomingCollectionMethods[] = strtolower(trim($product['collection_method_name']));
            $incomingProductNames[] = strtolower(trim($product['product_name']));
            $incomingModelNames[] = strtolower(trim($product['model_name']));
        }

        return [
            'basic_units' => array_unique($incomingBasicUnits),
            'collection_methods' => array_unique($incomingCollectionMethods),
            'product_names' => array_unique($incomingProductNames),
            'model_names' => array_unique($incomingModelNames),
        ];
    }

    function validateAndInsertData($incomingData)
    {
        $existingCategories = Category::pluck('category')->map(function ($category) {
            return strtolower(trim($category));
        })->toArray();

        $existingBasicUnits = BasicSellingQuantity::pluck('name')->map(function ($name) {
            return strtolower(trim($name));
        })->toArray();

        $existingCollectionMethods = CollectionType::pluck('type')->map(function ($type) {
            return strtolower(trim($type));
        })->toArray();

        // Insert missing categories
        foreach ($incomingData['categories'] as $category) {
            $category = strtolower(trim($category));
            if (!in_array($category, $existingCategories)) {
                Category::create(['category' => $category]);
                $existingCategories[] = $category;
            }
        }

        // Insert missing basic units
        foreach ($incomingData['basic_units'] as $unit) {
            $unit = strtolower(trim($unit));
            if (!in_array($unit, $existingBasicUnits)) {
                BasicSellingQuantity::create(['name' => $unit, 'symbol' => $unit]);
                $existingBasicUnits[] = $unit;
            }
        }

        // Insert missing collection methods
        foreach ($incomingData['collection_methods'] as $method) {
            $method = strtolower(trim($method));
            if (!in_array($method, $existingCollectionMethods)) {
                CollectionType::create(['type' => $method]);
                $existingCollectionMethods[] = $method;
            }
        }
    }


    function updateOrCreateProducts($productsFromSheets, $categoryName)
    {
        $category = Category::where('category', strtolower(trim($categoryName)))->first();
        $basicSellingQuantities = BasicSellingQuantity::all()->keyBy(function ($item) {
            return strtolower(trim($item->name));
        })->toArray();
        $collectionTypes = CollectionType::all()->keyBy(function ($item) {
            return strtolower(trim($item->type));
        })->toArray();

        foreach ($productsFromSheets as $productData) {
            $product = Product::updateOrCreate(
                ['product_name' => $productData['product_name'], 'category_id' => $category->id],
                [
                    'basic_selling_quantity_id' => $basicSellingQuantities[strtolower(trim($productData['basic_selling_quantity_name']))]['id'] ?? null,
                    'category_id' => $category->id
                ]
            );

            $productModelData = [
                'product_id' => $product->id,
                'model_name' => $productData['model_name'],
                'unit_price' => (float)$productData['unit_price'],
                'in_collection' => $productData['in_collection'],
                'price_per_collection' => (float)$productData['price_per_collection'],
                'quantity_per_collection' => $productData['quantity_per_collection'],
                'cost_per_unit' => (float)$productData['cost_per_unit'],
                'cost_per_collection' =>(float)$productData['cost_per_collection'],
            ];

            if ($productData['collection_method_name']) {
                $productModelData['collection_method'] = $collectionTypes[strtolower(trim($productData['collection_method_name']))]['id'] ?? null;
            }

            Productsmodels::updateOrCreate(
                ['product_id' => $product->id, 'model_name' => $productData['model_name']],
                $productModelData
            );
        }
    }

    function processExcelFile(Request $request)
    {

     
        // Step 1: Validate the request and retrieve the uploaded file
        $request->validate([
            'template_file' => 'required|file|mimes:xlsx,xls'
        ]);

        $file = $request->file('template_file');
        $filePath = $file->getPathname();

        // Load the spreadsheet
        $spreadsheet = IOFactory::load($filePath);

        // Step 2: Validate worksheet names
        $worksheetNames = $this->validateWorksheetNames($spreadsheet);

        $productsFromAllSheets = [];
        $incomingData = [
            'categories' => [],
            'basic_units' => [],
            'collection_methods' => [],
            'product_names' => [],
            'model_names' => [],
        ];

        try {
            DB::transaction(function () use ($spreadsheet, $productsFromAllSheets, $incomingData, $worksheetNames) {
                foreach ($spreadsheet->getWorksheetIterator() as $sheet) {
                    $sheetName = $sheet->getTitle();
                    $incomingData['categories'][] = strtolower(trim($sheetName));

                    // Step 3: Validate headers
                    $this->validateHeaders($sheet);

                    // Step 4: Collect product data from sheet
                    $productsFromSheet = $this->collectProductData($sheet);

                    // Step 5: Append products to main array
                    $productsFromAllSheets = array_merge($productsFromAllSheets, $productsFromSheet);

                    // Step 6: Group and normalize data
                    $groupedData = $this->groupAndNormalizeData($productsFromSheet);

                    $incomingData['basic_units'] = array_unique(array_merge($incomingData['basic_units'], $groupedData['basic_units']));
                    $incomingData['collection_methods'] = array_unique(array_merge($incomingData['collection_methods'], $groupedData['collection_methods']));
                    $incomingData['product_names'] = array_unique(array_merge($incomingData['product_names'], $groupedData['product_names']));
                    $incomingData['model_names'] = array_unique(array_merge($incomingData['model_names'], $groupedData['model_names']));
                }

                // Step 7: Validate and insert missing data
                $this->validateAndInsertData($incomingData);

                // Step 8: Update or create products and product models
                foreach ($worksheetNames as $sheetName) {
                    $productsFromSheet = $this->collectProductData($spreadsheet->getSheetByName($sheetName));
                    // throw new \Exception(json_encode($productsFromSheet));
                    $this->updateOrCreateProducts($productsFromSheet, $sheetName);
                }
            });
            return response("New Products Uploaded",200);
        } catch (\Exception $ex) {
            return response($ex->getMessage(),422);
        }
        ;

    }
}
