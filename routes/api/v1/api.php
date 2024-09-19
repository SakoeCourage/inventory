<?php

use App\Models\Expenses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\NewProductTemplateExport;
use App\Exports\ProductCategoryExport;

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

Route::post('/login', [\App\Http\Controllers\Auth\LoginController::class, 'authenticate'])->middleware('guest');

route::group(['middleware' => 'auth:sanctum'], function () {

    Route::get('/user', function (Request $request) {
        return [
            'user' => $request->user(),
            'permissions' => $request->user()->getAllPermissions()->pluck('name'),
            'roles' => $request->user()->getRoleNames(),
            'stores' => $request->user()?->stores,
            'store_preference' => $request->user()?->storePreference,
            'current_store_branch' => $request->user()?->storePreference?->store?->branch
        ];
    });

    Route::post('/logout', [\App\Http\Controllers\Auth\LogoutController::class, 'logout']);

    Route::get('/dashboard/data', [\App\Http\Controllers\DashboardController::class, 'index']);

    Route::group(['prefix' => 'toselect'], function () {
        Route::get('/basicquantities', [\App\Http\Controllers\BasicSellingQuantityController::class, 'toselect']);
        Route::get('/collectiontypes', [\App\Http\Controllers\CollectionTypeController::class, 'toselect']);
        Route::get('/categories', [\App\Http\Controllers\CategoryController::class, 'toselect']);
        Route::get('/roles', [\App\Http\Controllers\RolesController::class, 'toselect']);
        Route::get('/paymentmethods', [\App\Http\Controllers\PaymentmethodController::class, 'toselect']);
        Route::get('/expenses', [\App\Http\Controllers\ExpensedefinitionController::class, 'toselect']);
        Route::get('/branches', [\App\Http\Controllers\StoreBranchController::class, "toSelect"]);
        Route::get('/stores', [\App\Http\Controllers\StoreController::class, "toSelect"]);
    });
    
    Route::group(['prefix' => 'product'], function () {
        Route::get('/all', [App\Http\Controllers\ProductController::class, 'index']);
        Route::get('/all/products/models', [App\Http\Controllers\ProductController::class, 'productAndModelsJoin']);
        Route::get('/all/withmodels', [App\Http\Controllers\ProductsmodelsController::class, 'searchProductWithModels']);
        Route::post('/new', [App\Http\Controllers\ProductController::class, 'store']);
        Route::get('/find/{product}', [App\Http\Controllers\ProductController::class, 'show']);
        Route::put('/update/{product}', [App\Http\Controllers\ProductController::class, 'update']);
        Route::get('/find/{id}/{product_name}', [App\Http\Controllers\ProductController::class, 'getProductByIdandName']);
        Route::get('/models/find/{id}', [App\Http\Controllers\ProductsmodelsController::class, 'getProductModelsFromProductId']);
        Route::get('/models/{id}/stock/data', [App\Http\Controllers\ProductstockhistoryController::class, 'show']);
        Route::get('/models/{id}/stock/history', [App\Http\Controllers\ProductstockhistoryController::class, 'stockhistory']);
        Route::post('/stock/{model_id}/increase', [App\Http\Controllers\ProductstockhistoryController::class, 'increaseStock']);
        Route::post('/stock/{model_id}/decrease', [App\Http\Controllers\ProductstockhistoryController::class, 'decreaseStock']);
        Route::get('/all/unattended', [App\Http\Controllers\ProductController::class, 'getUnattendedProductsWithCategoriesAndModels']);
        Route::post('/import-from-excel', [App\Http\Controllers\ProductImportController::class, "processExcelFile"]);
        Route::get("/product-template", function (Request $request) {
            return Excel::download(new NewProductTemplateExport, 'IL_Product_Template.xlsx');
        });
        Route::get("/all-quantity-to-stock-template", function (Request $request) {
            return Excel::download(new ProductCategoryExport, 'products_by_category.xlsx');
        });
    });
    Route::group(['prefix' => 'product-model'], function () {
        Route::post('/update/{productsmodels}', [App\Http\Controllers\ProductsmodelsController::class, 'update']);
    });

    Route::group(['prefix' => 'store-products'],function(){
        Route::get('/all', [App\Http\Controllers\StoreProductController::class, 'index']);
        Route::post('/import', [App\Http\Controllers\StoreProductController::class, "import"]);
        Route::get('/unavailable', [App\Http\Controllers\StoreProductController::class, "NotInStoreProducts"]);
    });

    Route::group(['prefix' => 'supplier'], function () {
        Route::get('/model/{model}', [App\Http\Controllers\ProductsupplierController::class, 'getSupplierPergivenProductModel']);
        Route::get('/all', [App\Http\Controllers\SupplierController::class, 'index']);
        Route::get('/to-table', [App\Http\Controllers\SupplierController::class, 'toSupplierTable']);
        Route::post('/updateorcreate', [App\Http\Controllers\SupplierController::class, 'edit']);
        Route::post('/delete/{supplier}', [App\Http\Controllers\SupplierController::class, 'destroy']);
    });

    Route::group(['prefix' => 'stock'], function () {
        Route::post('/new', [App\Http\Controllers\StockhistoryController::class, 'store']);
        Route::get('/low-products', [App\Http\Controllers\LowStockController::class, 'getLowStockProducts']);
        Route::post('/low-products/export', [App\Http\Controllers\LowStockController::class, 'exportLowStockProduct']);
    });
    Route::group(['prefix' => 'category'], function () {
        Route::get('/all', [App\Http\Controllers\CategoryController::class, 'index']);
        Route::post('/updateorcreate', [App\Http\Controllers\CategoryController::class, 'edit']);
        Route::post('/delete/{category}', [App\Http\Controllers\CategoryController::class, 'destroy']);
    });
    Route::group(['prefix' => 'sale'], function () {
        Route::post('/new', [App\Http\Controllers\SaleController::class, 'store']);
        Route::get('/all', [App\Http\Controllers\SaleController::class, 'index']);
        Route::get('/to-search-deep', [App\Http\Controllers\SaleController::class, 'tosearch']);
        Route::get('/get/{sale}', [App\Http\Controllers\SaleController::class, 'show']);
        Route::get('/get/sale-from-invoice/{sale:sale_invoice}', [App\Http\Controllers\SaleController::class, 'getSaleFromInvoice']);
        Route::get('/view-invoice/{invoiceID}', [App\Http\Controllers\SaleController::class, 'showinvoice']);
    });

    Route::group(['prefix' => 'lease'], function () {
        Route::patch('/make-payment/{saleId}', [App\Http\Controllers\LeasePaymentHistoryController::class, "update"]);
        Route::get('/mark-as-settled/{saleId}', [App\Http\Controllers\LeaseController::class, "handleOnLeaseSettled"]);
        Route::get('/sale/{saleId}/history', [App\Http\Controllers\LeasePaymentHistoryController::class, "index"]);
    });

    Route::group(['prefix' => 'proforma'], function () {
        Route::post('/new', [App\Http\Controllers\ProformaInvoiceController::class, 'store']);
        Route::get('/all', [App\Http\Controllers\ProformaInvoiceController::class, 'index']);
        Route::get('/view-invoice/{proformaInvoiceID}', [App\Http\Controllers\ProformaInvoiceController::class, 'show']);
        Route::delete('/delete/{proformaInvoice}', [App\Http\Controllers\ProformaInvoiceController::class, 'destroy']);
    });

    Route::group(['prefix' => 'user'], function () {
        Route::get('/all', [App\Http\Controllers\Auth\UserController::class, 'index']);
        Route::post('/create', [App\Http\Controllers\Auth\UserController::class, 'store']);
        Route::post('/update/{user}', [App\Http\Controllers\Auth\UserController::class, 'edit']);
        Route::get('/get/info/{user}', [App\Http\Controllers\Auth\UserController::class, 'show']);
        Route::post('/delete/{user}', [App\Http\Controllers\Auth\UserController::class, 'destroy']);
        Route::post('/password/reset/{user}', [App\Http\Controllers\Auth\UserController::class, 'resetPassword']);
        Route::put('/update/credentials', [\App\Http\Controllers\UserprofileController::class, 'update']);
        Route::put('/update/credentials/validate', [\App\Http\Controllers\UserprofileController::class, 'validationcheck']);
        Route::post('/store/change-preference', [\App\Http\Controllers\StoreController::class, 'toggleUserPreferredStore']);

    });

    Route::group(['prefix' => 'roles'], function () {
        Route::get('/all', [\App\Http\Controllers\RolesController::class, 'index']);
        Route::post('/updateorcreate', [\App\Http\Controllers\RolesController::class, 'updateOrCreate']);
        Route::get('/{rolename}/permissions', [\App\Http\Controllers\RolesController::class, 'getPermissionFromRoleName']);
        Route::post('/permissions/new', [\App\Http\Controllers\RolesController::class, 'applyNewPermissions']);
    });
    Route::group(['prefix' => 'payment'], function () {
        Route::get('/history/all', [\App\Http\Controllers\PaymenthistoryController::class, 'index']);
    });
    Route::group(['prefix' => 'refund'], function () {
        Route::post('/new', [\App\Http\Controllers\RefundsController::class, 'create']);
        Route::get('/history', [\App\Http\Controllers\RefundsController::class, 'index']);
    });
    Route::group(['prefix' => 'expense'], function () {
        Route::post('/updateorcreate', [\App\Http\Controllers\ExpensedefinitionController::class, 'store']);
        Route::get('/all', [\App\Http\Controllers\ExpensedefinitionController::class, 'index']);
        Route::delete('/delete/{expensedefinition}', [\App\Http\Controllers\ExpensedefinitionController::class, 'destroy']);
        Route::post('/submit', [\App\Http\Controllers\ExpensesController::class, 'create'])->middleware('role_or_permission:create expense|Super Admin');
        Route::get('/submits/all', [\App\Http\Controllers\ExpensesController::class, 'allExpenses']);
        Route::get('/submits/get/{expenses}', [\App\Http\Controllers\ExpensesController::class, 'show']);
        Route::post('/take-action/{expenses}', [\App\Http\Controllers\ExpensesController::class, 'takeAction'])->middleware('role_or_permission:authorize expense|Super Admin');
        Route::get('/pending-count', [\App\Http\Controllers\ExpensesController::class, 'getPendingExpenseCount']);
    });
    Route::group(['prefix' => 'report'], function () {
        Route::post('/product-sale-report', [\App\Http\Controllers\ReportController::class, 'generateProductSaleReport']);
        Route::post('/income-week-report', [\App\Http\Controllers\Reports\IncomestatementweeklyController::class, 'generateWeeklyIncomeStatement']);
        Route::post('/income-month-report', [\App\Http\Controllers\Reports\IncomestatementmonthlyController::class, 'generatemonthlyincomestatement']);
    });

    Route::group(['prefix' => 'store'], function () {
        Route::get('/all', [\App\Http\Controllers\StoreController::class, "index"]);
        Route::post('/create', [\App\Http\Controllers\StoreController::class, "store"]);
        Route::delete('/delete/{store}', [\App\Http\Controllers\StoreController::class, "destroy"]);
        Route::post('/updateorcreate', [\App\Http\Controllers\StoreController::class, "updateorcreate"]);
        Route::post('/toggle-product', [\App\Http\Controllers\StoreController::class, "toggleProductToStore"]);
        Route::post('/product-quantity', [\App\Http\Controllers\StoreController::class, "setInitialStoreProductQuantity"]);
        Route::post('/product-quantity/to-store', [\App\Http\Controllers\StoreController::class, "productQuantityToStore"]);

    });

    Route::group(['prefix' => 'packaging-unit'], function () {
        Route::get('/all', [\App\Http\Controllers\CollectionTypeController::class, "index"]);
        Route::post('/create', [\App\Http\Controllers\CollectionTypeController::class, "store"]);
        Route::delete('/delete/{collectionType}', [\App\Http\Controllers\CollectionTypeController::class, "destroy"]);
        Route::post('/updateorcreate', [\App\Http\Controllers\CollectionTypeController::class, "update"]);

    });

    Route::group(['prefix' => 'basic-unit'], function () {
        Route::get('/all', [\App\Http\Controllers\BasicSellingQuantityController::class, "index"]);
        Route::post('/create', [\App\Http\Controllers\BasicSellingQuantityController::class, "store"]);
        Route::delete('/delete/{basicSellingQuantity}', [\App\Http\Controllers\BasicSellingQuantityController::class, "destroy"]);
        Route::post('/updateorcreate', [\App\Http\Controllers\BasicSellingQuantityController::class, "update"]);
    });

    Route::group(['prefix' => 'branch'], function () {
        Route::get('/all', [\App\Http\Controllers\StoreBranchController::class, "index"]);
        Route::post('/create', [\App\Http\Controllers\StoreBranchController::class, "store"]);
        Route::delete('/delete/{storeBranch}', [\App\Http\Controllers\StoreBranchController::class, "destroy"]);
        Route::post('/update/{storeBranch}', [\App\Http\Controllers\StoreBranchController::class, "update"]);
        Route::post('/updateorcreate', [\App\Http\Controllers\StoreBranchController::class, "updateorcreate"]);

    });


    Route::get('/unread-count/all', [\App\Http\Controllers\UnreadcountContorller::class, 'index']);
    Route::get('/business-profile/get', [\App\Http\Controllers\BusinessprofileController::class, 'index']);
    Route::post('/business-profile/create-update', [\App\Http\Controllers\BusinessprofileController::class, 'createorupdate']);
});
