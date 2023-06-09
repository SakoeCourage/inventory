<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesController extends Controller
{
    public function index()
    {
        return (['roles' => Role::latest()->paginate(10)]
        );
    }

    public function toselect()
    {
        return (['roles' => Role::get(['id', 'name'])->except('1')]
        );
    }

    public function updateOrCreate(Request $request)
    {
        $request->validate(
            [
                'name' => ['required', 'string', 'max:255', 'unique:roles,name,' . $request->id ?? null]
            ]
        );
        if ($request->id) {
            $roleName = Role::findById($request->id)->name;
            if ($roleName === 'Super Admin') {
                throw new \Exception('Unable to make changes to ' . $roleName);
            }
        }
        Role::updateOrCreate(['id' => $request->id ?? null], ['name' => $request->name]);
    }

    public function create(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:roles,name']
        ]);
        Role::create($data);
    }

    public function permissionToSelect()
    {
        return ([
            'permissions' => \Spatie\Permission\Models\Permission::all()
        ]);
    }

    public function getPermissionFromRoleName($rolename)
    {
        return [
            'rolePermissions' => Role::findByName($rolename)->permissions()->get(['name'])->pluck('name'),
            'permissions' => Permission::orderBy('created_at')->get(['name'])->pluck('name')
        ];
    }

    public function applyNewPermissions(Request $request)
    {
        if ((String)$request->roleName === 'Super Admin') {
            throw new \Exception("Unable to make changes to " . $request->roleName);
        }
        return Role::findByName($request->roleName)->syncPermissions($request->permissions);
    }
}
