<?php


namespace App\Http\Controllers;

use App\Models\User;

use App\Models\UserRole;
use Spatie\Permission\Models\Permission;
use \Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Auth;
use App\Models\Project;
use Illuminate\Http\Request;

use Laracasts\Flash\Flash;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;

class ProjectsController extends Controller
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

        $projects = Project::all();

        return response()->json($projects);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // You can implement this method if needed for your frontend
        // $project = Project::create($request->all());

        // return response()->json($project, 201);
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
        info("project registration start");
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        //  Create a new project
        $project = Project::create($request->all());


        // Display flash message
        Flash::success('Project created successfully');

        return redirect()->route('projects.index');
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
    public function update(Request $request, $id)
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
        $project = Project::findOrFail($id);
        $project->update($request->all());

        return response()->json(['message' => 'project updated successfully', 'project' => $project]);

        // Update the project
        // $project = Project::findOrFail($id);
        // $project->update($request->all());

        // Display flash message
        // Flash::success('Project updated successfully');

        // return redirect()->route('projects.index');
        // return response()->json($project, 200);
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

    // In your ProjectsController method
    public function searchProjects(Request $request)
    {
        $searchQuery = $request->input('searchQuery');

        $projects = Project::where('name', 'LIKE', "%$searchQuery%")
            ->orWhere('description', 'LIKE', "%$searchQuery%")
            ->paginate(5);

        return response()->json($projects);
    }

    // In your ProjectsController method
    public function getProjects(Request $request)
    {
        $perPage = $request->input('perPage', 5);

        $projects = Project::paginate($perPage);

        return response()->json($projects);
    }

    // In your ProjectsController method
    public function getSortedProjects(Request $request)
    {
        $column = $request->input('column', 'id');
        $direction = $request->input('direction', 'asc');

        $projects = Project::orderBy($column, $direction)
            ->paginate(5);

        return response()->json($projects);
    }

    // // Soft Delete a project
    public function softDelete($id)
    {
        $project = Project::find($id);
        $project->delete();
        return response()->json(['message' => 'Project soft deleted successfully', 'project' => $project]);
    }

    // Restore a soft-deleted project
    public function restore($id)
    {
        $project = Project::withTrashed()->find($id);

        if (!$project) {
            return response()->json(['message' => 'Project not found or already restored'], 404);
        }

        $project->restore();

        return response()->json(['message' => 'Project restored successfully'], 200);
    }

    // Fetch all projects, including soft-deleted ones
    public function softDeletedProjects()
    {
        $projects = Project::withTrashed()->get();
        return response()->json($projects);
    }
}
