<?php

namespace Database\Seeders;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\UserRole;
// use App\Models\Role;
// use App\Models\User;
use App\Models\role_has_permissions;
// use App\Models\Permission;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Traits\HasRoles;
use \Illuminate\Support\Collection;
use Exception;
use Illuminate\Support\Facades\Log;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
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
            'password' => bcrypt('password'),
        ]);

        User::firstOrCreate([
            'email' => 'developer@example.com',
        ], [
            'name' => 'developer',
            'password' => bcrypt('password'),
        ]);

        User::firstOrCreate([
            'email' => 'projectManager@example.com',
        ], [
            'name' => 'projectManager',
            'password' => bcrypt('password'),
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
    }

    private function assignPermissionsToRoles()
    {
        $adminRole = Role::where('name', 'Admin')->first();
        $developerRole = Role::where('name', 'developer')->first();
        $projectManagerRole=Role::where('name','projectManager')->first();

        $createProjectPermission = Permission::where('name', 'create_project')->first();
        $updateProjectPermission = Permission::where('name', 'update_project')->first();
        $viewProjectPermission = Permission::where('name', 'view_project')->first();
        $deleteProjectPermission = Permission::where('name', 'delete_project')->first();
        $createTasksPermission = Permission::where('name', 'create_tasks')->first();
        $updateTasksPermission = Permission::where('name', 'update_tasks')->first();
        $deleteTasksPermission = Permission::where('name', 'delete_tasks')->first();
        $viewTasksPermission = Permission::where('name', 'view_tasks')->first();

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
    }



    // public function run(): void
    // {
        // Create admin user
        //  $admin = User::create([
        //     'name' => 'admin',
        //     'email' => 'admin@example.com',
        //     'password' => bcrypt('password'),
        // ]);
        // // Create roles adminRole
        // $adminRole = Role::create([
        //     'name' => 'Admin',
        //     'guard_name' => 'web',
        // ]);
        // // Create roles developerRole
        // $developerRole = Role::create([
        //     'name' => 'developer',
        //     'guard_name' => 'web',
        // ]);
        // // Create roles projectManager
        // $projectManagerRole = Role::create([
        //     'name' => 'projectManager',
        //     'guard_name' => 'web',
        // ]);
        // // Create developer user
        // $developer = User::create([
        //     'name' => 'developer',
        //     'email' => 'developer@example.com',
        //     'password' => bcrypt('password'),
        // ]);
        // // Create projectManager user
        // $projectManager = User::create([
        //     'name' => 'projectManager',
        //     'email' => 'projectManager@example.com',
        //     'password' => bcrypt('password'),
        // ]);
        // // Assign roles to users
        // UserRole::create([
        //     'user_id' => $admin->id,
        //     'role_id' => $adminRole->id,
        // ]);
        // // Assign roles to users
        // UserRole::create([
        //     'user_id' => $developer->id,
        //     'role_id' => $developerRole->id,
        // ]);
        // // Assign roles to users
        // UserRole::create([
        //     'user_id' => $projectManager->id,
        //     'role_id' => $projectManagerRole->id,
        // ]);
        // // Create permissions
        // $createProjectPermission = Permission::create([
        //     'name' => 'create_project',
        //     'guard_name' => 'web',
        // ]);
        // $updateProjectPermission = Permission::create([
        //     'name' => 'update_project',
        //     'guard_name' => 'web',
        // ]);
        // $viewProjectPermission = Permission::create([
        //     'name' => 'view_project',
        //     'guard_name' => 'web',
        // ]);
        // $deleteProjectPermission = Permission::create([
        //     'name' => 'delete_project',
        //     'guard_name' => 'web',
        // ]);
        // $createTasksPermission = Permission::create([
        //     'name' => 'create_tasks',
        //     'guard_name' => 'web',
        // ]);
        // $updateTasksPermission = Permission::create([
        //     'name' => 'update_tasks',
        //     'guard_name' => 'web',
        // ]);
        // $deleteTasksPermission = Permission::create([
        //     'name' => 'delete_tasks',
        //     'guard_name' => 'web',
        // ]);
        // $viewTasksPermission = Permission::create([
        //     'name' => 'view_tasks',
        //     'guard_name' => 'web',
        // ]);
        // DB::table('role_has_permissions')->insert([
        //     [
        //         'permission_id' => $createProjectPermission->id,
        //         'role_id' => $adminRole->id,
        //     ],
        //     [
        //         'permission_id' => $viewProjectPermission->id,
        //         'role_id' => $adminRole->id,
        //     ],
        //     [
        //         'permission_id' => $updateProjectPermission->id,
        //         'role_id' => $adminRole->id,
        //     ],
        //     [
        //         'permission_id' => $deleteProjectPermission->id,
        //         'role_id' => $adminRole->id,
        //     ],
        //     [
        //         'permission_id' => $createTasksPermission->id,
        //         'role_id' => $adminRole->id,
        //     ],
        //     [
        //         'permission_id' => $updateTasksPermission->id,
        //         'role_id' => $adminRole->id,
        //     ],
        //     [
        //         'permission_id' => $deleteTasksPermission->id,
        //         'role_id' => $adminRole->id,
        //     ],
        //     [
        //         'permission_id' => $viewTasksPermission->id,
        //         'role_id' => $adminRole->id,
        //     ],
        //     [
        //         'permission_id' => $viewTasksPermission->id,
        //         'role_id' => $developerRole->id,
        //     ],
        //     [
        //         'permission_id' => $updateProjectPermission->id,
        //         'role_id' => $projectManagerRole->id,
        //     ],
        //     [
        //         'permission_id' => $viewProjectPermission->id,
        //         'role_id' => $projectManagerRole->id,
        //     ],
        //     [
        //         'permission_id' => $updateTasksPermission->id,
        //         'role_id' => $projectManagerRole->id,
        //     ],
        //     [
        //         'permission_id' => $viewTasksPermission->id,
        //         'role_id' => $projectManagerRole->id,
        //     ],
        // ]);
    // }  






    // public function run()
    // {
    //     $this->createUsers();
    //     $this->createRoles();
    //     $this->createUserRoles();
    //     $this->createPermissions();
    //     $this->assignPermissionsToRoles();
    // }

    // private function createUsers()
    // {
    //     try {
    //         User::createOrUpdate([
    //             'email' => 'admin@example.com',
    //         ], [
    //             'name' => 'admin',
    //             'password' => bcrypt('password'),
    //         ]);

    //         User::createOrUpdate([
    //             'email' => 'developer@example.com',
    //         ], [
    //             'name' => 'developer',
    //             'password' => bcrypt('password'),
    //         ]);

    //         User::createOrUpdate([
    //             'email' => 'projectManager@example.com',
    //         ], [
    //             'name' => 'projectManager',
    //             'password' => bcrypt('password'),
    //         ]);
    //     } catch (\Throwable $th) {
    //         // Handle the exception if needed
    //     }
    // }

    // private function createRoles()
    // {
    //     try {
    //         Role::createOrUpdate([
    //             'name' => 'Admin',
    //             'guard_name' => 'web',
    //         ]);

    //         Role::createOrUpdate([
    //             'name' => 'developer',
    //             'guard_name' => 'web',
    //         ]);

    //         Role::createOrUpdate([
    //             'name' => 'projectManager',
    //             'guard_name' => 'web',
    //         ]);
    //     } catch (\Throwable $th) {
    //         // Handle the exception if needed
    //     }
    // }

    // private function createUserRoles()
    // {
    //     try {
    //         $admin = User::where('email', 'admin@example.com')->findOrFail();
    //         $developer = User::where('email', 'developer@example.com')->findOrFail();
    //         $projectManager = User::where('email', 'projectManager@example.com')->findOrFail();

    //         $adminRole = Role::where('name', 'Admin')->findOrFail();
    //         $developerRole = Role::where('name', 'developer')->findOrFail();
    //         $projectManagerRole = Role::where('name', 'projectManager')->findOrFail();

    //         if ($admin && $adminRole && !$admin->hasRole($adminRole)) {
    //             $admin->assignRole($adminRole);
    //         }

    //         if ($developer && $developerRole && !$developer->hasRole($developerRole)) {
    //             $developer->assignRole($developerRole);
    //         }

    //         if ($projectManager && $projectManagerRole && !$projectManager->hasRole($projectManagerRole)) {
    //             $projectManager->assignRole($projectManagerRole);
    //         }
    //     } catch (ModelNotFoundException $e) {
    //         // Handle the exception if needed
    //     }
    // }

    // private function createPermissions()
    // {
    //     try {
    //         Permission::createOrUpdate([
    //             'name' => 'create_project',
    //             'guard_name' => 'web',
    //         ]);

    //         Permission::createOrUpdate([
    //             'name' => 'update_project',
    //             'guard_name' => 'web',
    //         ]);

    //         Permission::createOrUpdate([
    //             'name' => 'view_project',
    //             'guard_name' => 'web',
    //         ]);

    //         Permission::createOrUpdate([
    //             'name' => 'delete_project',
    //             'guard_name' => 'web',
    //         ]);

    //         Permission::createOrUpdate([
    //             'name' => 'create_tasks',
    //             'guard_name' => 'web',
    //         ]);

    //         Permission::createOrUpdate([
    //             'name' => 'update_tasks',
    //             'guard_name' => 'web',
    //         ]);

    //         Permission::createOrUpdate([
    //             'name' => 'delete_tasks',
    //             'guard_name' => 'web',
    //         ]);

    //         Permission::createOrUpdate([
    //             'name' => 'view_tasks',
    //             'guard_name' => 'web',
    //         ]);
    //     } catch (\Throwable $th) {
    //         // Handle the exception if needed
    //     }
    // }

    // private function assignPermissionsToRoles()
    // {
    //     try {
    //         $adminRole = Role::where('name', 'Admin')->findOrFail();
    //         $developerRole = Role::where('name', 'developer')->findOrFail();
    //         $projectManagerRole = Role::where('name', 'projectManager')->findOrFail();

    //         $createProjectPermission = Permission::where('name', 'create_project')->findOrFail();
    //         $updateProjectPermission = Permission::where('name', 'update_project')->findOrFail();
    //         $viewProjectPermission = Permission::where('name', 'view_project')->findOrFail();
    //         $deleteProjectPermission = Permission::where('name', 'delete_project')->findOrFail();
    //         $createTasksPermission = Permission::where('name', 'create_tasks')->findOrFail();
    //         $updateTasksPermission = Permission::where('name', 'update_tasks')->findOrFail();
    //         $deleteTasksPermission = Permission::where('name', 'delete_tasks')->findOrFail();
    //         $viewTasksPermission = Permission::where('name', 'view_tasks')->findOrFail();

    //         if ($adminRole && $createProjectPermission && !$adminRole->hasPermissionTo($createProjectPermission)) {
    //             $adminRole->givePermissionTo($createProjectPermission);
    //         }
    
    //         if ($adminRole && $updateProjectPermission && !$adminRole->hasPermissionTo($updateProjectPermission)) {
    //             $adminRole->givePermissionTo($updateProjectPermission);
    //         }
    
    //         if ($adminRole && $viewProjectPermission && !$adminRole->hasPermissionTo($viewProjectPermission)) {
    //             $adminRole->givePermissionTo($viewProjectPermission);
    //         }
    
    //         if ($adminRole && $deleteProjectPermission && !$adminRole->hasPermissionTo($deleteProjectPermission)) {
    //             $adminRole->givePermissionTo($deleteProjectPermission);
    //         }
    
    //         if ($adminRole && $createTasksPermission && !$adminRole->hasPermissionTo($createTasksPermission)) {
    //             $adminRole->givePermissionTo($createTasksPermission);
    //         }
    
    //         if ($adminRole && $updateTasksPermission && !$adminRole->hasPermissionTo($updateTasksPermission)) {
    //             $adminRole->givePermissionTo($updateTasksPermission);
    //         }
    
    //         if ($adminRole && $deleteTasksPermission && !$adminRole->hasPermissionTo($deleteTasksPermission)) {
    //             $adminRole->givePermissionTo($deleteTasksPermission);
    //         }
    
    //         if ($adminRole && $viewTasksPermission && !$adminRole->hasPermissionTo($viewTasksPermission)) {
    //             $adminRole->givePermissionTo($viewTasksPermission);
    //         }
    //         if ($developerRole && $viewTasksPermission && !$developerRole->hasPermissionTo($viewTasksPermission)) {
    //             $developerRole->givePermissionTo($viewTasksPermission);
    //         }
    //         if ($projectManagerRole && $viewProjectPermission && !$projectManagerRole->hasPermissionTo($viewProjectPermission)) {
    //             $projectManagerRole->givePermissionTo($viewProjectPermission);
    //         }
    //         if ($projectManagerRole && $updateTasksPermission && !$projectManagerRole->hasPermissionTo($updateTasksPermission)) {
    //             $projectManagerRole->givePermissionTo($updateTasksPermission);
    //         }
    //         if ($projectManagerRole && $viewTasksPermission && !$projectManagerRole->hasPermissionTo($viewTasksPermission)) {
    //             $projectManagerRole->givePermissionTo($viewTasksPermission);
    //         }
    //         // Rest of the code...
    //     } catch (ModelNotFoundException $e) {
    //         // Handle the exception if needed
    //     }     
    // }
}




