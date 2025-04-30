<?php


use App\Http\Controllers\PrintController;
use App\Models\Product;
use App\Models\Productsmodels;
use App\Models\Store;
use App\Models\StoreProduct;
use App\Smartalgorithms\Outofstock;
use Illuminate\Support\Facades\Route;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Http\Request;
use App\Exports\ProductCategoryExport;
use App\Jobs\SendInvoiceEmailJob;
use App\Mail\NewInvoiceEmail;
use App\Models\Sale;
use App\Models\Saleitem;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Concurrency;
use Illuminate\Support\Facades\Log;
use Symfony\Component\Process\Process;
use function Illuminate\Support\defer;
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





Route::get('/sale-habits', function () {
 
    $outofStockAlgorithm = new Outofstock(1 );

    dd($outofStockAlgorithm->run());
});

Route::get('/view-template/stock-alert', function () {
    $model_id = 187;
    $outofStockAlgorithm = new Outofstock(1, [$model_id]);
    $store = Store::where('id', 1)->with('branch')->firstOrFail();
    return view('email-templates.stock-alert', with([
        'stockalert' => (object) $outofStockAlgorithm->run()->first(),
        'store' => $store
    ]));
});




Route::get("/view-template/new-invoice/{saleid}", function (Request $request) {
    $newdata = \App\Models\Sale::with(['saleitems' => ['productsmodels' => ['product' => ['basicQuantity', 'category'], 'collectionType']], 'salerepresentative', 'paymentmethod', 'store' => ['branch']])->where('id', $request->saleid)->firstOrFail();
    return view('email-templates.new-sale-invoice', with(['sale' => $newdata]));
});

Route::get("/view-template/new-expense/{expenseid}", function (Request $request) {
    $newdata = \App\Models\Expenses::with(['author', 'store', 'expenseitems' => ['expensedefinition']])->where('id', $request->expenseid)->firstOrFail();

    return view('email-templates.new-expense', with(['expense' => $newdata]));
});


Route::get('/view-original  ', fn() => view('components.original'));



Route::get("/all-quantity-to-stock-template", function (Request $request) {
    return Excel::download(new ProductCategoryExport(null), 'products_by_category.xlsx');
});
;



Route::get('/{any}', function () {
    return view('index');
})->where("any", ".*");


