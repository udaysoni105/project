<?php

namespace App\Http\Controllers;

use PDF;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\UserRole;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Models\Project;
use Carbon\Carbon;

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
        Log::info("Controller::TasksController::index::START");
        $result = DB::transaction(function () use ($request) {
            try {
                $permission = $request->header('permission');
                if ($permission == null || $permission == '') {
                    Log::info("Controller::TasksController::destroy::");
                    return response()->json(['error' => 'permission Unauthorized'], 500);
                }

                $user = auth()->user();
                if ($user == null || $user == '') {
                    Log::info("Controller::TasksController::index::");
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

                if ($user->hasRole('Admin') || $user->hasRole('projectManager')) {
                    // If the user is an admin or project manager, fetch all tasks with project names
                    $tasks = Task::join('projects', 'tasks.project_id', '=', 'projects.id')
                        ->select('tasks.*', 'projects.name as projectName')
                        ->get();
                } else {
                    // If the user is a developer, fetch only assigned tasks with project names
                    $tasks = $user->tasks() //  'tasks' relationship in your User model
                        ->with(['project']) // 'project' relationship defined in your Task model
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
        Log::info("Controller::TasksController::store::START");
        $result = DB::transaction(function () use ($request) {
            try {
                $input = $request->all();
                if ($input == null || $input == '') {
                    Log::info("Controller::TasksController::index::");
                    return response()->json(['error' => 'Unauthorized'], 401);
                }

                $permission = $request->header('permission');
                if ($permission == null || $permission == '') {
                    Log::info("Controller::TasksController::store::");
                    return response()->json(['error' => 'permission Unauthorized'], 500);
                }

                $user = auth()->user();
                if ($user == null || $user == '') {
                    Log::info("Controller::TasksController::store::");
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

                $input = $request->all();

                $task = Task::create([
                    'name' => $input['name'],
                    'description' => $input['description'],
                    'start_date' => $input['start_date'],
                    'end_date' => $input['end_date'],
                    'project_id' => $input['project_id'],
                ]);

                $task->users()->sync($input['user_id']);

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
     * Method name: getTasksByProjectId
     * show the specified resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function getTasksByProjectId(Request $request, $projectId)
    {
        Log::info("Controller::TasksController::getTasksByProjectId::START");
        $input = $request->all();
        info($input);
        // Fetch the project with associated tasks
        $project = Project::with('tasks')->find($projectId);

        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }

        // Extract the start_date and end_date from the project
        $start_date = $project->start_date;
        $end_date = $project->end_date;

        Log::info("Controller::TasksController::getTasksByProjectId::END");

        // Return the tasks and project details as a JSON response
        return response()->json(['project' => $project, 'start_date' => $start_date, 'end_date' => $end_date]);
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
        Log::info("Controller::TasksController::show::START");
        $result = DB::transaction(function () use ($request, $id) {
            try {
                $permission = $request->header('permission');
                if ($permission == null || $permission == '') {
                    Log::info("Controller::TasksController::show::");
                    return response()->json(['error' => 'permission Unauthorized'], 500);
                }

                $user = auth()->user();
                if ($user == null || $user == '') {
                    Log::info("Controller::TasksController::show::");
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

                $task = Task::with('users')->findOrFail($id);
                //info($task);                
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
        Log::info("Controller::TasksController::update::START");
        $result = DB::transaction(function () use ($request, $id, $task) {
            try {
                $input = $request->all();
                if ($input == null || $input == '') {
                    Log::info("Controller::TasksController::index::");
                    return response()->json(['error' => 'Unauthorized'], 401);
                }

                $permission = $request->header('permission');
                if ($permission == null || $permission == '') {
                    Log::info("Controller::TasksController::update::");
                    return response()->json(['error' => 'permission Unauthorized'], 500);
                }

                $user = auth()->user();
                if ($user == null || $user == '') {
                    Log::info("Controller::TasksController::update::");
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

                // Validate the request data
                $validator = Validator::make($request->all(), [
                    'name' => '',
                    'start_date' => 'required|date',
                    'end_date' => 'required|date|after:start_date',
                    'user_id' => 'required|array',
                ]);

                if ($validator->fails()) {
                    return response()->json(['errors' => $validator->errors()], 400);
                }

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
        Log::info("Controller::TasksController::updatetask::START");
        $result = DB::transaction(function () use ($request, $id) {
            try {
                $input = $request->all();
                if ($input == null || $input == '') {
                    Log::info("Controller::TasksController::index::");
                    return response()->json(['error' => 'Unauthorized'], 401);
                }
                // Fetch the task by its ID
                $permission = $request->header('permission');
                if ($permission == null || $permission == '') {
                    Log::info("Controller::TasksController::updatetask::");
                    return response()->json(['error' => 'permission Unauthorized'], 500);
                }

                $user = auth()->user();
                if ($user == null || $user == '') {
                    Log::info("Controller::TasksController::updatetask::");
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
        Log::info("Controller::TasksController::destroy::START");
        $result = DB::transaction(function () use ($request, $id) {
            try {
                $permission = $request->header('permission');
                if ($permission == null || $permission == '') {
                    Log::info("Controller::TasksController::destroy::");
                    return response()->json(['error' => 'permission Unauthorized'], 500);
                }

                $user = auth()->user();
                if ($user == null || $user == '') {
                    Log::info("Controller::TasksController::destroy::");
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
        Log::info("Controller::TasksController::search::START");
        $result = DB::transaction(function () use ($request) {
            try {
                $input = $request->all();
                if ($input == null || $input == '') {
                    Log::info("Controller::TasksController::index::");
                    return response()->json(['error' => 'Unauthorized'], 401);
                }
                $searchQuery = $request->input('searchQuery');

                $tasks = Task::where('id', 'LIKE', "%$searchQuery%")
                    ->orWhere('name', 'LIKE', "%$searchQuery%")
                    ->orWhere('description', 'LIKE', "%$searchQuery%")
                    ->orWhere('start_date', 'LIKE', "%$searchQuery%")
                    ->orWhere('end_date', 'LIKE', "%$searchQuery%")
                    // ->orWhere('project_id', 'LIKE', "%$searchQuery%")
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
        Log::info("Controller::TasksController::sorted::START");
        $result = DB::transaction(function () use ($request) {
            try {
                $input = $request->all();
                if ($input == null || $input == '') {
                    Log::info("Controller::TasksController::index::");
                    return response()->json(['error' => 'Unauthorized'], 401);
                }
                $perPage = $request->input('perPage', 5);
                $page = $request->input('page', 1);
                $column = $request->input('column', 'id');
                $direction = $request->input('direction', 'asc');

                $tasks = Task::orderBy($column, $direction)
                    ->paginate($perPage, ['*'], 'page', $page);
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
     * Method name: pagination
     * paginate the specified resource from storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function pagination(Request $request)
    {
        Log::info("Controller::TasksController::pagination::START");
        $result = DB::transaction(function () use ($request) {
            try {
                $input = $request->all();
                if ($input == null || $input == '') {
                    Log::info("Controller::TasksController::index::");
                    return response()->json(['error' => 'Unauthorized'], 401);
                }
                $perPage = $request->input('perPage', 5);
                $page = $request->input('page', 1);

                // Query your database for projects with pagination
                $tasks = Task::paginate($perPage, ['*'], 'page', $page);
                Log::info("Controller::TasksController::pagination::END");
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

    public function filterdate(Request $request)
    {
        Log::info("Controller::TasksController::filterdate::START");

        $input = $request->all();
        if ($input == null || $input == '') {
            Log::info("Controller::TasksController::index::");
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $start_dt = Carbon::parse($request->input('start_date'))->timezone('Asia/Kolkata');
        $toDay = $start_dt->format('d');
        $toMonth = $start_dt->format('m');
        $toYear = $start_dt->format('Y');

        $start_date = Carbon::createFromDate($toYear, $toMonth, $toDay, 'Asia/Kolkata')->startOfDay();

        $end_dt = Carbon::parse($request->input('end_date'))->timezone('Asia/Kolkata');
        $toDay = $end_dt->format('d');
        $toMonth = $end_dt->format('m');
        $toYear = $end_dt->format('Y');

        $end_date = Carbon::createFromDate($toYear, $toMonth, $toDay, 'Asia/Kolkata')->endOfDay();

        // Validate if both start_date and end_date are provided and in a valid date format
        if (!empty($start_date) && !empty($end_date) && strtotime($start_date) !== false && strtotime($end_date) !== false) {
            $tasks = Task::where(function ($query) use ($start_date, $end_date) {
                $query->whereBetween('start_date', [$start_date, $end_date]);
            })->get();
            Log::info("Controller::TasksController::filterdate::END");
            return response()->json($tasks);
        } else {
            return response()->json(['message' => 'Invalid date format or missing dates'], 400);
        }
    }



    /** 
     * @author : UDAY SONI
     * Method name: generatePDF
     * generatePDF the tasks in taskcontroller method.
     *
     * @return \Illuminate\Http\Response
     */
    public function generatePDF(Request $request, $id)
    {
        Log::info("Controller::TasksController::generatePDF::START");
        $result = DB::transaction(function () use ($id, $request) {
            try {
                $permission = $request->header('permission');
                if ($permission == null || $permission == '') {
                    Log::info("Controller::TasksController::generatePDF::");
                    return response()->json(['error' => 'permission Unauthorized'], 500);
                }

                $user = auth()->user();
                if ($user == null || $user == '') {
                    Log::info("Controller::TasksController::generatePDF::");
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

                $task = Task::find($id);
                if (!$task) {
                    return response()->json(['error' => 'Task not found'], 404);
                }

                // Load the view and generate the PDF
                $pdf = PDF::loadView('invoice', compact('task'));
                return $pdf->download($task['name'] . '.pdf');
                // return Response()->json($file);

                // $path = public_path('upload/'.$task['name'].'.pdf');
                // info($path);
                // $pdf = PDF::loadView('invoice', compact('task'))->setPaper('a4', 'portrait')->save($path);
                // // $serverUrl = config('env_data.SERVER_URL');
                // $file = 'upload/'.$task['name'].'.pdf';
                // $data['fileName'] = $file;
                // info($file);
                Log::info("Controller::TasksController::generatePDF::END");
                // // Download the PDF with a custom filename
                // // return $pdf->download($task['name'] . '.pdf');
                // return Response()->json($data);
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
