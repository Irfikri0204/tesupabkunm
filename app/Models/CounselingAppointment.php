<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CounselingAppointment extends Model
{
    protected $fillable = [
        'name',
        'age',
        'domicile',
        'applicant_status',
        'fakultas',
        'prodi',
        'semester',
        'phone',
        'whatsapp',
        'problem_description',
        'problem_duration',
        'action_taken',
        'preferred_date',
        'status',
        'scheduled_at',
        'admin_notes',
        'assigned_counselor',
        'location',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'preferred_date' => 'date',
    ];
}
