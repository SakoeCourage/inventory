<?php

namespace App\Jobs;

use App\Mail\StockAdjustedEmail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use App\Models\User;
use App\Models\Store;
use App\Models\Productsmodels;
use Illuminate\Support\Facades\Mail;

class StockAdjustedJob implements ShouldQueue
{
    use Queueable;
    public User $author;
    public int $quantity;
    public string $description;
    public Store $store;
    public Productsmodels $productmodel;

    /**
     * Create a new message instance.
     */
    public function __construct(
        User $author,
        int $quantity,
        string $description,
        Store $store,
        Productsmodels $productmodel
    ) {
        $this->author = $author;
        $this->quantity = $quantity;
        $this->description = $description;
        $this->store = $store;
        $this->productmodel = $productmodel;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $managers = User::getUsersWhoCan('manage stock data')
        ->with(['settings','stores'])
        ->whereHas('stores',function ($query) {
            $query->where('stores.id', $this->store->id);
        })
        ->whereHas('settings', function ($query) {
            $query->whereJsonContains('settings->mail_setting->stock_reduction', true);
        })
        ->get()->pluck('email');

        foreach ($managers as $manager) {
            Mail::to($manager)
            ->send(new StockAdjustedEmail($this->author,$this->quantity,$this->description,$this->store,$this->productmodel));
        }
    }
}
