<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Swls extends Model
{
    protected $fillable = [
        'nama',
        'tanggal_lahir',
        'jenis_kelamin',
        'answers',
        'total_skor',
        'kategori',
    ];

    protected $casts = [
        'answers' => 'array',
    ];
}
