<?php

namespace App\Http\Controllers;

use App\Models\GayaBelajar;
use App\Models\TestSetting;
use Illuminate\Http\Request;

class TesGayaBelajarController extends Controller
{
    public function store(Request $request)
    {
        if (!TestSetting::isOpen('gayabelajar')) {
            return redirect()->back()->with('error', 'Tes Gaya Belajar sementara tidak menerima jawaban.');
        }

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
