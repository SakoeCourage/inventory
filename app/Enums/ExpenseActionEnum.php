<?php 

namespace App\Enums;

enum ExpenseActionEnum:string {
    case Approve = "approve";
    case Decline = "decline";
}