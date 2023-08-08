<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProjectsController;
use App\Http\Controllers\TasksController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CountryStateController;

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

//user
Route::post('/register', [AuthController::class, 'register']);
Route::post('/me', [AuthController::class, 'me']);
Route::post('/refresh', [AuthController::class, 'refresh']);

Route::group(['middleware' => 'api'], function ($router) {
    Route::match(['get', 'post'], '/login', [AuthController::class, 'login'])->name('login');
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/resetpassword', [ResetPasswordController::class, 'resetPassword']);
    Route::get('/profile', [AuthController::class, 'profile']);
});


//project
Route::delete('projects/{id}', [ProjectsController::class, 'softDelete'])->name('projects.softDelete');
Route::put('/projects/{id}/restore', [ProjectsController::class,  'restore']);
Route::get('projects/{id}/soft-deleted', [ProjectsController::class, 'softDeletedProjects'])->name('projects.softDeletedProjects');

Route::group(['middleware' => 'auth'], function ($router) {
    // Additional routes for searching, sorting, and pagination
    Route::get('/projects', [ProjectsController::class, 'getProjects'])->name('projects.getProjects');
    Route::get('/projects/search', [ProjectsController::class, 'searchProjects'])->name('projects.searchProjects');
    Route::get('/projects/sorted', [ProjectsController::class, 'getSortedProjects'])->name('projects.getSortedProjects');

    Route::get('/projects', [ProjectsController::class, 'index'])->name('projects.index');
    Route::get('/projects/{id}', [ProjectsController::class, 'show'])->name('projects.show');
    Route::put('/projects/{id}', [ProjectsController::class, 'update'])->name('projects.update');
    Route::post('/projects', [ProjectsController::class, 'store'])->name('projects.store');
});

//tasks
Route::put('/tasks/{id}', [TasksController::class, 'update'])->name('tasks.update');
Route::put('/task/{id}', [TasksController::class, 'updatetask'])->name('tasks.updatetask');
Route::get('tasks/{id}/generate-pdf', [TasksController::class, 'generatePDF'])->name('generatePDF');
Route::group(['middleware' => 'auth'], function ($router) {
    // Additional routes for searching, sorting, and pagination
    Route::get('/tasks', [TasksController::class, 'getTasks'])->name('tasks.getTasks'); //pagination
    Route::get('/tasks/search', [TasksController::class, 'search'])->name('tasks.search');
    Route::get('/tasks/sorted', [TasksController::class, 'sorted'])->name('tasks.sorted');

    Route::get('/tasks', [TasksController::class, 'index'])->name('tasks.index');
    Route::get('/tasks/{id}', [TasksController::class, 'show'])->name('tasks.show');
    Route::post('/tasks', [TasksController::class, 'store'])->name('tasks.store');
    Route::delete('/tasks/{id}', [TasksController::class, 'destroy'])->name('tasks.destroy');
});

//country
// Route::group(['middleware' => 'auth:api'], function () {
//     Route::get('/countries', [AuthController::class, 'getCountries'])->name('tasks.getCountries');
//     Route::get('/states/{country}', [AuthController::class, 'getStates'])->name('tasks.getStates');
// });


Route::get('/countries', [AuthController::class, 'getCountries'])->name('auth.getCountries');
// Route::get('/states/{countryCode}', [AuthController::class, 'getStates'])->name('auth.getStates');
Route::get('/states/{countryCode}', [AuthController::class, 'getStates'])->name('auth.getStates');

//user
Route::group(['middleware' => 'auth'], function ($router) {
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
});
