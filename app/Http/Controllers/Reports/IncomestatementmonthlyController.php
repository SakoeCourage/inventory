<?php

namespace App\Http\Controllers\Reports;

use Carbon\Carbon;
use App\Models\Product;
use App\helpers\Datehelper;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class IncomestatementmonthlyController extends Controller
{
    public function generatemonthlyincomestatement(Request $request)
    {
        $request->validate([
            'month' => ['required']
        ]);

        Datehelper::getForMaxMonth($request->month);
        $store_id = $request->user()->storePreference->store_id;
        $date = Carbon::createFromFormat('Y-n', $request->month);
        $formattedDate = $date->format('F Y');
        return [
            'title' => $formattedDate,
            'weeklysaleincome' => $this->generateWeeklySaleItemsOfProducts($request->month, $request->product_ids, $store_id),
            'weeklyexpenses' => $this->generateWeeklyExpenses($request->month, $store_id)
        ];
    }

    static function generateEmptyDataPerProductDefinition(Collection $col)
    {
        return ($col)->mapWithKeys(function ($product, $key) {
            return ([
                $product->product_name => collect([
                    1 => 0,
                    2 => 0,
                    3 => 0,
                    4 => 0
                ])
            ]);
        });
    }

    public function generateWeeklySaleItemsOfProducts(string $month, array $productIDS, $store_id)
    {

        $selectedmonth = $month;
        $monthInstance = Carbon::createFromFormat('Y-m', $selectedmonth)->startOfMonth();


        $firstDate = $monthInstance->format('Y-m-d');
        $lastDate = $monthInstance->endOfMonth()->format('Y-m-d');


        $productsQery = DB::table('products')
            // ->whereIn('products.id', $productIDS)
        ;

        $emptyDataListQuery = clone $productsQery;

        $productsales = $productsQery
            ->join('productsmodels', 'productsmodels.product_id', '=', 'products.id')
            ->join('saleitems', 'saleitems.productsmodel_id', '=', 'productsmodels.id')
            ->join('sales', 'sales.id', '=', 'saleitems.sale_id')
            ->leftjoin('refunds', 'sales.id', '=', 'refunds.sale_id')
            ->where('sales.store_id', '=', $store_id)
            ->whereDate('saleitems.created_at', '<=', $lastDate)
            ->whereDate('saleitems.created_at', '>=', $firstDate)
            ->selectRaw("products.product_name as name,
            saleitems.id ,
            CASE 
            WHEN DAY(saleitems.created_at) <= 7 THEN 1
            WHEN DAY(saleitems.created_at) <= 14 THEN 2
            WHEN DAY(saleitems.created_at) <= 21 THEN 3
            ELSE 4
            END AS week,
            DATE(saleitems.created_at) as date
           ,saleitems.amount as total_amount
           ,saleitems.profit as profit
           ,saleitems.is_refunded as refunded,
           refunds.previous_sale_data as refunded_products,
           sales.sale_type as sale_type
           ")
            ->get();

        $paidSaleInvoicesDB = $productsales;
        $emptydatalist = $this->generateEmptyDataPerProductDefinition($emptyDataListQuery->get());

        $paidSaleInvoicesByWeek = $paidSaleInvoicesDB->groupBy(['name', 'week'])->map(function ($value, $product_name) {
            return $value->mapWithKeys(function ($sale_content, $weeknumber) {
                return [
                    $weeknumber => $sale_content->sum('total_amount') / 100
                ];
            });
        });

        $allPaidInvoicesByWeek = $paidSaleInvoicesByWeek->toArray();

        $weeklyCumulatedTotal = $paidSaleInvoicesDB->groupBy(['week'])->mapWithKeys(function ($value, $weeknumber) {
            return [
                $weeknumber => $value->sum('total_amount') / 100
            ];

        });

        $accountReceivable = $productsales->groupBy(['week'])->mapWithKeys(function ($value, $weeknumber) {
            return [
                $weeknumber => $value->sum('total_amount') / 100
            ];

        });
        $accountReceivable = array_replace_recursive([1 => 0, 2 => 0, 3 => 0, 4 => 0], $accountReceivable->toArray());

        $leaseSale = $productsales->where('sale_type', '=', 'lease')->groupBy('week')
            ->mapWithKeys(function ($sale_content, $weeknumber) {
                return [
                    $weeknumber => $sale_content->sum('total_amount') / 100
                ];
            });
        ;

        $leaseTotal = $productsales->where('sale_type', '=', 'lease')->sum('total_amount');

        $weeklyLeaseSale = array_replace_recursive([1 => 0, 2 => 0, 3 => 0, 4 => 0], $leaseSale->toArray());


        return ([
            'allPaidInvoicesByWeek' => $allPaidInvoicesByWeek,
            'weeklyCulmulatedTotal' => $weeklyCumulatedTotal->toArray(),
            'accountReceivable' => $accountReceivable,
            'totalSale' => $paidSaleInvoicesDB->sum('total_amount') / 100,
            'totalRecievable' => $productsales->sum('total_amount') / 100,
            'leaseSale' => $weeklyLeaseSale,
            'leaseTotal' => $leaseTotal / 100
        ]);
    }




    public function generateWeeklyExpenses(string $month, $store_id)
    {

        $selectedmonth = $month;
        $monthInstance = Carbon::createFromFormat('Y-m', $selectedmonth)->startOfMonth();

        $firstDate = $monthInstance->format('Y-m-d');
        $lastDate = $monthInstance->endOfMonth()->format('Y-m-d');

        $allApprovedExpensesFromDB = DB::table('expenseitems')
            ->join('expenses', 'expenses.id', '=', 'expenseitems.expense_id')
            ->join('expensedefinitions', 'expenseitems.expensedefinition_id', '=', 'expensedefinitions.id')
            ->where('expenses.status', 1)
            ->where('expenses.store_id', $store_id)
            ->whereDate('expenses.updated_at', '<=', $lastDate)
            ->whereDate('expenses.updated_at', '>=', $firstDate)
            ->selectRaw('expensedefinitions.name as item,
            CASE 
            WHEN DAY(expenses.updated_at) <= 7 THEN 1
            WHEN DAY(expenses.updated_at) <= 14 THEN 2
            WHEN DAY(expenses.updated_at) <= 21 THEN 3
            ELSE 4
            END AS week,
            expenses.total_amount as total')
            ->get();

        $avaliableEmptyExpense = $allApprovedExpensesFromDB->groupBy(['item', 'week'])->mapWithKeys(function ($value, $item) {
            return [
                $item => collect([
                    1 => 0,
                    2 => 0,
                    3 => 0,
                    4 => 0
                ])
            ];
        });

        $allApprovedExpenses = $allApprovedExpensesFromDB->groupBy(['item', 'week'])->mapWithKeys(function ($value, $item) {
            return [
                $item => $value->map(function ($value, $key) {
                    return $value->sum('total') / 100;
                })
            ];
        });


        $weeklyCumulatedTotal = $allApprovedExpensesFromDB->groupBy(['week'])->mapWithKeys(function ($value, $weeknumber) {
            return [
                $weeknumber => $value->sum('total') / 100
            ];
        });

        $allApprovedExpenses = array_replace_recursive($avaliableEmptyExpense->toArray(), $allApprovedExpenses->toArray());


        return (
            [
                'allApprovedExpenses' => $allApprovedExpenses,
                'weeklyCulmulatedTotal' => $weeklyCumulatedTotal,
                'totalExpenses' => $allApprovedExpensesFromDB->sum('total') / 100
            ]
        );
    }
}