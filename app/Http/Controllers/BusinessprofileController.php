<?php

namespace App\Http\Controllers;

use App\Models\Businessprofile;
use Illuminate\Http\Request;

class BusinessprofileController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Businessprofile::get()->first();
    }

    /**
     * Show the form for creating a new resource.
     */
    public function createorupdate(Request $request)
    {
        $data = $request->validate([
            'business_name' => ['required'],
            'address' => ['required'],
            'box_number' => ['required'],
            'street' => ['required'],
            'tel_1' => ['required'],
            'tel_2' => ['nullable'],
            'business_email' => ['nullable', 'email'],
            'about_business' => ['nullable']
        ]);

        $has_profile = Businessprofile::first();

        if ($has_profile) {
            $has_profile->update($data);
        } else {
            Businessprofile::create($data);
        }
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Businessprofile $businessprofile)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Businessprofile $businessprofile)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Businessprofile $businessprofile)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Businessprofile $businessprofile)
    {
        //
    }
}