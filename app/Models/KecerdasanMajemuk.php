<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KecerdasanMajemuk extends Model
{
    protected $fillable = [
        'kode_acak',
        'nama',
        'kelas',
        'asal_sekolah',
        'bukti_follow',
        'answers',
        'skor_per_kategori',
        'top_categories',
    ];

    protected $casts = [
        'answers' => 'array',
        'skor_per_kategori' => 'array',
        'top_categories' => 'array',
    ];
}
