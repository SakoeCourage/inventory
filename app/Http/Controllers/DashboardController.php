<?php

namespace App\Http\Controllers;

use App\Enums\StockActionEnum;
use App\Models\Product;
use App\Models\Productsmodels;
use App\Models\Productstockhistory;
use Illuminate\Http\Request;
use App\Models\Sale;
use App\Models\Saleitem;
use App\Models\Stockhistory;
use App\Smartalgorithms\Outofstock;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return $this->generateDailyStats();
    }

    public function getDailySale()
    {
        $todays_sale_total = Sale::whereDate('created_at', Carbon::today())->get()->sum('total_amount');
        $yesterdays_sale_total = Sale::whereDate('created_at', Carbon::yesterday())->get()->sum('total_amount');

        $relative_percentage_difference = $yesterdays_sale_total ?  (($todays_sale_total - $yesterdays_sale_total) / $yesterdays_sale_total) * 100 : 0;
        return [
            'daily_sale' => $todays_sale_total,
            'relative_percentage' => ($relative_percentage_difference > 0 && $relative_percentage_difference <= 100) ? floor($relative_percentage_difference) :  null
        ];
    }

    public function getDailyRevenue()
    {
        $non_refunded_sales = Saleitem::whereDate('created_at', Carbon::today())
            ->where('is_refunded', 0)->get()->sum('profit');

        return $non_refunded_sales;
    }


    public function getProductCycle()
    {
        $product_in = Stockhistory::whereDate('created_at', Carbon::today())
            ->get()
            ->map(function ($record) {
                return collect($record->stock_products)->sum('quantity');
            })
            ->sum();
        $stock_out = Productstockhistory::whereDate('created_at', Carbon::today())->where('description', '!=', 'for sale')
            ->where('action_type', StockActionEnum::Depreciate)->sum('quantity');
        $sale_out = Saleitem::whereDate('created_at', Carbon::today())
            ->where('is_refunded', 0)->sum('quantity');

        return [
            'product_in' => $product_in,
            'product_out' => $stock_out + $sale_out,
        ];
    }


    public function getCurrentProductsAndValue()
    {
        $products = Product::all()->count();
        $models = Productsmodels::all();
        $calculated_by_price_and_collection =  $models->map(function ($model) {
            $value = '';
            if ((bool)$model->in_collection) {
                $value =  (floor($model->quantity_in_stock / $model->quantity_per_collection) * $model->price_per_collection) + ($model->quantity_in_stock % $model->quantity_per_collection * $model->unit_price);
            } else {
                $value =  ($model->quantity_in_stock * $model->unit_price);
            }
            return $value;
        });
        return [
            'products' => $products,
            'models' => $models->count(),
            'current_stock_value' => $calculated_by_price_and_collection->sum()
        ];
    }

    public function generateDailyStats()
    {   
        $outofstock = new Outofstock();
        return [
            'daliy_sale_stats' => $this->getDailySale(),
            'daily_revenue' => $this->getDailyRevenue(),
            'products_cycle' => $this->getProductCycle(),
            'products_value' => $this->getCurrentProductsAndValue(),
            'line_chart' => $this->generateLineChart(),
            'smart_recommendations' => $outofstock->main()->groupBy('stock_level'),
            'unattended_products' => $this->getUnattendedProducts()
        ];
    }

    public function generateLineChart()
    {
        $begining_of_week = Carbon::now()->startOfWeek(Carbon::SUNDAY)->format('Y-m-d');
        $end_of_week = Carbon::now()->endOfWeek(Carbon::SATURDAY)->format('Y-m-d');
        $today = Carbon::now();
        $days = collect();
        $startOfWeek = $today->startOfWeek(Carbon::SUNDAY);
        for ($date = $startOfWeek; $date->lte($end_of_week); $date->addDay()) {
            $days->push($date->format('D'));
        }

        $sales = Sale::whereDate('created_at', '>=', $begining_of_week)
            ->whereDate('created_at', '<=', $today)
            ->selectRaw(' DATE_FORMAT(created_at,"%a") as day, total_amount as total_amount')
            ->get();

        $revenue = Saleitem::whereDate('created_at', '>=', $begining_of_week)
            ->whereDate('created_at', '<=', $today)
            ->selectRaw(' DATE_FORMAT(created_at,"%a") as day, profit as profit')
            ->get();

        $revenue = $days->mapWithKeys(function ($day, $index) use ($revenue) {
            return [
                $day => number_format((float)$revenue->where('day', $day)->sum('profit'), 2, '.', '')
            ];
        });
        $sales = $days->mapWithKeys(function ($day, $index) use ($sales) {
            return [
                $day => number_format((float)$sales->where('day', $day)->sum('total_amount'), 2, '.', '')
            ];
        });



        return [
            [
                'name' => 'Sale',
                'type' =>'area',
                'data' => $sales->flatten()
            ],
            [
                'name' => 'Revenue',
                'type' =>'area',
                'data' => $revenue->flatten()
            ]
        ];
    }

    
    public function getUnattendedProducts()
    {
        $data = Product::withCount(['models' => function ($query) {
            $query->where('quantity_in_stock', 0);
        }])->get();
   
        return [
            'products' => $data->count(),
            'models'  =>  $data->sum('models_count')
        ];
    }
}
