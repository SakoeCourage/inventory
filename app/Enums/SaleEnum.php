<?php

namespace App\Enums;

enum SaleEnum: string
{
    case Regular = "regular";
    case Lease = "lease";
    case UnCollected = "un_collected";
}