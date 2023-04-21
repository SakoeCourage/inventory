<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

route::group(['namespace'=>'api\v1'],function(){
    
    Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/login', [\App\Http\Controllers\Auth\LoginController::class, 'authenticate']);
    
    Route::group(['prefix'=>'toselect'],function(){
        Route::get('/basicquantities',[\App\Http\Controllers\BasicSellingQuantityController::class,'toselect']);
        Route::get('/collectiontypes',[\App\Http\Controllers\CollectionTypeController::class,'toselect']);
    });
    Route::group(['prefix'=>'product'],function(){
        Route::get('/all',[App\Http\Controllers\ProductController::class,'index']);
        Route::get('/all/products/models',[App\Http\Controllers\ProductController::class,'productAndModelsJoin']);
        Route::get('/all/withmodels',[App\Http\Controllers\ProductsmodelsController::class,'searchProductWithModels']);
        Route::post('/new',[App\Http\Controllers\ProductController::class,'store']);
        Route::get('/find/{product}',[App\Http\Controllers\ProductController::class,'show']);
        Route::put('/update/{product}',[App\Http\Controllers\ProductController::class,'update']);
        Route::get('/find/{id}/{product_name}',[App\Http\Controllers\ProductController::class,'getProductByIdandName']);   
        Route::get('/models/find/{id}',[App\Http\Controllers\ProductsmodelsController::class,'getProductModelsFromProductId']);
        Route::get('/models/{id}/stock/data',[App\Http\Controllers\ProductstockhistoryController::class,'show']);
        Route::get('/models/{id}/stock/history',[App\Http\Controllers\ProductstockhistoryController::class,'stockhistory']);
        Route::post('/stock/{model_id}/increase',[App\Http\Controllers\ProductstockhistoryController::class,'increaseStock']);
        Route::post('/stock/{model_id}/decrease',[App\Http\Controllers\ProductstockhistoryController::class,'decreaseStock']);
    });
    Route::group(['prefix'=>'supplier'],function(){
        Route::get('/model/{model}',[App\Http\Controllers\ProductsupplierController::class,'getSupplierPergivenProductModel']);
        Route::get('/all',[App\Http\Controllers\SupplierController::class, 'index']);
    });
    Route::group(['prefix'=>'stock'],function(){
        Route::post('/new',[App\Http\Controllers\StockhistoryController::class, 'store']);
    });


});