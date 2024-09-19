<?php

namespace App\Services;

use Mike42\Escpos\PrintConnectors\WindowsPrintConnector;
use Mike42\Escpos\Printer;

class PrintService
{
    public function printReceipt()
    {
        try {
            // Instantiate the printer
            $connector = new WindowsPrintConnector("EPSON_TM");
            $printer = new Printer($connector);

            // Sample data
            $items = [
                ['description' => 'Item 1 Description', 'quantity' => 2, 'amount' => 10.00],
                ['description' => 'Item 2 Description', 'quantity' => 1, 'amount' => 5.50],
                ['description' => 'Item 3 Description', 'quantity' => 3, 'amount' => 7.75],
            ];

            // Print receipt components
            $this->printHeader($printer);
            $this->printItems($printer, $items);
            $this->printTotals($printer, $items);
            $this->printFooter($printer);

            // Generate and print QR code
            // $this->printQRCode($printer, 'https://example.com');
            $printer->setJustification(Printer::JUSTIFY_CENTER);
            $printer->qrCode("exampledoman.com",Printer::QR_ECLEVEL_L,4,Printer::QR_MODEL_2);

            // Close the connection
            $printer->close();
        } catch (\Exception $e) {
            // Handle error
            dd($e);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    protected function printHeader(Printer $printer)
    {
        $printer->setEmphasis(true);
        $printer->text($this->centerText("My Store") . "\n");
        $printer->text($this->centerText("1234 Business Rd") . "\n");
        $printer->text($this->centerText("City, State, ZIP") . "\n");
        $printer->text($this->fullWidthLine() . "\n");
        $printer->text($this->centerText("Invoice") . "\n");
        $printer->text($this->fullWidthLine() . "\n");
        $printer->setEmphasis(false);
    }

    protected function printItems(Printer $printer, array $items)
    {
        $printer->text(sprintf("%-24s %4s %10s\n", "Item", "Qty", "Amt")); // Adjust to 40 characters
        $printer->text($this->fullWidthLine() . "\n");

        foreach ($items as $item) {
            $printer->text(sprintf("%-24s %4d %10.2f\n", $item['description'], $item['quantity'], $item['amount']));
        }

        $printer->text($this->fullWidthLine() . "\n");
    }

    protected function printTotals(Printer $printer, array $items)
    {
        $subtotal = array_sum(array_column($items, 'amount'));
        $tax = $subtotal * 0.10;
        $total = $subtotal + $tax;

        $printer->text(sprintf("%-24s %10.2f\n", "Subtotal:", $subtotal));
        $printer->text(sprintf("%-24s %10.2f\n", "Tax (10%):", $tax));
        $printer->text(sprintf("%-24s %10.2f\n", "Total:", $total));
        $printer->text($this->fullWidthLine() . "\n");
    }

    protected function printFooter(Printer $printer)
    {
        $printer->text($this->centerText("Thank you for your business!") . "\n");
        $printer->cut();
    }

    protected function printQRCode(Printer $printer, $data)
    {
        try {
            // Ensure you use appropriate QR Code size and error correction level
            $printer->setJustification(Printer::JUSTIFY_CENTER);
            $printer->qrCode("exampledoman.com",Printer::QR_ECLEVEL_L,3,Printer::QR_MODEL_2);
            // $printer->text("\n"); // Add space before QR code
            
            // // QR Code model and size
            // $printer->text("\x1D\x28\x6B\x04\x00\x31\x43\x03"); // Set QR code model (2D) and size (3)
            // $printer->text("\x1D\x28\x6B\x03\x00\x31\x45\x00"); // Set error correction level (L)
            // $printer->text("\x1D\x28\x6B\x03\x00\x31\x43\x07"); // Set QR code size (1 to 8)

            // // Write the data to the QR code
            // $dataLength = strlen($data);
            // $printer->text("\x1D\x28\x6B" . chr($dataLength + 3) . "\x00\x31\x50\x30" . $data . "\x00"); // QR code data
            
            // // Print the QR Code
            // $printer->text("\x1D\x28\x6B\x03\x00\x31\x51\x30"); // Print QR code

            // $printer->text("\n"); // Add space after QR code
        } catch (\Exception $ex) {
            // Log or handle the exception
            error_log("Error: " . $ex->getMessage());
            throw $ex; // Re-throw or handle accordingly
        }
    }

    /**
     * Center text for a fixed width (assumes 40 characters width)
     */
    protected function centerText($text, $width = 48)
    {
        $length = strlen($text);
        $padding = max(0, ($width - $length) / 2);
        return str_repeat(" ", floor($padding)) . $text;
    }

    /**
     * Generate a full-width line (assumes 40 characters width)
     */
    protected function fullWidthLine($width = 48)
    {
        return str_repeat("-", $width);
    }
}
