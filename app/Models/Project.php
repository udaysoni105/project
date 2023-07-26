<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use HasFactory, HasRoles, SoftDeletes;
    protected $gaurd_name = 'web';
    protected $dates = ['deleted_at'];
    protected $fillable = ['name', 'description', 'start_date', 'end_date', 'status'];
    public function softDelete($id)
    {
        $project = Project::find($id);

        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }

        $project->delete();

        return response()->json(['message' => 'Project soft deleted']);
    }
    public function Tasks(){
        return $this->hasMany(Task::class);
    }
    public function users(){
        return $this->hasMany(User::class);
    }
}
