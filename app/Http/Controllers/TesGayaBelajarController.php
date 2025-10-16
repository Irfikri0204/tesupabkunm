<?php

namespace App\Http\Controllers;

use App\Models\GayaBelajar;
use Illuminate\Http\Request;

class TesGayaBelajarController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'tanggal_lahir' => 'required|date',
            'jenis_kelamin' => 'required|string',
            'answers' => 'required|array',
            'total_skor' => 'required|numeric',
            'kategori' => 'required|in:visual,auditory,kinesthetic',
        ]);

        GayaBelajar::create([
            'nama' => $validated['nama'],
            'tanggal_lahir' => $validated['tanggal_lahir'],
            'jenis_kelamin' => $validated['jenis_kelamin'],
            'answers' => json_encode($validated['answers']),
            'total_skor' => $validated['total_skor'],
            'kategori' => $validated['kategori'],
        ]);

        return redirect('/hasil/gayabelajar');
    }
}
