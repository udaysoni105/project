<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProjectsController;
use App\Http\Controllers\TasksController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

info("Route");
Route::get('/states/{country}', [RegistrationController::class, 'getStates']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group(['middleware' => 'auth'], function ($router) {
Route::get('/users', [UserController::class, 'index']);
Route::post('/users', [UserController::class, 'store']);
Route::put('/users/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);
});

Route::post('/me', [AuthController::class, 'me']);
Route::post('/refresh', [AuthController::class, 'refresh']);
Route::post('/register', [AuthController::class, 'register']);


Route::group(['middleware' => 'api'], function ($router) {
    Route::match(['get', 'post'], '/login', [AuthController::class, 'login'])->name('login');
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/resetpassword', [ResetPasswordController::class, 'resetPassword']);
    Route::get('/profile', [AuthController::class, 'profile']);
});



Route::group(['middleware' => 'auth'], function ($router) {
    // Additional routes for searching, sorting, and pagination
    // Route::get('/projects', [ProjectsController::class, 'getProjects'])->name('projects.searchProjects');
    Route::get('/projects/search', [ProjectsController::class, 'searchProjects'])->name('projects.searchProjects');
    Route::get('/projects/sorted', [ProjectsController::class, 'getSortedProjects'])->name('projects.getSortedProjects');

    Route::put('/projects/{id}', [ProjectsController::class, 'update'])->name('projects.update');
    Route::get('/projects', [ProjectsController::class, 'index'])->name('projects.index');
    Route::get('/projects/{id}', [ProjectsController::class, 'show'])->name('projects.show');
    Route::delete('/projects/{id}', [ProjectsController::class, 'destroy'])->name('projects.destroy');
    Route::post('/projects', [ProjectsController::class,'store'])->name('projects.store');

});

Route::group(['middleware' => 'auth'], function ($router) {
        // Additional routes for searching, sorting, and pagination
    // Route::get('/tasks', [TasksController::class, 'index'])->name('tasks.index');//pagination
    Route::get('/tasks/search', [TasksController::class, 'search'])->name('tasks.search');
    Route::get('/tasks/sorted', [TasksController::class, 'sorted'])->name('tasks.sorted');

    Route::get('/tasks', [TasksController::class, 'index'])->name('tasks.index');
    Route::get('/tasks/{id}', [TasksController::class, 'show'])->name('tasks.show');
    Route::post('/tasks', [TasksController::class, 'store'])->name('tasks.store');
    Route::put('/tasks/{id}', [TasksController::class, 'update'])->name('tasks.update');
    Route::delete('/tasks/{id}', [TasksController::class, 'destroy'])->name('tasks.destroy');
});


// Routes for admin
// Route::middleware(['auth', 'auth:add_project,edit_project,softDelete_project'])->group(function () {
//     Route::post('/projects', [ProjectController::class, 'store']);
//     Route::put('/projects/{id}', [ProjectController::class, 'update']);
//     Route::delete('/projects/{id}', [ProjectController::class, 'destroy']);
// });

// // Routes for project manager
// Route::middleware(['auth', 'auth:project_manager,edit_project,view_project'])->group(function () {
//     Route::put('/projects/{id}', [ProjectController::class, 'update']);
// });

// // Routes for developer
// Route::middleware(['auth', 'auth:developer,view_project'])->group(function () {
//     // Developers only have access to view projects
//     // They cannot add, edit, or delete projects
// });


// Routes for admin
// Route::middleware(['auth', 'auth:admin,add_task'])->group(function () {
//     Route::post('/tasks', [TasksController::class, 'store']);
//     Route::put('/tasks/{id}', [TasksController::class, 'update']);
//     Route::delete('/tasks/{id}', [TasksController::class, 'destroy']);
// });

// Routes for project manager
// Route::middleware(['auth', 'auth:project_manager,edit_task'])->group(function () {
//     Route::put('/tasks/{id}', [TasksController::class, 'update']);
// });

// Routes for developer
// Route::middleware(['auth', 'auth:developer,view_task'])->group(function () {
    // Developers only have access to view tasks
    // They cannot add, edit, or delete tasks
// });
