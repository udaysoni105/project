<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Validator;

class Project extends Model
{
    use HasFactory, HasRoles, SoftDeletes;
    protected $gaurd_name = 'web';
    protected $dates = ['deleted_at'];
    protected $fillable = ['name', 'description', 'start_date', 'end_date', 'status'];

    // Add a static validation rules array
    public static $rules = [
        'name' => 'required|string|max:255',
        'description' => 'required|string',
        'start_date' => 'required|date',
        'end_date' => 'required|date|after:start_date',
        // 'status' => 'required|in:pending,running,completed',
    ];

    protected static function boot()
    {
        parent::boot();

        // Register the 'saving' event listener
        static::saving(function ($model) {
            $validator = Validator::make($model->toArray(), static::$rules);

            if ($validator->fails()) {
                // If validation fails, throw an exception or handle the error as needed.
                throw new \Exception($validator->errors()->first());
            }

            // Validation succeeded, return true to proceed with the save operation.
            return true;
        });
    }

    public function softDelete($id)
    {
        $project = Project::find($id);

        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }

        $project->delete();

        return response()->json(['message' => 'Project soft deleted']);
    }

    // Define the relationship between Project and User through the intermediate table UserProject (Many-to-Many)
    public function users()
    {
        return $this->belongsToMany(User::class, 'user_project');
    }

    // Define the relationship between Project and Task (One-to-Many)
    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
}
