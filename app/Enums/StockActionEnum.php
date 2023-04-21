<?php 

namespace App\Enums;

enum StockActionEnum:string {
    case Appreciate = "addition";
    case Depreciate = "reduction";
}