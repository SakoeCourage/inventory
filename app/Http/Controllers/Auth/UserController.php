<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Userprofile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(User $user)
    {
        return [
            'users' => $user->search(request()->only('search'))
                ->latest()->paginate(10)->withQueryString(),
            'filters' => request()->only('search')
        ];
    }




    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = request()->validate([
            'name' => ['required', 'string', 'min:8', 'max:255', 'unique:users'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'firstname' => ['required', 'string', 'min:2', 'max:255'],
            'lastname' => ['required', 'string', 'min:2', 'max:255'],
            'gender' => ['required', 'string', 'min:2', 'max:255'],
            'contact' => ['required', 'string', 'min:10', 'max:10'],
            'role' => ['required', 'string', 'max:255']
        ]);

        DB::transaction(function () use ($data) {
            // creating new using
            $newuser = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make('inventorylite@'),
            ]);

            // assign role to user
            $newuser->assignRole($data['role']);

            // adding meta data to profile table
            Userprofile::create([
                'user_id' => $newuser->id,
                'firstname' => $data['firstname'],
                'lastname' => $data['lastname'],
                'contact' => $data['contact'],
                'gender' => $data['gender'],
            ]);
        });
    }

    /**
     * Display the specified resource.
     */
    public function show($user)
    {
        return User::with(['profile', 'roles:name'])->where('id', $user)
            ->get()
            ->map(function ($user, $key) {
                return [
                    'id' => $user->id,
                    'email' => $user->email,
                    'name' => $user->name,
                    'firstname' => $user->profile ? $user->profile->firstname : '',
                    'lastname' => $user->profile ? $user->profile->lastname : '',
                    'gender' => $user->profile ? $user->profile->gender : '',
                    'contact' => $user->profile ? $user->profile->contact : '',
                    'contact' => $user->profile ? $user->profile->contact : '',
                    'role' => $user->roles->first()->name,
                ];
            })->first();
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        $data = request()->validate([
            'name' => ['required', 'string', 'min:8', 'max:255', 'unique:users,name,' . $user->id],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'firstname' => ['required', 'string', 'min:2', 'max:255'],
            'lastname' => ['required', 'string', 'min:2', 'max:255'],
            'gender' => ['required', 'string', 'min:2', 'max:255'],
            'contact' => ['required', 'string', 'min:10', 'max:10'],
            'role' => ['required', 'string', 'max:255']
        ]);
        DB::transaction(function () use ($data, $user) {
            // creating new using
            $user->update([
                'name' => $data['name'],
                'email' => $data['email']
            ]);

            // assign role to user
            $user->syncRoles($data['role']);

            // adding meta data to profile table
            $user->profile->update([
                'firstname' => $data['firstname'],
                'lastname' => $data['lastname'],
                'contact' => $data['contact'],
                'gender' => $data['gender'],
            ]);
        });
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function resetPassword(User $user)
    {
        if ($user->getRoleNames()->first() === 'Super Admin') {
            $user->update([
                'password' => Hash::make('superAdmin@')
            ]);
        } else {
            $user->update([
                'password' => Hash::make('inventorylite@')
            ]);
        }
        return response('done');
    }
    public function destroy(User $user)
    {
        if ($user->getRoleNames()->first() === 'Super Admin') {
            throw new \Exception('Unable to remove ' . $user->getRoleNames()->first());
        } else {
            $user->delete();
        }
    }
}
