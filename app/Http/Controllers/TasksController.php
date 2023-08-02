<?php

namespace App\Http\Controllers;

use PDF;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\UserRole;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\ModelNotFoundException;

/** @author UDAY SONI
 *
 * Class name: TasksController
 * Create a new controller for doing operation on Task module.
 *
 */
class TasksController extends Controller
{
    /** 
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
                Log::info("Controller::TasksController::index::START");
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

                // Check if the user is an admin or a project manager
                $isAdmin = $user->hasRole('Admin');
                $isProjectManager = $user->hasRole('projectManager');

                if ($isAdmin || $isProjectManager) {
                    // If the user is an admin or project manager, fetch all tasks
                    $tasks = Task::all();
                } else {
                    // If the user is a developer, fetch only assigned tasks
                    $tasks = Task::with('Project', 'User')->where('user_id', $user->id)->get();
                }

                Log::info("Controller::TasksController::index::END");
                // Return the tasks as JSON response
                return response()->json($tasks);
            } catch (\Exception $ex) {
                // Log the exception if needed
                Log::error("Error in retrieving tasks: " . $ex->getMessage());

                // Return an error response
                return response()->json(['error' => 'An error occurred while retrieving tasks'], 500);
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
                Log::info("Controller::TasksController::store::START");
                $permission = $request->header('permission');
                $user = auth()->user();

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
                info('user has permission: ' . $matchedPermission->name);

                //  Validate the request data
                $validator = Validator::make($request->all(), [
                    'name' => 'required',
                    'description' => 'required',
                    'start_date' => 'required|date',
                    'end_date' => 'required|date|after:start_date',
                ]);
                if ($validator->fails()) {
                    return response()->json(['errors' => $validator->errors()], 400);
                }

                // Create a new task
                $task = Task::create($request->all());
                Log::info("Controller::TasksController::store::END");
                return response()->json(['message' => 'Task created successfully', 'task' => $task]);
            } catch (\Exception $ex) {
                // Log the exception if needed
                Log::error("Error in creating task: " . $ex->getMessage());

                // Return an error response
                return response()->json(['error' => 'An error occurred while creating the task'], 500);
            }
        });

        return $result;
    }

    /** 
     * @author : UDAY SONI
     * Method name: show
     * show the specified resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function show(string $id)
    {
        $result = DB::transaction(function () use ($id) {
            try {
                Log::info("Controller::TasksController::show::START");
                $task = Task::findOrFail($id);
                Log::info("Controller::TasksController::show::END");
                return response()->json($task);
            } catch (\Exception $ex) {
                // Log the exception if needed
                Log::error("Error in fetching task: " . $ex->getMessage());

                // Return an error response
                return response()->json(['error' => 'Task not found'], 404);
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
    public function update(Request $request, string $id, Task $task)
    {
        $result = DB::transaction(function () use ($request, $id, $task) {
            try {
                Log::info("Controller::TasksController::update::START");
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

                // Validate the request data
                $validator = Validator::make($request->all(), [
                    'name' => 'required',
                    'description' => 'required',
                    'start_date' => 'required|date',
                    'end_date' => 'required|date|after:start_date',
                ]);

                if ($validator->fails()) {
                    return response()->json(['errors' => $validator->errors()], 400);
                }
                // Update the task
                $task = Task::findOrFail($id);
                $task->update($request->all());

                Log::info("Controller::TasksController::update::END");
                return response()->json(['message' => 'Task updated successfully', 'Task' => $task]);
            } catch (\Exception $ex) {
                // Log the exception if needed
                Log::error("Error in updating task: " . $ex->getMessage());

                // Return an error response
                return response()->json(['error' => 'Task not found or unable to update'], 404);
            }
        });

        return $result;
    }

    /** 
     * @author : UDAY SONI
     * Method name: destroy
     * Remove the specified resource from storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
        $result = DB::transaction(function () use ($request, $id) {
            try {
                Log::info("Controller::TasksController::destroy::START");
                $permission = $request->header('permission');
                $user = auth()->user();

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
                info('user has permission: ' . $matchedPermission->name);


                // Perform the soft delete logic here, using the $id parameter
                $task = Task::find($id);
                if (!$task) {
                    return response()->json(['message' => 'Task not found'], 404);
                }

                // Find the task with the given id
                $task = Task::find($id);

                // Check if the task exists
                if (!$task) {
                    return response()->json(['error' => 'Task not found'], 404);
                }

                // Perform the hard delete
                $task->forceDelete();

                Log::info("Controller::TasksController::destroy::END");
                // Return a success response
                return response()->json(['message' => 'Task deleted successfully']);
            } catch (\Exception $ex) {
                // Log the exception if needed
                Log::error("Error in deleting task: " . $ex->getMessage());

                // Return an error response
                return response()->json(['error' => 'Unable to delete task'], 500);
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
                Log::info("Controller::TasksController::search::START");
                $searchQuery = $request->input('q');
                $tasks = Task::where('title', 'like', "%$searchQuery%")->get();
                Log::info("Controller::TasksController::search::END");
                return response()->json($tasks);
            } catch (\Exception $ex) {
                // Log the exception if needed
                Log::error("Error in searching tasks: " . $ex->getMessage());

                // Return an error response
                return response()->json(['error' => 'Unable to perform search'], 500);
            }
        });

        return $result;
    }

    /** 
     * @author : UDAY SONI
     * Method name: sorted
     * sorted the specified resource from storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function sorted(Request $request)
    {
        $result = DB::transaction(function () use ($request) {
            try {
                Log::info("Controller::TasksController::sorted::START");
                $column = $request->input('column');
                $direction = $request->input('direction', 'asc'); // Default to ascending order if not specified

                $tasks = Task::orderBy($column, $direction)->get();
                Log::info("Controller::TasksController::sorted::END");
                return response()->json($tasks);
            } catch (\Exception $ex) {
                // Log the exception if needed
                Log::error("Error in sorting tasks: " . $ex->getMessage());

                // Return an error response
                return response()->json(['error' => 'Unable to perform sorting'], 500);
            }
        });

        return $result;
    }

    /** 
     * @author : UDAY SONI
     * Method name: getTasks
     * paginate the specified resource from storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function getTasks(Request $request)
    {
        $result = DB::transaction(function () use ($request) {
            try {
                Log::info("Controller::TasksController::getTasks::START");
                $tasks = Task::paginate(5); // Adjust the pagination limit as needed
                Log::info("Controller::TasksController::getTasks::END");
                return response()->json($tasks);
            } catch (\Exception $ex) {
                // Log the exception if needed
                Log::error("Error in getting tasks: " . $ex->getMessage());

                // Return an error response
                return response()->json(['error' => 'Unable to fetch tasks'], 500);
            }
        });

        return $result;
    }

    /** 
     * @author : UDAY SONI
     * Method name: generatePDF
     * generatePDF the tasks in taskcontroller method.
     *
     * @return \Illuminate\Http\Response
     */
    public function generatePDF($id)
    {
        $result = DB::transaction(function () use ($id) {
            try {
                Log::info("Controller::TasksController::generatePDF::START");
                // Code to generate and download the PDF based on the $id parameter
                $task = Task::find($id); // Assuming you have a Task model
                if (!$task) {
                    return response()->json(['error' => 'Task not found'], 404);
                }

                $pdf = PDF::loadView('pdf_view', compact('task'));
                Log::info("Controller::TasksController::generatePDF::END");
                return $pdf->download('task_' . $id . '.pdf');
            } catch (\Exception $ex) {
                // Log the exception if needed
                Log::error("Error in generating PDF for task $id: " . $ex->getMessage());

                // Return an error response
                return response()->json(['error' => 'Unable to generate PDF'], 500);
            }
        });

        return $result;
    }

    // /** 
    //  * @author : UDAY SONI
    //  * Method name: assignTaskToDeveloper
    //  * assignTaskToDeveloper the tasks in user.
    //  *
    //  * @return \Illuminate\Http\Response
    //  */
    // public function assignTaskToDeveloper(Request $request, Task $task)
    // {
    //     // Check if the user has project manager role
    //     if (!auth()->user()->hasRole('project_manager')) {
    //         return response()->json(['message' => 'Unauthorized'], 403);
    //     }

    //     // Validate the request data (e.g., the selected developer ID)
    //     $request->validate([
    //         'developer_id' => 'required|exists:users,id',
    //     ]);

    //     // Assign the task to the selected developer
    //     $task->developer_id = $request->input('developer_id');
    //     $task->save();

    //     return response()->json(['message' => 'Task assigned successfully']);
    // }
}
