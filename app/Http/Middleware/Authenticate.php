<?php

namespace App\Http\Middleware;

// use App\Models\Permission;

use App\Models\role_has_permissions;
use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\UserRole;
use Spatie\Permission\Traits\HasRoles;
use Spatie\Permission\Traits\HasPermission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request)
    {
        info('middleware called');
        // return $request->expectsJson() ? null : route('login');
        $Permission = $request->header('Permission');
        $authentication = $request->header('authentication');
        $email = $request->header('email');

        info($Permission);
        info($authentication);
        info($email);

        //user
        $users = User::where('email', $email)->get();
        info($users);

        //userrole
        $user = $users->first();
        $userRole = UserRole::where('user_id', $user->id)->first();
        info($userRole);

        //rolehaspermission
        $rolePermissions = Permission::whereIn('id', function ($query) use ($userRole) {
            $query->select('permission_id')
                ->from('role_has_permissions')
                ->where('role_id', $userRole->role_id);
        })->get();
        info(" role permission : " . $rolePermissions);

        $rolehasPermission = Permission::where('name', $Permission)->get();
        info($rolehasPermission);
    }
}
