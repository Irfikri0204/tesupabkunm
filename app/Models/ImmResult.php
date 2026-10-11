<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ImmResult extends Model
{
    protected $fillable = [
        'imm_group_id', 'imm_faculty_id', 'imm_prodi_id',
        'nama', 'nim', 'fakultas', 'program_studi', 'semester',
        'jenis_kelamin', 'tempat_tinggal', 'nomor_hp',
        'status_bekerja', 'status_pernikahan',
        'penyandang_disabilitas', 'disabilitas_jenis',
        'penerima_beasiswa', 'ipk_terakhir', 'status_semester_lalu',
        'answers', 'skor_pribadi', 'skor_sosial', 'skor_belajar',
        'skor_karier', 'skor_lainnya', 'total_score', 'total_classification',
        'conclusion', 'dropout_risk_score', 'dropout_risk_classification',
        'full_result', 'penutup',
    ];

    protected $casts = [
        'answers' => 'array',
        'full_result' => 'array',
        'penutup' => 'array',
    ];

    public function group()
    {
        return $this->belongsTo(ImmGroup::class, 'imm_group_id');
    }

    public function faculty()
    {
        return $this->belongsTo(ImmFaculty::class, 'imm_faculty_id');
    }

    public function prodi()
    {
        return $this->belongsTo(ImmProdi::class, 'imm_prodi_id');
    }
}
