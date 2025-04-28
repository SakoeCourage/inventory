<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use Exception;

class SendInvoiceEmail extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:send-invoice-email {email} {name}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send invoice email to a customer';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        $name = $this->argument('name');

        try {
            Mail::send('email-templates.new-sale-invoice', ['name' => $name], function ($message) use ($email) {
                $message->to($email)
                        ->subject('Welcome to Our Platform');
            });
            $this->info('✅ Email sent to ' . $email);
        } catch (Exception $e) {
            $this->error('❌ Failed to send email: ' . $e->getMessage());
            $this->line($e->getTraceAsString());
        }
    }
}
