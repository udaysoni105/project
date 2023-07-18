<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;


class TasksController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
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
        // $task = Task::findOrFail($id);
        // $task->update($request->all());

        // return response()->json($task, 200);

        // Validate the request data
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'description' => 'required',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'status'=> 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        // Update the task
        $task = Task::findOrFail($id);
        $task->update($request->all());

        return response()->json(['message' => 'Task updated successfully', 'task' => $task]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {


        // // Get the authenticated user
        // $user = Auth::user();

        // // Check if the user is a developer
        // if ($user->role !== 'developer') {
        //     return response()->json(['error' => 'Unauthorized'], 401);
        // }

        // // Validate the request data
        // $validator = Validator::make($request->all(), [
        //     'is_completed' => 'required|boolean',
        // ]);

        // if ($validator->fails()) {
        //     return response()->json(['errors' => $validator->errors()], 400);
        // }

        // Update the task completion status
        $task = Task::findOrFail($id);
        $task->forceDelete();
        // $task->is_completed = $request->is_completed;
        $task->save();

        return response()->json(['message' => 'Task updated successfully']);

        // Task::findOrFail($id)->delete();

        // return response()->json(null, 204);
    }

    // public function makeHttpRequest()
    // {
    //     $response = Http::withHeaders([
    //         'Content-Type' => 'application/json',
    //         'Authorization' => 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJod…Y3In0.IFUx35tPfvwyQ7LrYRZEfcdA-AzGPt1ldL-ujgxvZjA',
    //         'Permission' => 'task-edit',
    //     ])->get('http://127.0.0.1:8000/api/tasks');

    //     {
    //         $response = Http::get('http://127.0.0.1:8000/api/tasks');

    //         $statusCode = $response->getStatusCode();
    //         $contentType = $response->header('Content-Type');
    //         $body = $response->body();
    //     }
    // }
}
