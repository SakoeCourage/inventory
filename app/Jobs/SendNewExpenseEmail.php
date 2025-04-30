<?php

namespace App\Jobs;

use App\Mail\NewExpenseEmail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use App\Models\Expenses;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

class SendNewExpenseEmail implements ShouldQueue
{
    use Queueable;
    protected Expenses $expense;
    /**
     * Create a new job instance.
     */
    public function __construct(Expenses $expense)
    {
        $this->expense = $expense;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $expense_managers = User::getUsersWhoCan('authorize expense')
        ->with(['settings','stores'])
        ->whereHas('stores',function ($query) {
            $query->where('stores.id', $this->expense->store_id);
        })
        ->whereHas('settings', function ($query) {
            $query->whereJsonContains('settings->mail_setting->new_expense_request', true);
        })
        ->get()->pluck('email');

        foreach ($expense_managers as $manager) {
            Mail::to($manager)->send(new NewExpenseEmail($this->expense));
        }
    }
}
