<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

class LogoutController extends Controller
{
    public function  __construct(){
        $this->middleware('auth');
    }

    public function logout(){
        request()->user()->currentAccessToken()->delete();
    }
}
