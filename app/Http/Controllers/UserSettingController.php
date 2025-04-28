<?php

namespace App\Http\Controllers;

use App\Models\UserSetting;
use Illuminate\Http\Request;

class UserSettingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'settings.mail_setting.new_expense_request' => 'required|boolean',
            'settings.mail_setting.new_invoice' => 'required|boolean',
            'settings.mail_setting.out_of_stock' => 'required|boolean',
            'settings.mail_setting.stock_reduction' => 'required|boolean',
        ]);

        UserSetting::updateOrCreate(['user_id' => $request->user()->id], $data);
        
        return response()->json(['success' => true]);
    }



    public function getAuthUserSetting (Request $request) {

        $data =  UserSetting::where('user_id', $request->user()->id)->first();
        
        return response()->json($data);
    } 


    /**
     * Display the specified resource.
     */
    public function show(UserSetting $userSetting)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(UserSetting $userSetting)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, UserSetting $userSetting)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(UserSetting $userSetting)
    {
        //
    }
}
