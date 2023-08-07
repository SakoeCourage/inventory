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
            'endDate' => ['required'],
            'product_ids' =>['required','array','min:1']
        ]);

  
      
        return [
            'title' => $request->startDate . " to " . $request->endDate,
            'dailysaleincome' => $this->generateDailySaleItemsOfProducts($request->startDate, $request->endDate, $request->product_ids),
            'dailyexpenses' => $this->generateDailyExpenses($request->startDate, $request->endDate)
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

    public function generateDailySaleItemsOfProducts(string $start, string $end, array $productIDS)
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

        $productsQery = DB::table('products')
            ->whereIn('products.id', $productIDS)
        ;

        $emptyDataListQuery = clone $productsQery;


        $productsales = $productsQery
            ->join('productsmodels', 'productsmodels.product_id', '=', 'products.id')
            ->join('saleitems', 'saleitems.productsmodel_id', '=', 'productsmodels.id')
            ->join('sales', 'sales.id', '=', 'saleitems.sale_id')
            ->whereDate('saleitems.created_at', '<=', $endDate)
            ->whereDate('saleitems.created_at', '>=', $startDate)
            ->selectRaw('products.product_name as name, strftime("%Y-%m-%d", saleitems.created_at) as day ,saleitems.amount as total_amount')
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

        $paidSaleInvoicesByDayWithProducts = array_replace_recursive($emptydatalist->toArray(), $paidSaleInvoicesByDayWithProducts->toArray());


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

        return ([
            'paidSaleInvoicesByDayWithProducts' => $paidSaleInvoicesByDayWithProducts,
            'dailyCumulatedTotal' => $dailyCumulatedTotal,
            'accountReceivable' => $accountReceivable,
            'totalSale' => $paidSaleInvoicesDB->sum('total_amount') / 100,
            'totalRecievable' => $productsales->sum('total_amount') / 100,
            'dateRange' => $dateRange
        ]);

    }


    public function generateDailyExpenses(string $start, string $end)
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
            ->where('expenses.status', 1)
            ->whereDate('expenses.updated_at', '<=', $endDate)
            ->whereDate('expenses.updated_at', '>=', $startDate)
            ->selectRaw('expensedefinitions.name as item,strftime("%Y-%m-%d", expenses.updated_at) as day,expenses.total_amount as total')
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