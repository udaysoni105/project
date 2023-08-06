<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\UserRole;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\JsonResponse;
use Spatie\Permission\Models\Role;

/** @author UDAY SONI
 *
 * Class name: UserController
 * Create a new controller for doing operation on User module.
 *
 */
class UserController extends Controller
{
    /** 
     * @author : UDAY SONI
     * Method name: index
     * Display a listing of users based on the user's role and permission.
     *
     * @return \Illuminate\Http\Response
     *
     * @param Request $request
     * @return JsonResponse
     * @throws Exception
     */
    public function index(Request $request): JsonResponse
    {
        $result = DB::transaction(function () use ($request) { // Add $request parameter to the closure
            try {
                Log::info("Controller::UserController::index::START");

                // Get the permission from the request header
                $permission = $request->header('permission');

                // Get the authenticated user
                $user = auth()->user();

                // Get the user's role information
                $userRole = UserRole::where('user_id', $user->id)->first();

                // Get the permissions associated with the user's role
                $rolePermissions = Permission::whereIn('id', function ($query) use ($userRole) {
                    $query->select('permission_id')
                        ->from('role_has_permissions')
                        ->where('role_id', $userRole->role_id);
                })->get();

                // Check if the user has the required permission
                $hasPermission = $rolePermissions->contains('name', $permission);

                if (!$hasPermission) {
                    return response()->json(['error' => 'Unauthorized'], 403);
                }

                $matchedPermission = $rolePermissions->firstWhere('name', $permission);
                info('user has permission: ' . $matchedPermission->name);

                // Fetch users based on their roles
                if (in_array($userRole->role->name, ['admin', 'project manager'])) {
                    // For admin and project manager roles, only fetch developers
                    $users = User::whereHas('roles', function ($query) {
                        $query->where('name', 'developer');
                    })->get();
                } else {
                    // For other roles, fetch all users
                    $users = User::all();
                }

                // Exclude admin and project manager users from the response
                $filteredUsers = $users->reject(function ($user) {
                    return $user->hasRole('admin') || $user->hasRole('project manager');
                });

                Log::info("Controller::UserController::index::END"); // Add this line

                return response()->json($filteredUsers);
            } catch (Exception $ex) {
                Log::error("Controller::UserController::index:: An error occurred: " . $ex->getMessage());
                throw new Exception("An error occurred: " . $ex->getMessage());
            }
        });
        return $result;
    }
}
