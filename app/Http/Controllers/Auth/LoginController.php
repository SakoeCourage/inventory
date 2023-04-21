<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;


class LoginController extends Controller
{
    /**
     * Handle an authentication attempt.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function authenticate(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);
 
        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            return response("ok",200);
        }
       throw ValidationException::withMessages(['email'=> 'The provided credentials do not match our records. ']);
    }
}
