<?php


namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserRole;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Auth;

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
        $result = DB::transaction(function () use ($request) {
            try {
                Log::info("Controller::ProjectsController::index::START");
                $permission = $request->header('permission');
                $user = auth()->user();

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

    /** 
     * @author : UDAY SONI
     * Method name: store
     * Store a newly created resource in storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $result = DB::transaction(function () use ($request) {
            try {
                Log::info("Controller::ProjectsController::store::START");
                $permission = $request->header('permission');
                $user = auth()->user();

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
                    'description' => 'required',
                    'start_date' => 'required|date',
                    'end_date' => 'required|date|after:start_date',
                ]);
                if ($validator->fails()) {
                    return response()->json(['errors' => $validator->errors()], 400);
                }

                $project = Project::create($request->all());
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
     * Method name: show
     * Display the specified resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function show(string $id)
    {
        $result = DB::transaction(function () use ($id) {
            try {
                Log::info("Controller::ProjectsController::show::START");
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
        $result = DB::transaction(function () use ($request, $id) {
            try {
                Log::info("Controller::ProjectsController::update::START");
                $permission = $request->header('permission');
                $user = auth()->user();

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
                    'description' => 'required',
                    'start_date' => 'required|date',
                    'end_date' => 'required|date|after:start_date',
                ]);

                if ($validator->fails()) {
                    return response()->json(['errors' => $validator->errors()], 400);
                }
                $project = Project::findOrFail($id);
                $project->update($request->all());
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
     * Method name: destroy
     * Remove the specified resource from storage.
     * soft delete logic here, using the $id parameter
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
        $result = DB::transaction(function () use ($request, $id) {
            try {
                Log::info("Controller::ProjectsController::destroy::START");
                $permission = $request->header('permission');
                $user = auth()->user();

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

                $project = Project::find($id);
                if (!$project) {
                    return response()->json(['message' => 'Project not found'], 404);
                }

                $project->delete();
                Log::info("Controller::ProjectsController::destroy::END");

                return response()->json(['message' => 'Project soft deleted successfully']);
            } catch (\Exception $ex) {
                Log::error("Error in ProjectsController::destroy: " . $ex->getMessage());
                return response()->json(['error' => 'An error occurred while soft deleting the project'], 500);
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
        $result = DB::transaction(function () use ($request) {
            try {
                Log::info("Controller::ProjectsController::searchProjects::START");
                $searchQuery = $request->input('searchQuery');

                $projects = Project::where('name', 'LIKE', "%$searchQuery%")
                    ->orWhere('description', 'LIKE', "%$searchQuery%")
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
    public function getProjects(Request $request)
    {
        $result = DB::transaction(function () use ($request) {
            try {
                Log::info("Controller::ProjectsController::getProjects::START");
                $perPage = $request->input('perPage', 5);
                $projects = Project::paginate($perPage);
                Log::info("Controller::ProjectsController::getProjects::END");
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
     * Method name: getSortedProjects
     * getSortedProjects the specified resource from storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function getSortedProjects(Request $request)
    {
        $result = DB::transaction(function () use ($request) {
            try {
                Log::info("Controller::ProjectsController::getSortedProjects::START");
                $column = $request->input('column', 'id');
                $direction = $request->input('direction', 'asc');

                $projects = Project::orderBy($column, $direction)
                    ->paginate(5);
                Log::info("Controller::ProjectsController::getSortedProjects::END");
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
     * Method name: getSortedProjects
     * Soft Delete a project for specified resource from storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function softDelete($id)
    {
        $result = DB::transaction(function () use ($id) {
            try {
                Log::info("Controller::ProjectsController::softDelete::START");
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
     * Method name: getSortedProjects
     * Fetch all projects, including soft-deleted ones for specified resource from storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function softDeletedProjects(Request $request)
    {
        $result = DB::transaction(function () use ($request) {
            try {
                Log::info("Controller::ProjectsController::softDeletedProjects::START");
                $projects = Project::withTrashed()->get();
                $permission = $request->header('permission');
                $user = auth()->user();

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

                Log::info("Controller::ProjectsController::softDeletedProjects::END");
                return response()->json($projects);
            } catch (\Exception $ex) {

                Log::error("Error in retrieving soft-deleted projects: " . $ex->getMessage());

                return response()->json(['error' => 'An error occurred while retrieving soft-deleted projects'], 500);
            }
        });
        return $result;
    }

    /** 
     * @author : UDAY SONI
     * Method name: getSortedProjects
     * Restore a soft-deleted project for specified resource from storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function restore(Request $request, $id)
    {
        $result = DB::transaction(function () use ($id, $request) {
            try {
                Log::info("Controller::ProjectsController::restore::START");
                $project = Project::withTrashed()->find($id);

                if (!$project) {
                    return response()->json(['message' => 'Project not found or already restored'], 404);
                }
                $permission = $request->header('permission');
                $user = auth()->user();

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

                $project->restore();
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
