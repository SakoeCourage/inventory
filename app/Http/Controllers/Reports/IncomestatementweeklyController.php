<?php

namespace App\Http\Controllers\Reports;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class IncomestatementweeklyController extends Controller
{
    public function generateWeeklyIncomeStatement(Request $request)
    {
        $request->validate([
            'startDate' => ['required'],
            'endDate' => ['required']
        ]);

        // $request = (object) [
        //     'startDate' => '2023-07-14',
        //     'endDate' => '2023-07-20',
        //     'product_ids' => [71, 70, 69]
        // ];
      
        $store_id = $request->user()->storePreference->store_id;
        return [
            'title' => $request->startDate . " to " . $request->endDate,
            'dailysaleincome' => $this->generateDailySaleItemsOfProducts($request->startDate, $request->endDate, $request->product_ids,$store_id),
            'dailyexpenses' => $this->generateDailyExpenses($request->startDate, $request->endDate,$store_id)
        ];
    }

    static function generateEmptyDataPerProductDefinition(Collection $col, array $days)
    {
        return ($col)->mapWithKeys(function ($definition, $key) use ($days) {
            return ([
                strtoupper($definition->product_name) => collect($days)
            ]);
        });
    }

    public function generateDailySaleItemsOfProducts(string $start, string $end, array $productIDS,int $store_id)
    {
        $startDate = $start;
        $endDate = $end;

        $begining_of_week = Carbon::parse($startDate)->format('Y-m-d');

        $days = [];
        $dateRange = [];
        $startOfWeek = Carbon::parse($begining_of_week);
        for ($date = $startOfWeek; $date->lte(Carbon::parse($endDate)); $date->addDay()) {
            $days[$date->format('Y-m-d')] = 0;
            $dateRange[] = $date->format('Y-m-d');
        }

        $productsQery = DB::table('products');

        $emptyDataListQuery = clone $productsQery;

        $productsales = $productsQery
            ->join('productsmodels', 'productsmodels.product_id', '=', 'products.id')
            ->join('saleitems', 'saleitems.productsmodel_id', '=', 'productsmodels.id')
            ->join('sales', 'sales.id', '=', 'saleitems.sale_id')
            ->where('sales.store_id', '=', $store_id)
            ->whereDate('saleitems.created_at', '<=', $endDate)
            ->whereDate('saleitems.created_at', '>=', $startDate)
            ->selectRaw('products.product_name as name,DATE(saleitems.created_at) as day ,saleitems.amount as total_amount,sales.sale_type as sale_type')
            ->get();

        $paidSaleInvoicesDB = $productsales;

        $paidSaleInvoicesByDayWithProducts = $paidSaleInvoicesDB->groupBy(['name', 'day'])->map(function ($value, $product_name) {
            return $value->mapWithKeys(function ($sale_content, $day) {
                return [
                    $day => $sale_content->sum('total_amount') / 100
                ];
            });
        });

        $emptydatalist = self::generateEmptyDataPerProductDefinition($emptyDataListQuery->get(), $days);

        $paidSaleInvoicesByDayWithProducts = $paidSaleInvoicesByDayWithProducts->toArray();

        $dailyCumulatedTotal = $paidSaleInvoicesDB->groupBy(['day'])->mapWithKeys(function ($value, $day) {
            return [
                $day => $value->sum('total_amount') / 100
            ];

        });

        $dailyCumulatedTotal = array_replace_recursive($days, $dailyCumulatedTotal->toArray());

        $accountReceivable = $productsales->groupBy(['day'])->mapWithKeys(function ($value, $weeknumber) {
            return [
                $weeknumber => $value->sum('total_amount') / 100
            ];

        });
        
        $accountReceivable = array_replace_recursive($days, $accountReceivable->toArray());

        $leaseSale = $productsales->where('sale_type', '=', 'lease')->groupBy('day')
        ->mapWithKeys(function ($sale_content, int|string $weeknumber) {
            return [
                $weeknumber => $sale_content->sum('total_amount') / 100
            ];
        });
    ;

    $leaseTotal = $productsales->where('sale_type', '=', 'lease')->sum('total_amount');
    $dailyLeaseSale = array_replace_recursive($days, $leaseSale->toArray());


        return ([
            'paidSaleInvoicesByDayWithProducts' => $paidSaleInvoicesByDayWithProducts,
            'dailyCumulatedTotal' => $dailyCumulatedTotal,
            'accountReceivable' => $accountReceivable,
            'totalSale' => $paidSaleInvoicesDB->sum('total_amount') / 100,
            'totalRecievable' => $productsales->sum('total_amount') / 100,
            'dateRange' => $dateRange,
            'leaseSale' => $dailyLeaseSale,
            'leaseTotal' => $leaseTotal / 100
        ]);

    }


    public function generateDailyExpenses(string $start, string $end,$store_id)
    {
        $startDate = $start;
        $endDate = $end;

        $begining_of_week = Carbon::parse($startDate)->format('Y-m-d');

        $days = [];
        $startOfWeek = Carbon::parse($begining_of_week);
        for ($date = $startOfWeek; $date->lte(Carbon::parse($endDate)); $date->addDay()) {
            $days[$date->format('Y-m-d')] = 0;
        }

        $allApprovedExpensesFromDB = DB::table('expenseitems')
            ->join('expenses', 'expenses.id', '=', 'expenseitems.expense_id')
            ->join('expensedefinitions', 'expenseitems.expensedefinition_id', '=', 'expensedefinitions.id')
            ->where('expenses.store_id','=',$store_id)
            ->where('expenses.status', 1)
            ->whereDate('expenses.updated_at', '<=', $endDate)
            ->whereDate('expenses.updated_at', '>=', $startDate)
            ->selectRaw('expensedefinitions.name as item,DATE(expenses.updated_at) as day,expenses.total_amount as total')
            ->get();


        $allApprovedExpenses = $allApprovedExpensesFromDB->groupBy(['item', 'day'])->mapWithKeys(function ($value, $item) {
            return [
                $item => $value->map(function ($value, $key) {
                    return $value->sum('total') / 100;
                })
            ];
        });
        $emptyDataStructureAllAprovEx = $allApprovedExpensesFromDB->groupBy(['item'])->mapWithKeys(function ($value, $item) use ($days) {
            return [
                $item => collect($days)
            ];
        });
        $allApprovedExpenses = array_replace_recursive($emptyDataStructureAllAprovEx->toArray(), $allApprovedExpenses->toArray());



        $dailyCumulatedTotal = $allApprovedExpensesFromDB->groupBy(['day'])->mapWithKeys(function ($value, $day) {
            return [
                $day => $value->sum('total') / 100
            ];
        });

        $dailyCumulatedTotal = array_replace_recursive($days, $dailyCumulatedTotal->toArray());

        return ([
            'allApprovedExpenses' => $allApprovedExpenses,
            'dailyCumulatedTotal' => $dailyCumulatedTotal,
            'totalExpenses' => $allApprovedExpensesFromDB->sum('total') / 100
        ]);
    }
}