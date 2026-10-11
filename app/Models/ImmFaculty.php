<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ImmFaculty extends Model
{
    protected $fillable = ['imm_group_id', 'name', 'slug', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    protected static function booted()
    {
        static::creating(function ($faculty) {
            if (empty($faculty->slug)) {
                $slug = Str::slug($faculty->name);
                if (static::where('imm_group_id', $faculty->imm_group_id)->where('slug', $slug)->exists()) {
                    $slug = $slug . '-' . uniqid();
                }
                $faculty->slug = $slug;
            }
        });
    }

    public function group()
    {
        return $this->belongsTo(ImmGroup::class, 'imm_group_id');
    }

    public function prodis()
    {
        return $this->hasMany(ImmProdi::class);
    }

    public function results()
    {
        return $this->hasMany(ImmResult::class);
    }
}
