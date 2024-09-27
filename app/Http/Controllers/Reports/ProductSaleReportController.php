<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\ReportController;
use Carbon\Carbon;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Collection;
use App\Http\Controllers\Controller;
use Illuminate\Validation\ValidationException;


class ProductSaleReportController extends ReportController
{

     function generateEmptyDataPerProductDefinition(Collection $col, string $key)
    {

        return ($col)->mapWithKeys(function ($collection, $index) use ($key) {
            return ([
                strtoupper($collection[$key]) => [
                    'name' => $collection[$key],
                    'quantity' => 0,
                    "in_collection" => $collection->in_collection,
                    'quantity_per_collection' => $collection->quantity_per_collection,
                    'collection_method' => $collection?->collectionType?->type
                ],

            ]);
        });
    }

     function generateProductQuery($start, $end, $product_id)
    {
        return $this->getPayedSaleBetweenDates($start, $end, $product_id)
            ->selectRaw(
                'sales.id,
                    saleitems.quantity,
                    productsmodels.model_name as model_name,
                    Date(sales.updated_at ) as paid_at,
                    TRUNCATE((sales.total_amount)/100,2) as amount_paid,
                    TRUNCATE((sales.sub_total)/100 ,2) as sub_total,
                    products.*
                  '
            )->distinct('sales.id');
    }

