<?php


use Illuminate\Support\Facades\Route;
use Carbon\Carbon;
use App\Models\Product;
use App\Models\Productsmodels;


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
    '/momo/pay' ,function(){

        // $request = new Http_Request2('https://sandbox.momodeveloper.mtn.com/collection/v1_0/bc-authorize');
        // $url = $request->getUrl();
        
        // $headers = array(
        //     'Authorization' => '',
        //     'X-Target-Environment' => '',
        //     'X-Callback-Url' => 'http://127.0.0.1:8000',
        //     'Content-Type' => 'application/x-www-form-urlencoded',
        //     'Ocp-Apim-Subscription-Key' => '5644bd4575fc4e0db357cb07baab8982',
        // );
        
        // $request->setHeader($headers);
        
        // $parameters = array(
            
        // );
        
        // $url->setQueryVariables($parameters);
        
        // $request->setMethod(HTTP_Request2::METHOD_POST);
        
        // // Request body
        // $request->setBody("{body}");
        
        // try
        // {
        //     $response = $request->send();
        //     echo $response->getBody();
        // }
        // catch (HttpException $ex)
        // {
        //     echo $ex;
        // }
        
    }
);

Route::get('/{any}', function () {
    return view('index');
})->where("any", ".*");
