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
use Illuminate\Support\Facades\Storage;

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

                if ($permission == null || $permission == '') {
                    Log::info("Controller::UserController::index::");
                    return response()->json(['error' => 'permission Unauthorized'], 500);
                }

                // Get the authenticated user
                $user = auth()->user();
                if ($user == null || $user == '') {
                    Log::info("Controller::UserController::index::");
                    return response()->json(['error' => 'Unauthorized'], 401);
                }

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

    /** 
     * @author : UDAY SONI
     * Method name: search
     * search the specified resource from storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function search(Request $request)
    {
        $result = DB::transaction(function () use ($request) {
            try {
                Log::info("Controller::Usercontroller::search::START");
                $searchQuery = $request->input('searchQuery');

                $users = User::where('name', 'LIKE', "%$searchQuery%")
                    ->paginate(5);

                Log::info("Controller::Usercontroller::search::END");
                return response()->json($users);
            } catch (\Exception $ex) {
                // Log the exception if needed
                Log::error("Error in searching users: " . $ex->getMessage());

                // Return an error response
                return response()->json(['error' => 'Unable to perform search'], 500);
            }
        });
        return $result;
    }
    // public function destroy($id)
    // {
    //     try {
    //         // Find the user by ID and get the filename of the image
    //         $user = User::findOrFail($userId);
    //         $imageFilename = $user->filename;

    //         // Create an S3 client
    //         $s3 = new S3Client(config('s3'));

    //         // Specify your S3 bucket name
    //         $bucketName = 'snapstics-staging-file-storage';

    //         // Delete the user's image from the S3 bucket
    //         $s3->deleteObject([
    //             'Bucket' => $bucketName,
    //             'Key' => 'images/' . $imageFilename,
    //         ]);

    //         // Update the user's image filename in the database (optional)
    //         $user->filename = null;
    //         $user->save();

    //         return response()->json([
    //             'success' => true,
    //             'message' => 'User image deleted successfully',
    //         ]);
    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'User image deletion failed',
    //             'error' => $e->getMessage(),
    //         ], 500);
    //     }
    // }

}
