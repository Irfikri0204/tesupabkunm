<?php

namespace App\Http\Controllers;

use App\Models\Srq20;
use App\Models\TestSetting;
use Illuminate\Http\Request;

class TesSrq20Controller extends Controller
{
    public function store(Request $request)
    {
        if (!TestSetting::isOpen('srq20')) {
            return redirect()->back()->with('error', 'Tes SRQ-20 sementara tidak menerima jawaban.');
        }

        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'tanggal_lahir' => 'required|date',
            'jenis_kelamin' => 'required|string',
            'answers' => 'required|array',
            'total_skor' => 'required|numeric',
            'kategori' => 'required|in:Normal,Perlu Perhatian,Kemungkinan Gangguan Mental',
        ]);

        Srq20::create([
            'nama' => $validated['nama'],
            'tanggal_lahir' => $validated['tanggal_lahir'],
            'jenis_kelamin' => $validated['jenis_kelamin'],
            'answers' => json_encode($validated['answers']),
            'total_skor' => $validated['total_skor'],
            'kategori' => $validated['kategori'],
        ]);

        return redirect('/hasil/srq20');
    }
}
