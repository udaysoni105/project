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

                if ($user->hasRole('Admin') || $user->hasRole('projectManager')) {
                    // If the user is an admin or project manager, fetch all tasks with project names
                    $tasks = Task::join('projects', 'tasks.project_id', '=', 'projects.id')
                        ->select('tasks.*', 'projects.name as projectName')
                        ->get();
                } else {
                    // If the user is a developer, fetch only assigned tasks with project names
                    $tasks = Task::with(['project', 'user'])
                        ->where('user_id', $user->id)
                        ->select('tasks.*', 'projects.name as projectName')
                        ->join('projects', 'tasks.project_id', '=', 'projects.id')
                        ->get();
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
                    'name' => 'required|string|max:255',
                    'description' => '',
                    'start_date' => 'required|date',
                    'end_date' => 'required|date|after:start_date',
                    'user_id' => 'required|array',
                ]);

                if ($validator->fails()) {
                    return response()->json(['errors' => $validator->errors()], 400);
                }

                // // Loop through user_id values and create a task for each user
                // foreach ($request->user_id as $userId) {
                //     $task = new Task($request->except('user_id'));
                //     $task->user_id = $userId;
                //     $task->save();
                // }

                foreach ($request->user_id as $userId) {
                    $task = new Task($request->except('user_id'));
                    $task->user_id = $userId;
                    $task->save();

                    // Add the task to the user_task table
                    DB::table('user_task')->insert([
                        'task_id' => $task->id,
                        'user_id' => $userId,
                    ]);
                }


                Log::info("Controller::TasksController::store::END");
                return response()->json(['message' => 'Tasks created successfully', 'task' => $task]);
            } catch (\Exception $ex) {
                // Log the exception if needed
                Log::error("Error in creating tasks: " . $ex->getMessage());

                // Return an error response
                return response()->json(['error' => 'An error occurred while creating the tasks'], 500);
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
    public function show(Request $request, string $id)
    {
        $result = DB::transaction(function () use ($request, $id) {
            try {
                Log::info("Controller::TasksController::show::START");
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
                    'name' => '',
                    'description' => '',
                    'start_date' => 'required|date',
                    'end_date' => 'required|date|after:start_date',
                    'user_id' => 'required|array',
                ]);

                if ($validator->fails()) {
                    return response()->json(['errors' => $validator->errors()], 400);
                }

                // //status changes
                // // Fetch the task by its ID
                // $task = Task::findOrFail($id);

                // // Update the task's information
                // $task->update($request->all());

                $task = Task::findOrFail($id);

                // Check if user IDs need to be updated
                if ($request->has('user_id')) {
                    $userIds = $request->user_id;
                    if (is_array($userIds)) {
                        $task->users()->sync($userIds);
                    }
                    $task->update($request->except('user_id'));
                } else {
                    $task->update($request->all());
                }

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
     * Method name: updatetask
     * status the specified resource from storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function updatetask($id, Request $request)
    {
        $result = DB::transaction(function () use ($request, $id) {
            try {
                Log::info("Controller::TasksController::updatetask::START");
                // Fetch the task by its ID
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

                $task = Task::findOrFail($id);

                // Update the task's information
                $task->update($request->all());

                Log::info("Controller::TasksController::updatetask::END");
                // Return a success response
                return response()->json(['message' => 'Task updated successfully']);
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
                $searchQuery = $request->input('searchQuery');

                $tasks = Task::where('name', 'LIKE', "%$searchQuery%")
                    ->orWhere('description', 'LIKE', "%$searchQuery%")
                    ->paginate(5);

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

                // Find the task based on the provided $id
                $task = Task::find($id);
                if (!$task) {
                    return response()->json(['error' => 'Task not found'], 404);
                }

                // Load the view and generate the PDF
                $pdf = PDF::loadView('invoice', compact('task'));

                // Log the successful PDF generation
                Log::info("PDF generated successfully for task $id");

                // Download the PDF with a custom filename
                return $pdf->download('task_' . $id . '.pdf');
                Log::info("Controller::TasksController::generatePDF::END");
            } catch (\Exception $ex) {
                // Log the exception if needed
                Log::error("Error in generating PDF for task $id: " . $ex->getMessage());

                // Alternatively, return an error JSON response
                return response()->json(['error' => 'Unable to generate PDF'], 500);
            }
        });

        return $result;
    }
}
