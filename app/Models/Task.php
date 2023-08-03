<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Support\Facades\Validator;

class Task extends Model
{
    use HasFactory, HasRoles;
    protected $table = 'tasks';
    protected $gaurd_name = 'web';
    protected $fillable = ['name', 'description', 'start_date', 'end_date', 'status', 'project_id', 'user_id',];
    protected $dates = ['start_date', 'end_date'];

    // Add a static validation rules array
    public static $rules = [
        'name' => 'required|string|max:255',
        'description' => 'required|string',
        'start_date' => 'required|date',
        'end_date' => 'required|date|after:start_date',
        'status' => 'required|in:pending,completed',
        'project_id' => 'required|exists:projects,id',
        'user_id' => 'required|exists:user_id'
    ];

    // protected static function boot()
    // {
    //     parent::boot();

    //     // Register the 'saving' event listener
    //     static::saving(function ($model) {
    //         $validator = Validator::make($model->toArray(), static::$rules);

    //         if ($validator->fails()) {
    //             // If validation fails, throw an exception or handle the error as needed.
    //             throw new \Exception($validator->errors()->first());
    //         }

    //         // Validation succeeded, return true to proceed with the save operation.
    //         return true;
    //     });
    // }
    // Define the relationship between Task and Project (Many-to-One)
    public function project()
    {
        return $this->belongsTo(Project::class);
    }
    public function tasks()
    {
        return $this->belongsToMany(Task::class, 'user_task');
    }
    public function users()
    {
        return $this->belongsToMany(User::class, 'user_task');
    }
    // Define the relationship between Task and User (Many-to-One)
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
