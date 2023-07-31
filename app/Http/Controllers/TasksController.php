<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\UserRole;
use Spatie\Permission\Models\Permission;
use \Spatie\Permission\Models\Role;
use Laracasts\Flash\Flash;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use PDF;

class TasksController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $permission = $request->header('permission');
        info($permission);
        $user = auth()->user();
        info($user['id']);

        $userRole = UserRole::where('user_id', $user->id)->first();

        info("user role id : " . $userRole);

        $rolePermissions = Permission::whereIn('id', function ($query) use ($userRole) {
            $query->select('permission_id')
                ->from('role_has_permissions')
                ->where('role_id', $userRole->role_id);
        })->get();
        info(" role permission : " . $rolePermissions);

        $hasPermission = $rolePermissions->contains('name', $permission);

        if (!$hasPermission) {
            info('Unauthorized');
        }

        $matchedPermission = $rolePermissions->firstWhere('name', $permission);
        info('User has permission: ' . $matchedPermission->name);

                // Fetch all tasks with their associated project and assigned user
                // $tasks = Task::with('project', 'user')->get();

                // return response()->json(['tasks' => $tasks]);

        $tasks = Task::all();

        return response()->json($tasks);
        // $tasks = Task::with('users')->get();

        // return response()->json($tasks);

        // $tasks = Task::join('users', 'tasks.user_id', '=', 'users.id')
        // ->select('tasks.*', 'users.Name as uName', 'users.id as userid')
        // ->get();
    
        // return response()->json($tasks);
    //     $query = Task::join('user_task', 'tasks.id', '=', 'user_task.task_id')
    //     ->join('users', 'user_task.user_id', '=', 'users.id')
    //     ->select('tasks.*', 'users.Name as uName', 'users.id as userid');
    
    // $tasks = $query->get();
    // return response()->json($tasks);
    
    
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // You can implement this method if needed for your frontend
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $permission = $request->header('permission');
        info($permission);
        $user = auth()->user();
        info($user['id']);

        //$userRole = UserRole::where('user_id', $user['id'])->first();
        $userRole = UserRole::where('user_id', $user->id)->first();

        info("user role id : " . $userRole);

        $rolePermissions = Permission::whereIn('id', function ($query) use ($userRole) {
            $query->select('permission_id')
                ->from('role_has_permissions')
                ->where('role_id', $userRole->role_id);
        })->get();
        info(" role permission : " . $rolePermissions);

        $hasPermission = $rolePermissions->contains('name', $permission);

        if (!$hasPermission) {
            info('Unauthorized');
        }

        $matchedPermission = $rolePermissions->firstWhere('name', $permission);
        info('User has permission: ' . $matchedPermission->name);

        //  Validate the request data
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'description' => 'required',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);
        info("task registration start");
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        // $task = Task::create($request->all());
        // return response()->json($task, 201);

            // $tasks = Task::with('users')->get();
    // return response()->json($tasks);

        // Create a new task
        $task = Task::create($request->all());

        return response()->json(['message' => 'Task created successfully', 'task' => $task]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $task = Task::findOrFail($id);

        return response()->json($task);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        // You can implement this method if needed for your frontend
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id, Task $Task)
    {
        $permission = $request->header('permission');
        info($permission);
        $user = auth()->user();
        info($user['id']);

        $userRole = UserRole::where('user_id', $user->id)->first();

        info("user role id : " . $userRole);

        $rolePermissions = Permission::whereIn('id', function ($query) use ($userRole) {
            $query->select('permission_id')
                ->from('role_has_permissions')
                ->where('role_id', $userRole->role_id);
        })->get();
        info(" role permission : " . $rolePermissions);

        $hasPermission = $rolePermissions->contains('name', $permission);

        if (!$hasPermission) {
            info('Unauthorized');
        }

        $matchedPermission = $rolePermissions->firstWhere('name', $permission);
        info('User has permission: ' . $matchedPermission->name);


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

        // $Task = Task::findOrFail($id);
        // $Task->update($request->all());

        $task = Task::findOrFail($id);
$task->update($request->all());


        return response()->json(['message' => 'Task updated successfully', 'Task' => $Task]);

        // Update the task
        // $task = Task::findOrFail($id);
        // $task->update($request->all());

        // return response()->json(['message' => 'Task updated successfully', 'task' => $task]);

        // return response()->json($task, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, $id)
    {
        $permission = $request->header('permission');
        info($permission);
        $user = auth()->user();
        info($user['id']);

        //$userRole = UserRole::where('user_id', $user['id'])->first();
        $userRole = UserRole::where('user_id', $user->id)->first();

        info("user role id : " . $userRole);

        $rolePermissions = Permission::whereIn('id', function ($query) use ($userRole) {
            $query->select('permission_id')
                ->from('role_has_permissions')
                ->where('role_id', $userRole->role_id);
        })->get();
        info(" role permission : " . $rolePermissions);

        $hasPermission = $rolePermissions->contains('name', $permission);

        if (!$hasPermission) {
            info('Unauthorized');
        }

        $matchedPermission = $rolePermissions->firstWhere('name', $permission);
        info('User has permission: ' . $matchedPermission->name);


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

        // Return a success response
        return response()->json(['message' => 'Task deleted successfully']);
    }

    public function search(Request $request)
    {
        $searchQuery = $request->input('q');
        $tasks = Task::where('title', 'like', "%$searchQuery%")->get();
        return response()->json($tasks);
    }

    public function sorted(Request $request)
    {
        $column = $request->input('column');
        $direction = $request->input('direction', 'asc'); // Default to ascending order if not specified

        $tasks = Task::orderBy($column, $direction)->get();
        return response()->json($tasks);
    }

    // In your paginate  task controller method
    public function getTasks(Request $request)
    {
        $tasks = Task::paginate(5); // Adjust the pagination limit as needed
        return response()->json($tasks);
    }

    public function generatePDF($id)
    {
        // Code to generate and download the PDF based on the $id parameter
        // Example: 
        $task = Task::find($id); // Assuming you have a Task model
        $pdf = PDF::loadView('pdf_view', compact('task'));

        return $pdf->download('task_' . $id . '.pdf');
    }
    public function assignTaskToDeveloper(Request $request, Task $task)
    {
        // Check if the user has project manager role
        if (!auth()->user()->hasRole('project_manager')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Validate the request data (e.g., the selected developer ID)
        $request->validate([
            'developer_id' => 'required|exists:users,id',
        ]);

        // Assign the task to the selected developer
        $task->developer_id = $request->input('developer_id');
        $task->save();

        return response()->json(['message' => 'Task assigned successfully']);
    }
    public function updateStatus(Request $request, $taskId)
    {
        $user = Auth::user();
    
        // Find the task by ID
        $task = Task::findOrFail($taskId);
    
        // Get the new status from the request
        $newStatus = $request->input('status');
    
        // Update the task status
        $task->status = $newStatus;
        $task->save();
    
        // Return a success response
        return response()->json(['message' => 'Task status updated successfully'], 200);
    }
    
}
