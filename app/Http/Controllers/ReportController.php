<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Reports\ProductSaleReportController;
use App\Models\Saleitem;
use App\Models\UserCurrentStoreSelection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class ReportController extends Controller
{
    protected $store_id;

    // Constructor to initialize the store ID
    protected function ensureStoreIdIsSet()
    {
        if (!$this->store_id) {
            $this->store_id = Auth::user()->storePreference->store_id;
        }
    }
    public function __construct()
    {
        
    }

    public function generateProductSaleReport(Request $request, ProductSaleReportController $productSaleReportController)
    {
        $request->validate([
            'collation_method' => ['required', 'string', 'in:Summarized,Long'],
            'start_date' => ['required', 'date_format:Y-m-d'],
            'end_date' => ['required_if:collation_method,range'],
            'product_ids' => ['required', 'array', 'min:1', 'distinct']
        ]);

        if ($request->collation_method == 'Summarized') {
            return $productSaleReportController->generatesummarizedSaleData(collect($request->product_ids), $request->start_date, $request->end_date);
        } else if ($request->collation_method == 'Long') {
            return $productSaleReportController->generateLongReport(collect($request->product_ids), $request->start_date, $request->end_date);
        }

    }

    public function generateIncomeStatementReport()
    {

    }


    public function getPayedSaleBetweenDates($openingDate, $closingData, array $product_id)
    {
        $this->ensureStoreIdIsSet(); 
        return DB::table('products')->whereIn('products.id', $product_id)
            ->join('productsmodels', 'productsmodels.product_id', '=', 'products.id')
            ->join('saleitems', 'saleitems.productsmodel_id', '=', 'productsmodels.id')
            ->join('sales', 'sales.id', '=', 'saleitems.sale_id')
            ->where('sales.store_id', '=', $this->store_id)
            ->whereDate('sales.created_at', '<=', $closingData)
            ->whereDate('sales.created_at', '>=', $openingDate)
            ->orderBy('sales.created_at');
    }

    public function getPayedInvoicesDates($openingDate, $closingData, array $productIDs)
    {
        $this->ensureStoreIdIsSet(); 
        return DB::table('products')->whereIn('products.id', $productIDs)
            ->join('productsmodels', 'productsmodels.product_id', '=', 'products.id')
            ->join('saleitems', 'saleitems.productsmodel_id', '=', 'productsmodels.id')
            ->join('sales', 'sales.id', '=', 'saleitems.sale_id')
            ->where('sales.store_id', '=', $this->store_id)
            ->whereDate('sales.created_at', '>=', $openingDate)
            ->whereDate('sales.created_at', '<=', $closingData)
            ->join('paymentmethods', 'sales.paymentmethod_id', '=', 'paymentmethods.id')
        ;
    }

    public function getRevenueBetweenDate($openingDate, $closingDate, array $productIDs)
    {
        $this->ensureStoreIdIsSet(); 
    
        $sale_profits = DB::table('sales')
            ->where("store_id", "=", $this->store_id)
            ->join('saleitems', 'saleitems.sale_id', '=', 'sales.id')
            ->join('productsmodels', 'saleitems.productsmodel_id', '=', 'productsmodels.id')
            ->join('products', 'productsmodels.product_id', '=', 'products.id')
            ->whereIn('products.id', $productIDs)
            ->whereDate('saleitems.created_at', '>=', $openingDate)
            ->whereDate('saleitems.created_at', '<=', $closingDate)
            ->sum('saleitems.profit');
    
        return $sale_profits/100;
    }

}