<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Modul extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'description',
        'file_path',
        'cover_image',
        'is_published',
    ];

    protected $appends = ['file_url', 'cover_url'];

    public function getFileUrlAttribute()
    {
        return asset('storage/' . $this->file_path);
    }

    public function getCoverUrlAttribute()
    {
        if ($this->cover_image) {
            return asset('storage/' . $this->cover_image);
        }
        return null;
    }
}
