<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Traits\HasRoles;
class Task extends Model
{
    use HasFactory,HasRoles;
    protected $table = 'tasks';
    protected $gaurd_name = 'web';
    protected $fillable = ['name', 'description', 'start_date', 'end_date', 'completed', 'project_id'];

    // Define the relationship between Task and Project (Many-to-One)
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    // Define the relationship between Task and User (Many-to-One)
    // public function user()
    // {
    //     return $this->belongsTo(User::class);
    // }
    public function tasks()
    {
        return $this->belongsToMany(Task::class, 'user_task');
    }
}
