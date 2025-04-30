<?php

namespace App\Jobs;

use App\Mail\StockAlertEmail;
use App\Models\Store;
use App\Models\User;
use App\Models\Sale;
use App\Smartalgorithms\Outofstock;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

class StockAlertJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public $sale)
    {

    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $product_models = $this->sale->saleitems->pluck('productsmodel_id')->toArray();

        $out_of_stock_data = (new Outofstock($this->sale->store->id, $product_models))->run();

        $managers = User::getUsersWhoCan('manage stock data')
            ->with(['settings', 'stores'])
            ->whereHas('stores', function ($query) {
                $query->where('stores.id', $this->sale->store->id);
            })
            ->whereHas('settings', function ($query) {
                $query->whereJsonContains('settings->mail_setting->out_of_stock', true);
            })
            ->get()->pluck('email');

            foreach ($out_of_stock_data as $data) {
                if ($data['stock_level'] !== 'EnoughInStock') {
                    foreach ($managers as $manager) {
                        Mail::to($manager)
                            ->send(new StockAlertEmail($this->sale->store, (object) $data));
                    }
                }
            }
    }
}
