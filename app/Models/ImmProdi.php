<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ImmProdi extends Model
{
    protected $fillable = ['imm_faculty_id', 'name', 'slug', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    protected static function booted()
    {
        static::creating(function ($prodi) {
            if (empty($prodi->slug)) {
                $slug = Str::slug($prodi->name);
                if (static::where('imm_faculty_id', $prodi->imm_faculty_id)->where('slug', $slug)->exists()) {
                    $slug = $slug . '-' . uniqid();
                }
                $prodi->slug = $slug;
            }
        });
    }

    public function faculty()
    {
        return $this->belongsTo(ImmFaculty::class, 'imm_faculty_id');
    }

    public function results()
    {
        return $this->hasMany(ImmResult::class);
    }
}
