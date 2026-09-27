<?php

namespace App\Http\Controllers;

use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminKonselingInfoController extends Controller
{
    private array $infoKeys = [
        'konseling_info_jam'    => 'Jam Operasional',
        'konseling_info_lokasi' => 'Lokasi / Tempat (Luring)',
        'konseling_info_daring' => 'Keterangan Konseling Daring',
        'konseling_info_syarat' => 'Ketentuan / Syarat',
        'konseling_info_kontak' => 'Nomor WhatsApp (tanpa + atau spasi, misal: 6281xxx)',
        'konseling_info_email'  => 'Alamat Email',
    ];

    public function edit()
    {
        if (auth()->user()->role !== 'superadmin') {
            abort(403, 'Unauthorized action.');
        }

        $data = SiteSetting::whereIn('key', array_keys($this->infoKeys))
            ->pluck('value', 'key')
            ->toArray();

        return Inertia::render('Admin/KonselingInfo/Edit', [
            'data'    => $data,
            'labels'  => $this->infoKeys,
        ]);
    }

    public function update(Request $request)
    {
        if (auth()->user()->role !== 'superadmin') {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'konseling_info_jam'    => 'nullable|string|max:500',
            'konseling_info_lokasi' => 'nullable|string|max:500',
            'konseling_info_daring' => 'nullable|string|max:1000',
            'konseling_info_syarat' => 'nullable|string|max:1000',
            'konseling_info_kontak' => 'nullable|string|max:30',
            'konseling_info_email'  => 'nullable|email|max:255',
        ]);

        foreach ($validated as $key => $value) {
            SiteSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $value ?? '', 'label' => $this->infoKeys[$key] ?? $key]
            );
        }

        return redirect()->back()->with('success', 'Informasi konseling berhasil diperbarui.');
    }
}
