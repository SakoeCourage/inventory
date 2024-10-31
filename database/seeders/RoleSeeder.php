<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        //dashboard
        Permission::create(['name'=> 'view dashboard']);

        //expense
        Permission::create(['name' => 'create expense']);
        Permission::create(['name' => 'authorize expense']);

        // stockmgmt
        Permission::create(['name' => 'manage stock data']);
     

        //Sale mgmt
        Permission::create(['name'=>'generate product order']);
     

        //Report mgmt
        Permission::create(['name' => 'generate report']);

        // usermgmt
        Permission::create(['name' => 'manage users']);
      
        Permission::create(['name'=>'view revenue']);
        //Sytem definition
        Permission::create(['name' => 'define system data']);
         // Super Admin
        Role::create(['name' => 'Super Admin']);

        // admin role
     
        $admin = Role::create(['name' => 'Administrator']);
        $admin->syncPermissions([
              'manage stock data','view dashboard'
        ]);
        $salemanager = Role::create(['name' => 'Sales Manager']);
        $salemanager->syncPermissions([
              'generate report','view dashboard','generate product order'
        ]);
       
    }
}
