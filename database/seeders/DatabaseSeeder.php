<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Seeders\AdminSeeder;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\UserRole;
use App\Models\role_has_permissions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Traits\HasRoles;
use \Illuminate\Support\Collection;
use Exception;
use Illuminate\Support\Facades\Log;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run()
    {
        $this->createUsers();
        $this->createRoles();
        $this->createUserRoles();
        $this->createPermissions();
        $this->assignPermissionsToRoles();
    }

    private function createUsers()
    {
        User::firstOrCreate([
            'email' => 'admin@example.com',
        ], [
            'name' => 'admin',
            'password' => bcrypt('12345678'),
            'country' => 'N.A',
            'state' => 'N.A'
        ]);

        User::firstOrCreate([
            'email' => 'developer@example.com',
        ], [
            'name' => 'developer',
            'password' => bcrypt('12345678'),
            'country' => 'N.A',
            'state' => 'N.A'
        ]);

        User::firstOrCreate([
            'email' => 'projectManager@example.com',
        ], [
            'name' => 'projectManager',
            'password' => bcrypt('12345678'),
            'country' => 'N.A',
            'state' => 'N.A'
        ]);
    }

    private function createRoles()
    {
        Role::firstOrCreate([
            'name' => 'Admin',
            'guard_name' => 'web',
        ]);

        Role::firstOrCreate([
            'name' => 'developer',
            'guard_name' => 'web',
        ]);

        Role::firstOrCreate([
            'name' => 'projectManager',
            'guard_name' => 'web',
        ]);
    }

    private function createUserRoles()
    {
        $admin = User::where('email', 'admin@example.com')->first();
        $developer = User::where('email', 'developer@example.com')->first();
        $projectManager = User::where('email', 'projectManager@example.com')->first();

        $adminRole = Role::where('name', 'Admin')->first();
        $developerRole = Role::where('name', 'developer')->first();
        $projectManagerRole = Role::where('name', 'projectManager')->first();

        if ($admin && $adminRole && !$admin->hasRole($adminRole)) {
            $admin->assignRole($adminRole);
        }

        if ($developer && $developerRole && !$developer->hasRole($developerRole)) {
            $developer->assignRole($developerRole);
        }

        if ($projectManager && $projectManagerRole && !$projectManager->hasRole($projectManagerRole)) {
            $projectManager->assignRole($projectManagerRole);
        }
    }

    private function createPermissions()
    {
        Permission::firstOrCreate([
            'name' => 'create_project',
            'guard_name' => 'web',
        ]);

        Permission::firstOrCreate([
            'name' => 'update_project',
            'guard_name' => 'web',
        ]);

        Permission::firstOrCreate([
            'name' => 'view_project',
            'guard_name' => 'web',
        ]);

        Permission::firstOrCreate([
            'name' => 'delete_project',
            'guard_name' => 'web',
        ]);

        Permission::firstOrCreate([
            'name' => 'create_tasks',
            'guard_name' => 'web',
        ]);

        Permission::firstOrCreate([
            'name' => 'update_tasks',
            'guard_name' => 'web',
        ]);

        Permission::firstOrCreate([
            'name' => 'delete_tasks',
            'guard_name' => 'web',
        ]);

        Permission::firstOrCreate([
            'name' => 'view_tasks',
            'guard_name' => 'web',
        ]);
        Permission::firstOrCreate([
            'name' => 'reactive',
            'guard_name' => 'web',
        ]);
        Permission::firstOrCreate([
            'name' => 'update_status',
            'guard_name' => 'web',
        ]);
        Permission::firstOrCreate([
            'name' => 'view_pdf',
            'guard_name' => 'web',
        ]);
    }

    private function assignPermissionsToRoles()
    {
        $adminRole = Role::where('name', 'Admin')->first();
        $developerRole = Role::where('name', 'developer')->first();
        $projectManagerRole = Role::where('name', 'projectManager')->first();

        $createProjectPermission = Permission::where('name', 'create_project')->first();
        $updateProjectPermission = Permission::where('name', 'update_project')->first();
        $viewProjectPermission = Permission::where('name', 'view_project')->first();
        $deleteProjectPermission = Permission::where('name', 'delete_project')->first();
        $createTasksPermission = Permission::where('name', 'create_tasks')->first();
        $updateTasksPermission = Permission::where('name', 'update_tasks')->first();
        $deleteTasksPermission = Permission::where('name', 'delete_tasks')->first();
        $viewTasksPermission = Permission::where('name', 'view_tasks')->first();
        $reactivePermission = Permission::where('name', 'reactive')->first();
        $developerRole = Role::where('name', 'developer')->first();
        $updateStatusPermission = Permission::where('name', 'update_status')->first();
        $view_pdfPermission = Permission::where('name', 'view_pdf')->first();

        if ($adminRole && $createProjectPermission && !$adminRole->hasPermissionTo($createProjectPermission)) {
            $adminRole->givePermissionTo($createProjectPermission);
        }

        if ($adminRole && $updateProjectPermission && !$adminRole->hasPermissionTo($updateProjectPermission)) {
            $adminRole->givePermissionTo($updateProjectPermission);
        }

        if ($adminRole && $viewProjectPermission && !$adminRole->hasPermissionTo($viewProjectPermission)) {
            $adminRole->givePermissionTo($viewProjectPermission);
        }

        if ($adminRole && $deleteProjectPermission && !$adminRole->hasPermissionTo($deleteProjectPermission)) {
            $adminRole->givePermissionTo($deleteProjectPermission);
        }

        if ($adminRole && $createTasksPermission && !$adminRole->hasPermissionTo($createTasksPermission)) {
            $adminRole->givePermissionTo($createTasksPermission);
        }

        if ($adminRole && $updateTasksPermission && !$adminRole->hasPermissionTo($updateTasksPermission)) {
            $adminRole->givePermissionTo($updateTasksPermission);
        }

        if ($adminRole && $deleteTasksPermission && !$adminRole->hasPermissionTo($deleteTasksPermission)) {
            $adminRole->givePermissionTo($deleteTasksPermission);
        }

        if ($adminRole && $viewTasksPermission && !$adminRole->hasPermissionTo($viewTasksPermission)) {
            $adminRole->givePermissionTo($viewTasksPermission);
        }
        if ($developerRole && $viewTasksPermission && !$developerRole->hasPermissionTo($viewTasksPermission)) {
            $developerRole->givePermissionTo($viewTasksPermission);
        }
        if ($projectManagerRole && $viewProjectPermission && !$projectManagerRole->hasPermissionTo($viewProjectPermission)) {
            $projectManagerRole->givePermissionTo($viewProjectPermission);
        }
        if ($projectManagerRole && $updateTasksPermission && !$projectManagerRole->hasPermissionTo($updateTasksPermission)) {
            $projectManagerRole->givePermissionTo($updateTasksPermission);
        }
        if ($projectManagerRole && $viewTasksPermission && !$projectManagerRole->hasPermissionTo($viewTasksPermission)) {
            $projectManagerRole->givePermissionTo($viewTasksPermission);
        }
        if ($adminRole && $reactivePermission && !$adminRole->hasPermissionTo($reactivePermission)) {
            $adminRole->givePermissionTo($reactivePermission);
        }
        if ($developerRole && $updateStatusPermission && !$developerRole->hasPermissionTo($updateStatusPermission)) {
            $developerRole->givePermissionTo($updateStatusPermission);
        }
        if ($adminRole && $view_pdfPermission && !$adminRole->hasPermissionTo($view_pdfPermission)) {
            $adminRole->givePermissionTo($view_pdfPermission);
        }
    }
}
