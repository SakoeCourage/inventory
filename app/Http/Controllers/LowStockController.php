<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\LowProductBook;

class LowStockController extends Controller
{
    public function getProducts($storeId, $search = null, $category = null, $minCurrentBasicQuantity = null, $minCurrentCollectionQuantity = null, $maxCurrentBasicQuantity = null, $maxCurrentCollectionQuantity = null, $perPage = 20)
    {
        $searchQuery = $search ? '%' . $search . '%' : '%';
        $categoryQuery = $category ? '%' . $category . '%' : '%';

        $query = "
        SELECT 
            sp.id,
            sp.productsmodel_id as model_id,
            sp.updated_at,
            p.product_name,
            sp.quantity_in_stock,
            sp.productsmodel_id,
            pm.model_name,
            bsq.symbol AS basic_quantity,
            c.category AS category_name,
            pm.in_collection,
            ct.type AS collection_type,
            pm.quantity_per_collection AS units_per_collection,
            sp.quantity_in_stock AS quantity,
            CASE 
                WHEN pm.in_collection THEN FLOOR(sp.quantity_in_stock / pm.quantity_per_collection)
                ELSE NULL
            END AS current_collection_quantity,
            CASE 
                WHEN pm.in_collection THEN sp.quantity_in_stock % pm.quantity_per_collection
                ELSE sp.quantity_in_stock
            END AS current_basic_quantity
        FROM 
            store_products sp
        JOIN 
            productsmodels pm ON sp.productsmodel_id = pm.id
        JOIN 
            products p ON pm.product_id = p.id
        LEFT JOIN 
            basic_selling_quantities bsq ON p.basic_selling_quantity_id = bsq.id
        LEFT JOIN 
            categories c ON p.category_id = c.id
        LEFT JOIN 
            collection_types ct ON pm.collection_method = ct.id
        WHERE 
            sp.store_id = :storeId
        AND (
            p.product_name LIKE :searchQuery OR 
            c.category LIKE :categoryQuery
        )
    ";

        $bindings = [
            'storeId' => $storeId,
            'searchQuery' => $searchQuery,
            'categoryQuery' => $categoryQuery
        ];

        if ($minCurrentBasicQuantity !== null) {
            $query .= " AND ((pm.in_collection = 0 AND sp.quantity_in_stock >= :minCurrentBasicQuantity) OR (pm.in_collection = 1 AND (sp.quantity_in_stock % pm.quantity_per_collection) >= :minCurrentBasicQuantityCol))";
            $bindings['minCurrentBasicQuantity'] = $minCurrentBasicQuantity;
            $bindings['minCurrentBasicQuantityCol'] = $minCurrentBasicQuantity;
        }

        if ($minCurrentCollectionQuantity !== null) {
            $query .= " AND (pm.in_collection = 0 OR (FLOOR(sp.quantity_in_stock / pm.quantity_per_collection) >= :minCurrentCollectionQuantity))";
            $bindings['minCurrentCollectionQuantity'] = $minCurrentCollectionQuantity;
        }

        if ($maxCurrentBasicQuantity !== null) {
            $query .= " AND ((pm.in_collection = 0 AND sp.quantity_in_stock <= :maxCurrentBasicQuantity) OR (pm.in_collection = 1 AND (sp.quantity_in_stock % pm.quantity_per_collection) <= :maxCurrentBasicQuantityCol))";
            $bindings['maxCurrentBasicQuantity'] = $maxCurrentBasicQuantity;
            $bindings['maxCurrentBasicQuantityCol'] = $maxCurrentBasicQuantity;
        }

        if ($maxCurrentCollectionQuantity !== null) {
            $query .= " AND (pm.in_collection = 0 OR (FLOOR(sp.quantity_in_stock / pm.quantity_per_collection) <= :maxCurrentCollectionQuantity))";
            $bindings['maxCurrentCollectionQuantity'] = $maxCurrentCollectionQuantity;
        }

        $results = DB::select($query, $bindings);

        if ($perPage === null) {
            return $results;
        }

        $currentPage = LengthAwarePaginator::resolveCurrentPage();

        $paginator = new LengthAwarePaginator(
            array_slice($results, ($currentPage - 1) * $perPage, $perPage),
            count($results),
            $perPage,
            $currentPage,
            ['path' => LengthAwarePaginator::resolveCurrentPath()]
        );

        return $paginator;
    }


    public function getLowStockProducts(Request $request,$pageSize=20)
    {
        $search = $request?->search;
        $category = $request?->category;
        $minCurrentBasicQuantity = $request?->min_basic_quantity;
        $minCurrentCollectionQuantity = $request?->min_packaging_quantity;
        $maxCurrentBasicQuantity = $request?->max_basic_quantity;
        $maxCurrentCollectionQuantity = $request?->max_packaging_quantity;

        return $this->getProducts(
            Auth()->user()?->storePreference?->store_id,
            $search,
            $category,
            $minCurrentBasicQuantity,
            $minCurrentCollectionQuantity,
            $maxCurrentBasicQuantity,
            $maxCurrentCollectionQuantity,
            $pageSize
        );
    }

    public function exportLowStockProduct(Request $request){
        $model_ids = null;
        if(is_array($request->model_ids) && count($request->model_ids) > 0){
            $model_ids = $request->model_ids;
        }else{
            $lowStockProductModelsIds = $this->getLowStockProducts($request,null);
            $model_ids = array_column($lowStockProductModelsIds, 'productsmodel_id'); 
        }
        return Excel::download(new LowProductBook($model_ids), 'IL_Product_Template.xlsx');
    }
}
