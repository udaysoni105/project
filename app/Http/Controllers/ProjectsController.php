<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
// use Illuminate\Validation\Validator;
use Laracasts\Flash\Flash;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;

class ProjectsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $projects = Project::all();

        return response()->json($projects);
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

        //  Create a new project
        $project = Project::create($request->all());


        // Display flash message
        Flash::success('Project created successfully');

        return redirect()->route('projects.index');

        // $project = Project::create($request->all());

        // return response()->json($project, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $project = Project::findOrFail($id);

        return response()->json($project);
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

        // Update the project
        $project = Project::findOrFail($id);
        $project->update($request->all());

        // Display flash message
        Flash::success('Project updated successfully');

        return redirect()->route('projects.index');

        // $project = Project::findOrFail($id);
        // $project->update($request->all());

        // return response()->json($project, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        // Perform the soft delete logic here, using the $id parameter
        // Example:
        $project = Project::find($id);
        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }

        // Display flash message
        //     Flash::success('Project deleted successfully');

        // Perform the soft delete
        $project->delete();

        // Optionally, return a success response or any additional data
        return response()->json(['message' => 'Project soft deleted successfully']);
    }


    // public function activate($id)
    // {
    //     // Activate the project
    //     $project = Project::onlyTrashed()->findOrFail($id);
    //     $project->restore();

    //     // Display flash message
    //     Flash::success('Project activated successfully');

    //     return redirect()->route('projects.index');
    // }

    // public function deactivate($id)
    // {
    //     // Deactivate the project
    //     $project = Project::findOrFail($id);
    //     $project->delete();

    //     // Display flash message
    //     Flash::success('Project deactivated successfully');

    //     return redirect()->route('projects.index');
    // }

    // In your Laravel controller method
    public function searchProjects(Request $request)
    {
        $searchQuery = $request->input('searchQuery');

        $projects = Project::where('name', 'LIKE', "%$searchQuery%")
            ->orWhere('description', 'LIKE', "%$searchQuery%")
            ->paginate(5);

        return response()->json($projects);
    }
    // In your Laravel controller method
    public function getProjects(Request $request)
    {
        $perPage = $request->input('perPage', 5);

        $projects = Project::paginate($perPage);

        return response()->json($projects);
    }
    // In your Laravel controller method
    public function getSortedProjects(Request $request)
    {
        $column = $request->input('column', 'id');
        $direction = $request->input('direction', 'asc');

        $projects = Project::orderBy($column, $direction)
            ->paginate(5);

        return response()->json($projects);
    }
}