     function generateInvoiceQuery($start, $end, array $product_id)
    {
        return $this->getPayedInvoicesDates($start, $end,$product_id)
            ->selectRaw('
                    sales.id,
                    Date(sales.created_at ) as paid_at,
                    sales.sale_invoice,
                    TRUNCATE((sales.total_amount)/100,2) as amount_paid , 
                    TRUNCATE((sales.sub_total)/100 ,2) as subtotal,
                    paymentmethods.method
                  ')
                  ->distinct('sales.id')
        ;
    }

     function generateEmptyDateRanges($start, $end)
    {
        $days = [];
        for ($date = $start; $date->lte(Carbon::parse($end)); $date->addDay()) {
            $days[$date->format('Y-m-d')] = [
            ];
        }
        return $days;
    }

     function generatesummarizedSaleData(Collection $products, $start, $end)
    {
        $today = Carbon::parse(Carbon::now())->format('Y-m-d H:i:s');
        $start = Carbon::parse($start);
        $end = Carbon::parse($end ?? $start);
        $start_to_front_end = Carbon::parse($start);

        $totalRevenue = $this->getRevenueBetweenDate($start->format('Y-m-d'), $end->format('Y-m-d'),$products->toArray());
        $paidInvoicesQuery = $this->generateInvoiceQuery($start->format('Y-m-d'), $end->format('Y-m-d'),$products->toArray())->get();
        $in_paymentmethod = $paidInvoicesQuery->groupBy('method');
        $in_paymentmethod = $in_paymentmethod->map(function ($coll, $key) {
            return $coll->sum('amount_paid');
        });
        $daily_sale = $paidInvoicesQuery->sum('amount_paid');
        $gross_sale = $paidInvoicesQuery->sum('subtotal');
        $discounted_sale = $gross_sale - $daily_sale;

        $sale_data = [
            'GROSS SALE' => round($gross_sale, 2),
            'DAILY SALE' => round($daily_sale, 2),
            'DISCOUNTED SALE' => round($discounted_sale, 2),
            'PAYMENT METHODS' => $in_paymentmethod,
            'TOTAL REVENUE' => $totalRevenue
        ];

        $productSalesData = $products->map(function ($product, $key) use ($start, $end) {
            return $this->generateSummarizedProductSaleQuanities($product, $start, $end);
        })->toArray();

        return [

            'date_created' => $today,
            'title' => 'SUMMARIZED SALE REPORT ' . $start_to_front_end->format('Y-m-d') . ' - ' . $end->format('Y-m-d'),
            'start' => $start_to_front_end->format('Y-m-d'),
            'end' => $end->format('Y-m-d'),
            'sale_summary' => $sale_data,
            'product_sale' => $productSalesData

        ];
    }

     function generateSummarizedProductSaleQuanities($productID, $start, $end)
    {
        $product = Product::with(['basicQuantity', 'models' => ['collectionType']])->where('id', $productID)->firstOrFail();
        $emptyData = $this->generateEmptyDataPerProductDefinition($product->models, "model_name");

        $productQuery = $this->generateProductQuery($start->format('Y-m-d'), $end->format('Y-m-d'), [$productID])->get();
        $total_sale_quantity = $productQuery->sum('quantity');
        $quantity_per_defintion = $productQuery->groupBy('model_name')->mapWithKeys(function ($collection, $model_name) {
            return [
                strtoupper($model_name) => [
                    'name' => $model_name,
                    'quantity' => $collection->sum('quantity')
                ]
            ];
        });

        $quantity_per_defintion = array_replace_recursive($emptyData->toArray(), $quantity_per_defintion->toArray());

        return [
            'models' => $product->models()->get('model_name')->pluck('model_name')->toArray(),
            'total_sale_quantity' => $total_sale_quantity,
            'quantity_per_model' => $quantity_per_defintion,
            'product_name' => $product->product_name,
            'basic_quantity' => $product->basicQuantity->name,
        ];
    }



     function generateLongReport($products, $start, $end)
    {
        $today = Carbon::parse(Carbon::now())->format('Y-m-d H:i:s');
        $start_to_front_end = Carbon::parse($start);
        $start = Carbon::parse($start);
        $end = Carbon::parse($end ?? Carbon::today());

        $dailyBasis = $this->generateInvoiceQuery($start->format('Y-m-d'), $end->format('Y-m-d'),$products->toArray())->get();

        $netSaleData = $dailyBasis->groupBy(['paid_at'])->map(function ($collection, $paid_at) {
            return [
                'DATE' => $paid_at,
                'DAILY SALE' => round($collection->sum('amount_paid'), 2),
                'DISCOUNTED AMOUNT' => round($collection->sum('subtotal') - $collection->sum('amount_paid'), 2),
                'SUB TOTAL' => $collection->sum('subtotal'),
            ];
        });
        $grand_daily_sale = $netSaleData->sum('DAILY SALE');
        $grand_discounted_amount = $netSaleData->sum('DISCOUNTED AMOUNT');
        $grand_net_sale = $netSaleData->sum('SUB TOTAL');
        
        $range = $this->generateEmptyDateRanges(Carbon::parse($start), Carbon::parse($end));
        foreach ($range as $key => $value) {
            $range[$key]=[
                'DATE' => $key,
                'DAILY SALE' => 0,
                'DISCOUNTED AMOUNT' => 0,
                'SUB TOTAL' => 0,
            ];
        }
        $netSaleData = array_replace_recursive($range,$netSaleData->toArray());
        $productSalesData = $products->map(function ($product, $key) use ($start, $end) {
            return $this->generateLongReportProductSale($product, $start, $end);
        })->toArray();



        return [
            'date_created' => $today = Carbon::parse(Carbon::now())->format('Y-m-d H:i:s'),
            'title' => 'DAILY SALE REPORT ' . $start_to_front_end->format('Y-m-d') . ' - ' . $end->format('Y-m-d'),
            'start' => $start_to_front_end->format('Y-m-d'),
            'end' => $end->format('Y-m-d'),
            'grand_daily_sale' => round($grand_daily_sale, 2),
            'grand_net_sale' => round($grand_net_sale, 2),
            'grand_discounted_amount' => round($grand_discounted_amount, 2),
            'sale_summary' => $netSaleData,
            'product_sale' => $productSalesData
        ];

    }

  

     function generateLongReportProductSale($productID, $start, $end)
    {
        $start = Carbon::parse($start);
        $end = Carbon::parse($end ?? Carbon::today());
        $product = Product::with(['basicQuantity', 'models' => ['collectionType']])->where('id', $productID)->firstOrFail();

        $emptyData = $this->generateEmptyDataPerProductDefinition($product->models, "model_name")->toArray();
        $productQuery = $this->generateProductQuery($start->format('Y-m-d'), $end->format('Y-m-d'), [$productID])->get();
        // Making Product Sales
        $productSales = $productQuery->groupBy(['paid_at', 'product_name', 'model_name']);
        $productSales = $productSales->map(function ($date_collection, $date) {
            return $date_collection->mapWithKeys(function ($product_models, $product_name) use ($date, $date_collection) {
                return [
                    $date => $product_models->mapWithKeys(function ($models, $model_name) use ($date_collection) {

                        return ([
                            strtoupper($model_name) => [
                                "name" => $model_name,
                                "quantity" => $models->sum('quantity')
                            ],
                            'DAY TOTAL' => $date_collection->flatten()->sum('quantity')
                        ]);
                    })
                ];
            });
        });
        $SaleWithDateRanges = $this->generateEmptyDateRanges($start, $end);
        foreach ($SaleWithDateRanges as $key => $value) {
            $SaleWithDateRanges[$key] = array_merge($emptyData,['DATE'=> $key]);
        }
        
        
        $productSales = $productSales->mapWithKeys(function ($item) {
            return [$item->keys()->first() => $item->values()->first()];
        })->toArray();
        $productSales = array_replace_recursive($SaleWithDateRanges,$productSales);
        
        return [
            'data' => $productSales,
            'date_range' => array_keys($SaleWithDateRanges),
            'models' => $product->models()->get('model_name')->pluck('model_name')->toArray(),
            'basic_quantity' => $product->basicQuantity->name,
            'product_name' => $product->product_name,
        ];

    }
}