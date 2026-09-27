<?php

namespace App\Http\Controllers;

use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class AdminTentangKamiController extends Controller
{
    public function edit()
    {
        $settings = [
            'visi_text' => 'Menjadi pusat layanan psikologi dan bimbingan konseling yang profesional, inovatif, dan terpercaya dalam mewujudkan mahasiswa yang berkarakter, berdaya saing, dan sejahtera secara psikologis.',
            'misi_text' => "<ul><li>Menyelenggarakan layanan bimbingan dan konseling yang responsif terhadap kebutuhan mahasiswa.</li><li>Menyediakan instrumen tes psikologi yang akurat dan relevan.</li><li>Meningkatkan kompetensi dan profesionalisme sumber daya manusia (konselor dan konselor sebaya).</li><li>Membangun jejaring kerja sama dengan berbagai pihak untuk mendukung efektivitas layanan.</li></ul>",
            'struktur_organisasi_image' => null,
            'contact_address' => 'Gedung Pinisi UNM, Makassar, Sulawesi Selatan',
            'contact_phone' => '-',
            'contact_email' => 'upabk@unm.ac.id',
            'contact_instagram' => '@upa_bk_unm',
            'konselor_sebaya_title' => 'Teman Cerita Terpercaya',
            'konselor_sebaya_desc' => '<p>Konselor Sebaya (Peer Counselor) adalah mahasiswa terlatih yang siap mendengarkan, memahami, dan membantu rekan sesama mahasiswa dalam menghadapi berbagai tantangan perkuliahan maupun masalah pribadi.</p><p>Pendekatan sebaya menjadikan proses konseling terasa lebih hangat, nyaman, dan sejalan dengan realita dunia mahasiswa.</p>',
            'konselor_sebaya_image' => null,
        ];

        $labels = [
            'visi_text' => 'Visi UPA BK',
            'misi_text' => 'Misi UPA BK',
            'struktur_organisasi_image' => 'Bagan Struktur Organisasi',
            'contact_address' => 'Alamat Kontak',
            'contact_phone' => 'Telepon / WA',
            'contact_email' => 'Email',
            'contact_instagram' => 'Instagram',
            'konselor_sebaya_title' => 'Judul Konselor Sebaya',
            'konselor_sebaya_desc' => 'Deskripsi Konselor Sebaya',
            'konselor_sebaya_image' => 'Gambar Konselor Sebaya',
        ];

        $data = [];

        foreach ($settings as $key => $default) {
            $setting = SiteSetting::firstOrCreate(
                ['key' => $key],
                ['value' => $default, 'label' => $labels[$key]]
            );
            
            if (in_array($key, ['struktur_organisasi_image', 'konselor_sebaya_image'])) {
                $data[$key] = $setting->value ? asset('storage/' . $setting->value) : null;
            } else {
                $data[$key] = $setting->value;
            }
        }

        return Inertia::render('Admin/TentangKami/Form', $data);
    }

    public function update(Request $request)
    {
        $request->validate([
            'visi_text' => 'nullable|string',
            'misi_text' => 'nullable|string',
            'struktur_organisasi_image' => 'nullable|image|max:5120',
            'contact_address' => 'nullable|string',
            'contact_phone' => 'nullable|string',
            'contact_email' => 'nullable|string',
            'contact_instagram' => 'nullable|string',
            'konselor_sebaya_title' => 'nullable|string',
            'konselor_sebaya_desc' => 'nullable|string',
            'konselor_sebaya_image' => 'nullable|image|max:5120',
        ]);

        $keys = ['visi_text', 'misi_text', 'contact_address', 'contact_phone', 'contact_email', 'contact_instagram', 'konselor_sebaya_title', 'konselor_sebaya_desc'];

        foreach ($keys as $key) {
            if ($request->has($key)) {
                SiteSetting::updateOrCreate(
                    ['key' => $key],
                    ['value' => $request->input($key)]
                );
            }
        }

        if ($request->hasFile('struktur_organisasi_image')) {
            $path = $request->file('struktur_organisasi_image')->store('tentang-kami', 'public');
            SiteSetting::updateOrCreate(
                ['key' => 'struktur_organisasi_image'],
                ['value' => $path]
            );
        }

        if ($request->hasFile('konselor_sebaya_image')) {
            $path = $request->file('konselor_sebaya_image')->store('tentang-kami', 'public');
            SiteSetting::updateOrCreate(
                ['key' => 'konselor_sebaya_image'],
                ['value' => $path]
            );
        }

        return redirect()->back()->with('success', 'Pengaturan Tentang Kami berhasil diperbarui.');
    }

    public function deleteImage(Request $request)
    {
        $type = $request->input('type', 'struktur_organisasi_image');
        
        if (!in_array($type, ['struktur_organisasi_image', 'konselor_sebaya_image'])) {
            return redirect()->back()->with('error', 'Tipe gambar tidak valid.');
        }

        $setting = SiteSetting::where('key', $type)->first();

        if ($setting && $setting->value) {
            Storage::disk('public')->delete($setting->value);
            $setting->update(['value' => null]);
        }

        return redirect()->back()->with('success', 'Gambar berhasil dihapus.');
    }
}
