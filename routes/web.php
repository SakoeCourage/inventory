<?php


use Illuminate\Support\Facades\Route;
use Carbon\Carbon;
use App\Models\Product;
use App\Models\Productsmodels;

use function PHPSTORM_META\map;

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



Route::get(
    '/sale/all',
    function () {
       
    }
);

Route::get('/{any}', function () {
    return view('index');
})->where("any", ".*");
