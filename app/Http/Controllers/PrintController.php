<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\PrintService;
class PrintController extends Controller
{
    public function handleNewTestPrint(PrintService $printService){
        $printService->printReceipt();
    }
}
