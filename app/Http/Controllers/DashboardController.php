<?php

namespace App\Http\Controllers;

use App\Enums\StockActionEnum;
use App\Models\Product;
use App\Models\Productsmodels;
use App\Models\Productstockhistory;
use App\Models\StoreProduct;
use Illuminate\Http\Request;
use App\Models\Sale;
use App\Models\Saleitem;
use App\Models\Stockhistory;
use App\Smartalgorithms\Outofstock;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

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
        $todays_sale_total = Sale::where([
            'store_id' => request()->user()->storePreference->store_id,
            'sale_type' => 'regular'
        ])->whereDate('created_at', Carbon::today())->get()->sum('total_amount');

        $yesterdays_sale_total = Sale::where([
            'store_id' => request()->user()->storePreference->store_id,
            'sale_type' => 'regular'
        ])->whereDate('created_at', Carbon::yesterday())->get()->sum('total_amount');

        $relative_percentage_difference = $yesterdays_sale_total ? (($todays_sale_total - $yesterdays_sale_total) / $yesterdays_sale_total) * 100 : 0;
        return [
            'daily_sale' => $todays_sale_total,
            'relative_percentage' => ($relative_percentage_difference > 0 && $relative_percentage_difference <= 100) ? floor($relative_percentage_difference) : null
        ];
    }

    public function getDailyRevenue()
    {
        $sales_profits = Saleitem::with(
            ['sale']
        )->whereHas("sale", function ($query) {
            $query->where([
                'store_id' => request()->user()->storePreference->store_id,
                'sale_type' => 'regular'
            ]);
        })
            ->whereDate('created_at', Carbon::today())
            ->get()->sum('profit');

        return $sales_profits;
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
            ->where('store_id', Auth::user()->storePreference->store_id)
            ->where('action_type', StockActionEnum::Depreciate)->sum('quantity');

        $sale_out = Saleitem::with('sale')
            ->whereHas("sale", function ($query) {
                $query->where([
                    'store_id' => request()->user()->storePreference->store_id,
                    'sale_type' => 'regular'
                ]);
            })->whereDate('created_at', Carbon::today())
            ->sum('quantity');

        return [
            'product_in' => $product_in,
            'product_out' => $stock_out + $sale_out,
        ];
    }


    public function getCurrentProductsAndValue()
    {


        $store_products = StoreProduct::with(['models' => ['product']])
            ->where('store_id', Auth::user()->storePreference->store_id)
            ->get()
        ;

        $products = $store_products->pluck('models.product.id')->unique()->count();

        $calculated_by_price_and_collection = $store_products->map(function ($sp) {
            $value = '';
            $model = $sp->models;
            if ((bool) $model->in_collection) {
                $value = (floor($sp->quantity_in_stock / $model->quantity_per_collection) * $model->price_per_collection) + ($sp->quantity_in_stock % $model->quantity_per_collection * $model->unit_price);
            } else {
                $value = ($sp->quantity_in_stock * $model->unit_price);
            }
            return $value;
        });
        
        return [
            'products' => $products,
            'models' => $store_products->count(),
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
            'smart_recommendations' => [
                ...[
                    "total_stock" => "150"
                ],
                ...$outofstock->main()->groupBy('stock_level')
            ],
            'unattended_products' => $this->getUnattendedProducts()
        ];
    }

    public function generateStockAvailabilityData()
    {

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

        $sales = Sale::where([
            'store_id' => request()->user()->storePreference->store_id,
            'sale_type' => 'regular'
        ])->whereDate('created_at', '>=', $begining_of_week)
            ->whereDate('created_at', '<=', $today)
            ->selectRaw(' DATE_FORMAT(created_at,"%a") as day, total_amount as total_amount')
            ->get();

        $revenue = Saleitem::with('sale')
            ->whereHas("sale", function ($query) {
                $query->where([
                    'store_id' => request()->user()->storePreference->store_id,
                    'sale_type' => 'regular'
                ]);
            })->whereDate('created_at', '>=', $begining_of_week)
            ->whereDate('created_at', '<=', $today)
            ->selectRaw(' DATE_FORMAT(created_at,"%a") as day, profit as profit')
            ->get();

        $revenue = $days->mapWithKeys(function ($day, $index) use ($revenue) {
            return [
                $day => number_format((float) $revenue->where('day', $day)->sum('profit'), 2, '.', '')
            ];
        });
        $sales = $days->mapWithKeys(function ($day, $index) use ($sales) {
            return [
                $day => number_format((float) $sales->where('day', $day)->sum('total_amount'), 2, '.', '')
            ];
        });

        return [
            [
                'name' => 'Sale',
                'type' => 'area',
                'data' => $sales->flatten()
            ],
            [
                'name' => 'Revenue',
                'type' => 'area',
                'data' => $revenue->flatten()
            ]
        ];
    }


    public function getUnattendedProducts()
    {
        //To-do later
        // $storeProduct = StoreProduct::withCount()
        // ->where()
        // ->get()
        // ;

        // dd($storeProduct);
        $data = Product::withCount([
            'models' => function ($query) {
                $query->where('quantity_in_stock', 0);
            }
        ])->get();

        return [
            'products' => $data->count(),
            'models' => $data->sum('models_count')
        ];
    }
}