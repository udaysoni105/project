<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProjectsController;
use App\Http\Controllers\TasksController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VerificationController;
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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/verify_email', [VerificationController::class, 'verifyEmail'])->name('verify.email');

Route::get('/images', [AuthController::class,'imageUpload'])->name('images.upload'); 
Route::post('/store', [AuthController::class,'store'])->name('images.store'); 
Route::delete('/destroy/{id}/{oldProfilePictureUrl}', [AuthController::class, 'destroy'])->name('images.destroy');
Route::post('/upload/image', [AuthController::class,'upload'])->name('upload.image');
Route::get('/receive/{image}',[AuthController::class,'imageUploads']);

//user
Route::group(['middleware' => 'auth'], function ($router) {
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    // Route::delete('/users/{id}', [UserController::class, 'destroy']);
    Route::get('/users/search', [UserController::class, 'search'])->name('users.search');
});

// Route::get('/tasks/{id}/users', [TasksController::class, 'getUsersForTask']);
// Route::get('/tasks/{id}', [TasksController::class, 'assignUsers']);

Route::group(['middleware' => 'api'], function ($router) {
    Route::match(['get', 'post'], '/login', [AuthController::class, 'login'])->name('login');
    Route::delete('/logout', [AuthController::class, 'logout']);
    Route::get('/forgot-password/{token}', [AuthController::class, 'forgotPassword']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/resetpassword', [AuthController::class, 'resetPassword']);
    Route::get('/profile', [AuthController::class, 'profile']);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/me', [AuthController::class, 'me']);
Route::post('/refresh', [AuthController::class, 'refresh']);

//countries
Route::get('/countries', [AuthController::class, 'getCountries'])->name('auth.getCountries');
Route::get('/states/{countryCode}', [AuthController::class, 'getStates'])->name('auth.getStates');

//project
Route::delete('projects/{id}', [ProjectsController::class, 'softDelete'])->name('projects.softDelete');
Route::put('/projects/{id}/restore', [ProjectsController::class,  'restore']);
Route::get('projects/{id}/soft-deleted', [ProjectsController::class, 'softDeletedProjects'])->name('projects.softDeletedProjects');

Route::group(['middleware' => 'auth'], function ($router) {
    // Additional routes for searching, sorting, and pagination
    Route::get('/projects/pagination', [ProjectsController::class, 'paginationProjects'])->name('projects.paginationProjects');
    Route::get('/projects/search', [ProjectsController::class, 'searchProjects'])->name('projects.searchProjects');
    Route::get('/projects/sorted', [ProjectsController::class, 'SortedProjects'])->name('projects.SortedProjects');

    Route::get('/projects', [ProjectsController::class, 'index'])->name('projects.index');
    Route::get('/projects/{id}', [ProjectsController::class, 'show'])->name('projects.show');
    Route::put('/projects/{id}', [ProjectsController::class, 'update'])->name('projects.update');
    Route::post('/projects', [ProjectsController::class, 'store'])->name('projects.store');
});
//find project start and end date
Route::get('/tasks/filter', [TasksController::class, 'filterdate'])->name('tasks.filterdate');

Route::get('projects/task/{id}', [TasksController::class, 'getTasksByProjectId'])->name('tasks.getTasksByProjectId');
//project assisgn task not delete project
Route::get('projects/tasks/{id}', [ProjectsController::class, 'getTasksByProjectdate'])->name('tasks.getTasksByProjectdate');
//tasks
Route::put('/tasks/{id}', [TasksController::class, 'update'])->name('tasks.update');
Route::put('/task/{id}', [TasksController::class, 'updatetask'])->name('tasks.updatetask');
// Route::get('tasks/{id}/generate-pdf', [TasksController::class, 'generatePDF'])->name('generatePDF');
Route::post('tasks/{id}/generate-pdf', [TasksController::class, 'generatePDF'])->name('generatePDF');

Route::group(['middleware' => 'auth'], function ($router) {
    // Additional routes for searching, sorting, and pagination
    Route::get('/tasks/pagination', [TasksController::class, 'pagination'])->name('tasks.pagination'); //pagination
    Route::get('/tasks/search', [TasksController::class, 'search'])->name('tasks.search');
    Route::get('/tasks/sorted', [TasksController::class, 'sorted'])->name('tasks.sorted');

    Route::get('/tasks', [TasksController::class, 'index'])->name('tasks.index');
    Route::get('/tasks/{id}', [TasksController::class, 'show'])->name('tasks.show');
    Route::post('/tasks', [TasksController::class, 'store'])->name('tasks.store');
    Route::delete('/tasks/{id}', [TasksController::class, 'destroy'])->name('tasks.destroy');
});
