<?php


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

Route::get('/{any}', function () {
    return view('index');
})->where("any", ".*");
