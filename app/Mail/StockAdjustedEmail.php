<?php

namespace App\Mail;

use App\Models\Productsmodels;
use App\Models\Store;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\User;

class StockAdjustedEmail extends Mailable
{
    use Queueable, SerializesModels;

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
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Stock Adjusted Email',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'email-templates.stock-adjusted',
            with: [
                'author' => $this->author,
                'quantity' => $this->quantity,
                'productmodel' => $this->productmodel,
                'store' => $this->store,
                'description' => $this->description
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
