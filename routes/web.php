<?php


use App\Models\StoreProduct;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\Concerns\ToModel;
use Illuminate\Http\Request;
use App\Exports\ProductCategoryExport;
use App\Exports\NewProductTemplateExport;
use App\Imports\ProductImport;





Route::get('/test-excel', function (Request $request) {
    return Excel::download(new ProductCategoryExport, 'products_by_category.xlsx');
});
Route::get('/test-new-template', function (Request $request) {
    return Excel::download(new NewProductTemplateExport, 'IL_New_Template_Form.xlsx');
});


Route::get("/test-upload", function () {
    return view("excelupload");
});

Route::get("/import", function () {
    $file = '../resources/asset/IL_New_Template_Form.xlsx';
    $process = new \App\Http\Controllers\ProductImportController();

    return $process->processExcelFile(new Request([
        'template_file' => $file
    ]));

});


route::get('/test-store-products', function () {
    $store_product = StoreProduct::where('store_id', 3)->with([
        'models' => [
            'product' => ['basicQuantity', 'category'],
            'collectionType'
        ]
    ])->filter(request()->only(['search', 'category']))
        ->get()
        ->map(fn($currentproduct) =>
            [
                'id' => $currentproduct->id,
                'updated_at' => $currentproduct->updated_at,
                'product_name' => $currentproduct->models->product->product_name,
                'quantity_in_stock' => $currentproduct->quantity_in_stock,
                'model_name' => $currentproduct->models->model_name,
                'basic_quantity' => $currentproduct->models->product->basicQuantity->symbol,
                'category_name' => $currentproduct->models->product->category->category,
                'in_collection' => $currentproduct->models->in_collection,
                'collection_type' => $currentproduct->models?->collectionType?->type,
                'units_per_collection' => $currentproduct->models?->quantity_per_collection,
                'quantity' => $currentproduct->quantity_in_stock
            ]);

            dd($store_product);

});

Route::get('/text-store-p',[\App\Http\Controllers\DashboardController::class,'getUnattendedProducts']);


Route::get('/{any}', function () {
    return view('index');
})->where("any", ".*");
