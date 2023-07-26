<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Traits\HasRoles;
class Task extends Model
{
    use HasFactory,HasRoles;
    protected $gaurd_name = 'web';
    protected $fillable = ['project_id', 'name', 'description', 'start_date', 'end_date', 'completed'];

    // public function project()
    // {
    //     return $this->belongsTo(Project::class);
    // }
    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }
}
