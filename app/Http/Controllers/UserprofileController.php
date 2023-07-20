<?php

namespace App\Http\Controllers;

use App\Models\Userprofile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;


class UserprofileController extends Controller
{
    public function validationcheck(Request $request)
    {
        $request->validate([
            'email' => ['required','email','unique:users,email,'. Auth::user()->id],
            'current_password' => ['required'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);
        if(!Hash::check($request->current_password, Auth::user()->password)){
            throw \Illuminate\Validation\ValidationException::withMessages(
                [
                    'current_password' => 'Current password does not match our records'
                ]
            );
        } 
    }
    

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $this->validationcheck($request);
        $user = User::where('id',Auth::user()->id)->firstorFail();
        $user->update([
            'email' => $request->email,
            'password' => Hash::make($request->password)
        ]);
        Auth::guard('web')->logout();
        return response('done');
    }
  
}
