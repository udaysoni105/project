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
        info(" role permission : ".$rolePermissions);

        $hasPermission = $rolePermissions->contains('name', $permission);

        if (!$hasPermission) {
            info('Unauthorized');
        }

        $matchedPermission = $rolePermissions->firstWhere('name', $permission);
        info('User has permission: ' . $matchedPermission->name);

        $tasks = Task::all();

        return response()->json($tasks);
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
        info(" role permission : ".$rolePermissions);

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
    public function update(Request $request, string $id)
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
        info(" role permission : ".$rolePermissions);

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

        // Validate the request data
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'description' => 'required',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'status' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        // Update the task
        $task = Task::findOrFail($id);
        $task->update($request->all());

        return response()->json(['message' => 'Task updated successfully', 'task' => $task]);

        // return response()->json($task, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request,$id)
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
        info(" role permission : ".$rolePermissions);

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
}
