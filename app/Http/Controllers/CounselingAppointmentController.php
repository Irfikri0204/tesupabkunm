<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CounselingAppointmentController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'                => 'required|string|max:255',
            'age'                 => 'required|integer|min:1',
            'domicile'            => 'required|string|max:255',
            'applicant_status'    => 'required|string|max:50',
            'fakultas'            => 'nullable|string|max:255',
            'prodi'               => 'nullable|string|max:255',
            'semester'            => 'nullable|string|max:50',
            'phone'               => 'required|string|max:255',
            'whatsapp'            => 'required|string|max:255',
            'problem_description' => 'required|string',
            'problem_duration'    => 'required|string',
            'action_taken'        => 'required|string',
            'preferred_date'      => 'nullable|date',
        ]);

        \App\Models\CounselingAppointment::create($validated);

        return redirect()->route('konseling')->with('success', true);
    }
}

