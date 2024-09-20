<?php


use App\Http\Controllers\PrintController;
use App\Models\Productsmodels;
use Illuminate\Support\Facades\Route;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Http\Request;
use App\Exports\ProductCategoryExport;

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



use Illuminate\Support\Facades\DB;

// function getProducts($storeId = 3, $search = null, $category = null, $minCurrentBasicQuantity = 0, $minCurrentCollectionQuantity = 0, $maxCurrentBasicQuantity = 400, $maxCurrentCollectionQuantity = 400, $perPage = 20)
// {
//     $searchQuery = $search ? '%' . $search . '%' : '%';
//     $categoryQuery = $category ? '%' . $category . '%' : '%';

//     $query="
//         SELECT 
//             sp.id,
//             sp.updated_at,
//             p.product_name,
//             sp.quantity_in_stock,
//             sp.productsmodel_id,
//             pm.model_name,
//             bsq.symbol AS basic_quantity,
//             c.category AS category_name,
//             pm.in_collection,
//             ct.type AS collection_type,
//             pm.quantity_per_collection AS units_per_collection,
//             sp.quantity_in_stock AS quantity,
//             CASE 
//                 WHEN pm.in_collection THEN FLOOR(sp.quantity_in_stock / pm.quantity_per_collection)
//                 ELSE NULL
//             END AS current_collection_quantity,
//             CASE 
//                 WHEN pm.in_collection THEN sp.quantity_in_stock % pm.quantity_per_collection
//                 ELSE sp.quantity_in_stock
//             END AS current_basic_quantity
//         FROM 
//             store_products sp
//         JOIN 
//             productsmodels pm ON sp.productsmodel_id = pm.id
//         JOIN 
//             products p ON pm.product_id = p.id
//         LEFT JOIN 
//             basic_selling_quantities bsq ON p.basic_selling_quantity_id = bsq.id
//         LEFT JOIN 
//             categories c ON p.category_id = c.id
//         LEFT JOIN 
//             collection_types ct ON pm.collection_method = ct.id
//         WHERE 
//             sp.store_id = :storeId
//         AND (
//             p.product_name LIKE :searchQuery OR 
//             c.category LIKE :categoryQuery
//         )
//     ";

//     $bindings = [
//         'storeId' => $storeId,
//         'searchQuery' => $searchQuery,
//         'categoryQuery' => $categoryQuery
//     ];

//     if ($minCurrentBasicQuantity !== null) {
//         $query .= " AND ((pm.in_collection = 0 AND sp.quantity_in_stock >= :minCurrentBasicQuantity) OR (pm.in_collection = 1 AND (sp.quantity_in_stock % pm.quantity_per_collection) >= :minCurrentBasicQuantityCol))";
//         $bindings['minCurrentBasicQuantity'] = $minCurrentBasicQuantity;
//         $bindings['minCurrentBasicQuantityCol'] = $minCurrentBasicQuantity;
//     }
//     if ($minCurrentCollectionQuantity !== null) {
//         $query .= " AND (pm.in_collection = 0 OR (FLOOR(sp.quantity_in_stock / pm.quantity_per_collection) >= :minCurrentCollectionQuantity))";
//         $bindings['minCurrentCollectionQuantity'] = $minCurrentCollectionQuantity;
//     }
//     if ($maxCurrentBasicQuantity !== null) {
//         $query .= " AND ((pm.in_collection = 0 AND sp.quantity_in_stock <= :maxCurrentBasicQuantity) OR (pm.in_collection = 1 AND (sp.quantity_in_stock % pm.quantity_per_collection) <= :maxCurrentBasicQuantityCol))";
//         $bindings['maxCurrentBasicQuantity'] = $maxCurrentBasicQuantity;
//         $bindings['maxCurrentBasicQuantityCol'] = $maxCurrentBasicQuantity;
//     }
//     if ($maxCurrentCollectionQuantity !== null) {
//         $query .= " AND (pm.in_collection = 0 OR (FLOOR(sp.quantity_in_stock / pm.quantity_per_collection) <= :maxCurrentCollectionQuantity))";
//         $bindings['maxCurrentCollectionQuantity'] = $maxCurrentCollectionQuantity;
//     }

//     $currentPage = LengthAwarePaginator::resolveCurrentPage();

//     $results = DB::select($query, $bindings);

//     $paginator = new LengthAwarePaginator(
//         array_slice($results, ($currentPage - 1) * $perPage, $perPage),
//         count($results),
//         $perPage,
//         $currentPage,
//         ['path' => LengthAwarePaginator::resolveCurrentPath()]
//     );

//     return $paginator;
// }

Route::get("/test-lsp", function () {
    dd(getProducts());
});


Route::get('/test/print-receipt', [PrintController::class, 'handleNewTestPrint']);

Route::get("/all-quantity-to-stock-template", function (Request $request) {
    return Excel::download(new ProductCategoryExport(null), 'products_by_category.xlsx');
});


Route::get('/test-not-in-store',function(){
    $excludedStoreId = 3;
    $productModels = Productsmodels::with('stores')
        ->whereDoesntHave('stores', function ($query) use ($excludedStoreId) {
            $query->where('store_id', $excludedStoreId);
        })
        ->get();

    return $productModels;
}); 



Route::get('/{any}', function () {
    return view('index');
})->where("any", ".*");
