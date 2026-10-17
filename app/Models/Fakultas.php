<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Fakultas extends Model
{
    protected $fillable = ['name'];

    public function prodis()
    {
        return $this->hasMany(Prodi::class)->orderBy('name');
    }
}
