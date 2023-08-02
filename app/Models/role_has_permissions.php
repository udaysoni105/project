<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Traits\HasRoles;

class role_has_permissions extends Model
{
    use HasFactory, HasRoles;
    protected $gaurd_name = 'web';
    protected $fillable = [
        'role_id', 'permission_id',
    ];
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function permission()
    {
        return $this->belongsTo(Permission::class);
    }
}
