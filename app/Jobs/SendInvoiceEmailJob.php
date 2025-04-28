<?php

namespace App\Jobs;

use App\Console\Commands\SendInvoiceEmail;
use App\Mail\NewInvoiceEmail;
use App\Models\Sale;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;
class SendInvoiceEmailJob implements ShouldQueue
{
    use Queueable;

    protected $email;
    protected Sale $sale;

    /**
     * Create a new job instance.
     *
     * @param  string  $email
     * @param  string  $name
     * @return void
     */

    /**
     * Create a new job instance.
     */
    public function __construct(Sale $sale)
    {

        $this->sale = $sale;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $stock_managers = User::getUsersWhoCan('manage stock data')
        ->with(['settings','stores'])
        ->where('stores',function ($query) {
            $query->where('stores.id', $this->sale->store_id);
        })
        ->whereHas('settings', function ($query) {
            $query->whereJsonContains('settings->mail_setting->new_invoice', true);
        })
        ->get()->pluck('email');
        foreach ($stock_managers as $manager) {
            Mail::to($manager)->send(new NewInvoiceEmail($this->sale));
        }
    }
}
