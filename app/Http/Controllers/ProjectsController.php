<?php


namespace App\Http\Controllers;

use App\Models\UserRole;
use Spatie\Permission\Models\Permission;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use App\Models\Task;

/** @author UDAY SONI
 *
 * Class name: ProjectsController
 * Create a new controller for doing operation on Project module.
 *
 */
class ProjectsController extends Controller
{
    /** 
     * 
     * @author : UDAY SONI
     * Method name: index
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        Log::info("Controller::ProjectsController::index::START");
        $result = DB::transaction(function () use ($request) {
            try {
                $permission = $request->header('permission');
                if ($permission == null || $permission == '') {
                    Log::info("Controller::ProjectsController::index::");
                    return response()->json(['error' => 'permission Unauthorized'], 401);
                }

                $user = auth()->user();
                if ($user == null || $user == '') {
                    Log::info("Controller::ProjectsController::index::");
                    return response()->json(['error' => 'Unauthorized'], 401);
                }

                $userRole = UserRole::where('user_id', $user->id)->first();

                $rolePermissions = Permission::whereIn('id', function ($query) use ($userRole) {
                    $query->select('permission_id')
                        ->from('role_has_permissions')
                        ->where('role_id', $userRole->role_id);
                })->get();

                $hasPermission = $rolePermissions->contains('name', $permission);

                // if (!$hasPermission) {
                //     info('Unauthorized');
                // }
                if ($hasPermission == null || $hasPermission == '') {
                    Log::info("Controller::ProjectsController::index::");
                    return response()->json(['error' => 'Unauthorized'], 401);
                }

                $matchedPermission = $rolePermissions->firstWhere('name', $permission);
                info('User has permission: ' . $matchedPermission->name);

                $projects = Project::all();

                Log::info("Controller::ProjectsController::index::END");
                return response()->json($projects);
            } catch (\Exception $ex) {
                Log::error("Error in ProjectsController::index: " . $ex->getMessage());
                return response()->json(['error' => 'An error occurred while fetching projects'], 500);
            }
        });

        return $result;
    }
    // public function index(Request $request)
    // {
    //     Log::info("Controller::ProjectsController::index::START");
    //     $result = DB::transaction(function () use ($request) {
    //         try {
    //             $permission = $request->header('permission');
    //             $errors = [];
    
    //             if ($permission == null || $permission == '') {
    //                 $errors[] = 'Permission header missing';
    //             }
    
    //             $user = auth()->user();
    //             if ($user == null || $user == '') {
    //                 $errors[] = 'User not authenticated';
    //             } else {
    //                 $userRole = UserRole::where('user_id', $user->id)->first();
    
    //                 $rolePermissions = Permission::whereIn('id', function ($query) use ($userRole) {
    //                     $query->select('permission_id')
    //                         ->from('role_has_permissions')
    //                         ->where('role_id', $userRole->role_id);
    //                 })->get();
    
    //                 $hasPermission = $rolePermissions->contains('name', $permission);
    
    //                 if (!$hasPermission) {
    //                     $errors[] = 'Unauthorized access';
    //                 } else {
    //                     $matchedPermission = $rolePermissions->firstWhere('name', $permission);
    //                     info('User has permission: ' . $matchedPermission->name);
    //                 }
    //             }
    
    //             if (!empty($errors)) {
    //                 Log::info("Controller::ProjectsController::index::Unauthorized attempts");
    //                 return response()->json(['errors' => $errors], 401);
    //             }
    
    //             $projects = Project::all();
    
    //             Log::info("Controller::ProjectsController::index::END");
    //             return response()->json($projects);
    //         } catch (\Exception $ex) {
    //             Log::error("Error in ProjectsController::index: " . $ex->getMessage());
    //             return response()->json(['error' => 'An error occurred while fetching projects'], 500);
    //         }
    //     });
    
    //     return $result;
    // }
    
    /** 
     * @author : UDAY SONI
     * Method name: store
     * Store a newly created resource in storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        Log::info("Controller::ProjectsController::store::START");
        $result = DB::transaction(function () use ($request) {
            try {
                $input = $request->all();
                if ($input == null || $input == '') {
                    Log::info("Controller::ProjectsController::store::");
                    return response()->json(['error' => 'store Unsuccessfully'], 500);
                }

                $permission = $request->header('permission');
                if ($permission == null || $permission == '') {
                    Log::info("Controller::ProjectsController::store::");
                    return response()->json(['error' => 'permission Unauthorized'], 401);
                }

                $user = auth()->user();
                if ($user == null || $user == '') {
                    Log::info("Controller::ProjectsController::store::");
                    return response()->json(['error' => 'Unauthorized'], 401);
                }

                $userRole = UserRole::where('user_id', $user->id)->first();

                $rolePermissions = Permission::whereIn('id', function ($query) use ($userRole) {
                    $query->select('permission_id')
                        ->from('role_has_permissions')
                        ->where('role_id', $userRole->role_id);
                })->get();

                $hasPermission = $rolePermissions->contains('name', $permission);

                if (!$hasPermission) {
                    info('Unauthorized');
                }

                $matchedPermission = $rolePermissions->firstWhere('name', $permission);
                info('user has permission: ' . $matchedPermission->name);

                $validator = Validator::make($request->all(), [
                    'name' => 'required',
                    // 'description' => '',
                    'start_date' => 'required|date',
                    'end_date' => 'required|date|after:start_date',
                ]);
                if ($validator->fails()) {
                    return response()->json(['errors' => $validator->errors()], 400);
                }

                $project = Project::create([
                    'name' => $request->name,
                    'description' => $request->description,
                    'start_date' => $request->start_date,
                    'end_date' => $request->end_date,
                ]);

                Log::info("Controller::ProjectsController::store::END");
                return response()->json(['message' => 'Project created successfully', 'project' => $project]);
            } catch (\Exception $ex) {
                Log::error("Error in ProjectsController::store: " . $ex->getMessage());
                return response()->json(['error' => 'An error occurred while creating the project'], 500);
            }
        });

        return $result;
    }

    /** 
     * @author : UDAY SONI
     * Method name: getTasksByProjectdate
     * Store a newly created resource in storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function getTasksByProjectdate(Request $request, $projectId)
    {
        Log::info("Controller::ProjectsController::getTasksByProjectId::START");
        // Use the $projectId parameter to query tasks by project ID
        $tasks = Task::where('project_id', $projectId)->get();
        Log::info("Controller::ProjectsController::getTasksByProjectId::END");
        // You can return the tasks as a JSON response
        return response()->json($tasks);
    }

    /** 
     * @author : UDAY SONI
     * Method name: show
     * Display the specified resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, string $id)
    {
        Log::info("Controller::ProjectsController::show::START");
        $result = DB::transaction(function () use ($id) {
            try {
                $project = Project::findOrFail($id);
                Log::info("Controller::ProjectsController::show::END");
                return response()->json($project);
            } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $ex) {
                return response()->json(['error' => 'Project not found'], 404);
            } catch (\Exception $ex) {
                Log::error("Error in ProjectsController::show: " . $ex->getMessage());
                return response()->json(['error' => 'An error occurred while fetching the project'], 500);
            }
        });

        return $result;
    }

    /** 
     * @author : UDAY SONI
     * Method name: update
     * Update the specified resource in storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        Log::info("Controller::ProjectsController::update::START");
        $result = DB::transaction(function () use ($request, $id) {
            try {
                $input = $request->all();
                if ($input == null || $input == '') {
                    Log::info("Controller::ProjectsController::update::");
                    return response()->json(['error' => 'update unsuccessfully'], 500);
                }

                $permission = $request->header('permission');
                if ($permission == null || $permission == '') {
                    Log::info("Controller::ProjectsController::update::");
                    return response()->json(['error' => 'permission Unauthorized'], 500);
                }

                $user = auth()->user();
                if ($user == null || $user == '') {
                    Log::info("Controller::ProjectsController::update::");
                    return response()->json(['error' => 'Unauthorized'], 401);
                }

                $userRole = UserRole::where('user_id', $user->id)->first();

                $rolePermissions = Permission::whereIn('id', function ($query) use ($userRole) {
                    $query->select('permission_id')
                        ->from('role_has_permissions')
                        ->where('role_id', $userRole->role_id);
                })->get();

                $hasPermission = $rolePermissions->contains('name', $permission);

                if (!$hasPermission) {
                    info('Unauthorized');
                }

                $matchedPermission = $rolePermissions->firstWhere('name', $permission);
                info('user has permission: ' . $matchedPermission->name);

                $validator = Validator::make($request->all(), [
                    'name' => 'required|string',
                    // 'description' => 'string',
                    'start_date' => 'required|date',
                    'end_date' => 'required|date|after:start_date',
                ]);

                if ($validator->fails()) {
                    return response()->json(['errors' => $validator->errors()], 400);
                }
                $project = Project::findOrFail($id);

                $project->update($request->all());

                if ($project == null || $project == '') {
                    Log::info("Controller::ProjectsController::update::");
                    return response()->json(['error' => 'project not found'], 500);
                }

                Log::info("Controller::ProjectsController::update::END");
                return response()->json(['message' => 'Project updated successfully', 'project' => $project]);
            } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $ex) {
                return response()->json(['error' => 'Project not found'], 404);
            } catch (\Exception $ex) {
                Log::error("Error in ProjectsController::update: " . $ex->getMessage());
                return response()->json(['error' => 'An error occurred while updating the project'], 500);
            }
        });
        return $result;
    }

    /** 
     * @author : UDAY SONI
     * Method name: searchProjects
     * searchProjects the specified resource from storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function searchProjects(Request $request)
    {
        Log::info("Controller::ProjectsController::searchProjects::START");
        $result = DB::transaction(function () use ($request) {
            try {
                $input = $request->all();
                if ($input == null || $input == '') {
                    Log::info("Controller::ProjectsController::searchProjects::");
                    return response()->json(['error' => 'permission Unauthorized'], 500);
                }

                $searchQuery = $request->input('searchQuery');

                $projects = Project::where('name', 'LIKE', "%$searchQuery%")
                    ->orWhere('description', 'LIKE', "%$searchQuery%")
                    ->orWhere('start_date', 'LIKE', "%$searchQuery%")
                    ->orWhere('end_date', 'LIKE', "%$searchQuery%")
                    ->paginate(5);
                Log::info("Controller::ProjectsController::searchProjects::END");
                return response()->json($projects);
            } catch (\Exception $ex) {
                Log::error("Error in ProjectsController::searchProjects: " . $ex->getMessage());
                return response()->json(['error' => 'An error occurred while searching projects'], 500);
            }
        });
        return $result;
    }

    /** 
     * @author : UDAY SONI
     * Method name: getProjects
     * getProjects the specified resource from storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function paginationProjects(Request $request)
    {
        Log::info("Controller::ProjectsController::paginationProjects::START");
        $result = DB::transaction(function () use ($request) {
            try {
                $input = $request->all();
                // info($input);
                if ($input == null || $input == '') {
                    Log::info("Controller::ProjectsController::paginationProjects::");
                    return response()->json(['error' => 'permission Unauthorized'], 500);
                }

                $perPage = $request->input('perPage', 5);
                $page = $request->input('page', 1);

                // Query your database for projects with pagination
                $projects = Project::paginate($perPage, ['*'], 'page', $page);
                Log::info("Controller::ProjectsController::paginationProjects::END");
                return response()->json($projects);
            } catch (\Exception $ex) {

                Log::error("Error in retrieving projects: " . $ex->getMessage());

                return response()->json(['error' => 'An error occurred while retrieving projects'], 500);
            }
        });
        return $result;
    }

    /** 
     * @author : UDAY SONI
     * Method name: SortedProjects
     * SortedProjects the specified resource from storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function SortedProjects(Request $request)
    {
        Log::info("Controller::ProjectsController::SortedProjects::START");
        $result = DB::transaction(function () use ($request) {
            try {
                $input = $request->all();
                if ($input == null || $input == '') {
                    Log::info("Controller::ProjectsController::SortedProjects::");
                    return response()->json(['error' => 'permission Unauthorized'], 500);
                }

                $perPage = $request->input('perPage', 5);
                $page = $request->input('page', 1);
                $column = $request->input('column', 'id');
                $direction = $request->input('direction', 'asc');

                $projects = Project::orderBy($column, $direction)
                    ->paginate($perPage, ['*'], 'page', $page);

                Log::info("Controller::ProjectsController::SortedProjects::END");
                return response()->json($projects);
            } catch (\Exception $ex) {
                Log::error("Error in ProjectsController::getSortedProjects: " . $ex->getMessage());
                return response()->json(['error' => 'An error occurred while fetching projects'], 500);
            }
        });
        return $result;
    }

    /** 
     * @author : UDAY SONI
     * Method name: softDelete
     * Soft Delete a project for specified resource from storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function softDelete(Request $request, $id)
    {
        Log::info("Controller::ProjectsController::softDelete::START");
        $result = DB::transaction(function () use ($request, $id) {
            try {
                $permission = $request->header('permission');
                if ($permission == null || $permission == '') {
                    Log::info("Controller::ProjectsController::softDelete::");
                    return response()->json(['error' => 'permission Unauthorized'], 500);
                }

                $user = auth()->user();
                if ($user == null || $user == '') {
                    Log::info("Controller::ProjectsController::softDelete::");
                    return response()->json(['error' => 'Unauthorized'], 401);
                }

                //$userRole = UserRole::where('user_id', $user['id'])->first();
                $userRole = UserRole::where('user_id', $user->id)->first();

                $rolePermissions = Permission::whereIn('id', function ($query) use ($userRole) {
                    $query->select('permission_id')
                        ->from('role_has_permissions')
                        ->where('role_id', $userRole->role_id);
                })->get();

                $hasPermission = $rolePermissions->contains('name', $permission);

                if (!$hasPermission) {
                    info('Unauthorized');
                }

                $matchedPermission = $rolePermissions->firstWhere('name', $permission);
                info('User has permission: ' . $matchedPermission->name);

                $project = Project::find($id);

                $project->delete();
                Log::info("Controller::ProjectsController::softDelete::END");
                return response()->json(['message' => 'Project soft deleted successfully', 'project' => $project]);
            } catch (\Exception $ex) {
                Log::error("Error in ProjectsController::softDelete: " . $ex->getMessage());
                return response()->json(['error' => 'An error occurred while softDelete projects'], 500);
            }
        });
        return $result;
    }

    /** 
     * @author : UDAY SONI
     * Method name: softDeletedProjects
     * Fetch all projects, including soft-deleted ones for specified resource from storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function softDeletedProjects(Request $request)
    {
        Log::info("Controller::ProjectsController::softDeletedProjects::START");
        $result = DB::transaction(function () use ($request) {
            try {
                $projects = Project::onlyTrashed()->get();
                Log::info("Controller::ProjectsController::softDeletedProjects::END");
                return response()->json($projects);
                // $permission = $request->header('permission');
                // $user = auth()->user();

                // $userRole = UserRole::where('user_id', $user->id)->first();

                // $rolePermissions = Permission::whereIn('id', function ($query) use ($userRole) {
                //     $query->select('permission_id')
                //         ->from('role_has_permissions')
                //         ->where('role_id', $userRole->role_id);
                // })->get();

                // $hasPermission = $rolePermissions->contains('name', $permission);

                // if (!$hasPermission) {
                //     info('Unauthorized');
                // }

                // $matchedPermission = $rolePermissions->firstWhere('name', $permission);
                // info('user has permission: ' . $matchedPermission->name);



            } catch (\Exception $ex) {

                Log::error("Error in retrieving soft-deleted projects: " . $ex->getMessage());

                return response()->json(['error' => 'An error occurred while retrieving soft-deleted projects'], 500);
            }
        });
        return $result;
    }

    /** 
     * @author : UDAY SONI
     * Method name: restore
     * Restore a soft-deleted project for specified resource from storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function restore(Request $request, $id)
    {
        Log::info("Controller::ProjectsController::restore::START");
        $result = DB::transaction(function () use ($id, $request) {
            try {
                $project = Project::withTrashed()->find($id);
                $project->restore();
                if (!$project) {
                    return response()->json(['message' => 'Project not found or already restored'], 404);
                }
                $project->restore();
                // $permission = $request->header('permission');
                // $user = auth()->user();

                // $userRole = UserRole::where('user_id', $user->id)->first();

                // $rolePermissions = Permission::whereIn('id', function ($query) use ($userRole) {
                //     $query->select('permission_id')
                //         ->from('role_has_permissions')
                //         ->where('role_id', $userRole->role_id);
                // })->get();

                // $hasPermission = $rolePermissions->contains('name', $permission);

                // if (!$hasPermission) {
                //     info('Unauthorized');
                // }

                // $matchedPermission = $rolePermissions->firstWhere('name', $permission);
                // info('user has permission: ' . $matchedPermission->name);


                Log::info("Controller::ProjectsController::restore::END");
                return response()->json(['message' => 'Project restored successfully'], 200);
            } catch (\Exception $ex) {

                Log::error("Error in restoring project: " . $ex->getMessage());

                return response()->json(['error' => 'An error occurred during project restoration'], 500);
            }
        });
        return $result;
    }
}
