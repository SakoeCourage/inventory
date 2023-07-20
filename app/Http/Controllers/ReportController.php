<?php

namespace App\Http\Controllers;

use App\Models\Saleitem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function generateProductSaleReport(Request $request)
    {

        $request->validate([
            'collation_method' => ['required', 'string', 'in:Summarized,Long'],
            'start_date' => ['required', 'date_format:Y-m-d'],
            'end_date' => ['required_if:collation_method,range'],
            'product_ids' => ['required', 'array', 'min:1', 'distinct']
        ]);

        if ($request->collation_method == 'Summarized') {
            return Reports\ProductSaleReportController::generatesummarizedSaleData(collect($request->product_ids), $request->start_date, $request->end_date);
        } else if ($request->collation_method == 'Long') {
            return Reports\ProductSaleReportController::generateLongReport(collect($request->product_ids), $request->start_date, $request->end_date);
        }

    }

    public function generateIncomeStatementReport()
    {



    }


    static function getPayedSaleBetweenDates($openingDate, $closingData, array $product_id)
    {
        return DB::table('products')->whereIn('products.id', $product_id )
            ->join('productsmodels', 'productsmodels.product_id', '=', 'products.id')
            ->join('saleitems', 'saleitems.productsmodel_id', '=', 'productsmodels.id')
            ->join('sales', 'sales.id', '=', 'saleitems.sale_id')
            ->whereDate('sales.created_at', '<=', $closingData)
            ->whereDate('sales.created_at', '>=', $openingDate)
            ->orderBy('sales.created_at');
    }

    static function getPayedInvoicesDates($openingDate, $closingData, array $productIDs )
    {
        return DB::table('products')->whereIn('products.id', $productIDs)
            ->join('productsmodels', 'productsmodels.product_id', '=', 'products.id')
            ->join('saleitems', 'saleitems.productsmodel_id', '=', 'productsmodels.id')
            ->join('sales', 'sales.id', '=', 'saleitems.sale_id')
            ->whereDate('sales.created_at', '>=', $openingDate)
            ->whereDate('sales.created_at', '<=', $closingData)
            ->join('paymentmethods', 'sales.paymentmethod_id', '=', 'paymentmethods.id')
        ;
    }

    static function getRevenueBetweenDate($openingDate, $closingData)
    {
        $sales_profits = Saleitem::whereDate('created_at', '>=', $openingDate)
            ->whereDate('created_at', '<=', $closingData)
            ->get()->sum('profit');
        return $sales_profits;
    }

}