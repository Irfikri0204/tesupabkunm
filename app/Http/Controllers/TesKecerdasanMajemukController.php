<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\KecerdasanMajemuk;
use App\Models\TestSetting;
use Illuminate\Support\Str;
use Inertia\Inertia;

class TesKecerdasanMajemukController extends Controller
{
    public function store(Request $request)
    {
        if (!TestSetting::isOpen('kecerdasan-majemuk')) {
            return redirect()->back()->with('error', 'Tes Kecerdasan Majemuk sementara tidak menerima jawaban.');
        }

        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'kelas' => 'required|string|max:255',
            'asal_sekolah' => 'required|string|max:255',
            'bukti_follow' => 'nullable|image|max:2048',
            'answers' => 'required|array',
        ]);

        $buktiFollowPath = null;
        if ($request->hasFile('bukti_follow')) {
            $buktiFollowPath = $request->file('bukti_follow')->store('bukti_follow', 'public');
        }

        $answers = $request->input('answers');
        $categories = [
            'Linguistik' => range(1, 5),
            'Logis-Matematis' => range(6, 10),
            'Spasial-Visual' => range(11, 15),
            'Musikal' => range(16, 20),
            'Kinestetik-Jasmani' => range(21, 25),
            'Interpersonal' => range(26, 30),
            'Intrapersonal' => range(31, 35),
            'Naturalis' => range(36, 40),
        ];

        $skorPerKategori = [];
        foreach ($categories as $categoryName => $questionIndices) {
            $totalScore = 0;
            foreach ($questionIndices as $index) {
                // index in answers is 1-based or 0-based? Let's assume 1-based as per logic
                $totalScore += intval($answers[$index] ?? 0);
            }

            $kategoriInterpretasi = '';
            if ($totalScore >= 13) {
                $kategoriInterpretasi = 'Sangat Kuat';
            } elseif ($totalScore >= 9) {
                $kategoriInterpretasi = 'Cukup kuat';
            } else {
                $kategoriInterpretasi = 'Perlu dikembangkan';
            }

            $skorPerKategori[$categoryName] = [
                'skor' => $totalScore,
                'interpretasi' => $kategoriInterpretasi
            ];
        }

        // Ambil skor tertinggi saja
        $scoresOnly = array_map(fn($item) => $item['skor'], $skorPerKategori);
        arsort($scoresOnly);

        $topCategoryNames = array_slice(array_keys($scoresOnly), 0, 1);

        $kodeAcak = Str::random(12);

        $result = KecerdasanMajemuk::create([
            'kode_acak' => $kodeAcak,
            'nama' => $validated['nama'],
            'kelas' => $validated['kelas'],
            'asal_sekolah' => $validated['asal_sekolah'],
            'bukti_follow' => $buktiFollowPath,
            'answers' => $answers,
            'skor_per_kategori' => $skorPerKategori,
            'top_categories' => $topCategoryNames,
        ]);

        return redirect()->route('hasil.kecerdasan-majemuk', ['kode' => $kodeAcak]);
    }

    public function showResults($kode)
    {
        $result = KecerdasanMajemuk::where('kode_acak', $kode)->firstOrFail();

        $sortedCategories = collect($result->skor_per_kategori)
            ->sortByDesc('skor')
            ->keys()
            ->toArray();

        $resultData = array_merge($result->toArray(), [
            'top_categories' => array_slice($sortedCategories, 0, 1),
        ]);

        $interpretations = [
            'Linguistik' => [
                'penjelasan' => 'Kamu punya kemampuan yang kuat dalam menggunakan kata-kata. Kamu cenderung suka membaca, menulis, atau bercerita, dan mudah mengekspresikan ide atau perasaan.',
                'cocok' => 'menulis, public speaking, storytelling',
                'tips' => 'coba mulai menulis cerita, jurnal harian, atau aktif berbicara di depan kelas'
            ],
            'Logis-Matematis' => [
                'penjelasan' => 'Kamu suka berpikir logis dan mencari tahu “kenapa sesuatu bisa terjadi”. Kamu juga cukup kuat dalam memecahkan masalah dan menemukan pola.',
                'cocok' => 'matematika, sains, analisis',
                'tips' => 'sering-sering latihan soal, eksperimen, atau main game strategi'
            ],
            'Spasial-Visual' => [
                'penjelasan' => 'Kamu punya imajinasi yang baik dan mudah memahami sesuatu dalam bentuk gambar atau visual. Kamu juga cenderung kreatif dalam membuat desain atau menggambar.',
                'cocok' => 'desain, menggambar, arsitektur',
                'tips' => 'coba eksplor desain, menggambar, atau membuat karya visual'
            ],
            'Musikal' => [
                'penjelasan' => 'Kamu peka terhadap musik, nada, dan ritme. Kamu mungkin suka mendengarkan lagu, bernyanyi, atau bermain musik.',
                'cocok' => 'musik, seni pertunjukan',
                'tips' => 'coba belajar alat musik atau gunakan musik saat belajar'
            ],
            'Kinestetik-Jasmani' => [
                'penjelasan' => 'Kamu belajar paling baik saat bergerak dan melakukan langsung. Kamu aktif dan suka kegiatan fisik.',
                'cocok' => 'olahraga, tari, kegiatan praktik',
                'tips' => 'belajar sambil praktik atau bergerak agar lebih mudah paham'
            ],
            'Interpersonal' => [
                'penjelasan' => 'Kamu mudah bergaul dan memahami orang lain. Kamu juga nyaman bekerja dalam tim dan sering jadi penengah atau pemimpin.',
                'cocok' => 'kerja tim, organisasi, kepemimpinan',
                'tips' => 'aktif di organisasi atau kegiatan kelompok'
            ],
            'Intrapersonal' => [
                'penjelasan' => 'Kamu cukup mengenal dirimu sendiri. Kamu tahu apa yang kamu rasakan dan apa yang ingin kamu capai.',
                'cocok' => 'refleksi diri, perencanaan hidup',
                'tips' => 'buat target pribadi dan luangkan waktu untuk refleksi diri'
            ],
            'Naturalis' => [
                'penjelasan' => 'Kamu punya kepedulian terhadap alam dan lingkungan. Kamu suka mengamati tumbuhan, hewan, atau aktivitas di luar ruangan.',
                'cocok' => 'lingkungan, biologi, kegiatan outdoor',
                'tips' => 'ikut kegiatan alam seperti berkebun atau eksplorasi lingkungan'
            ],
        ];

        return Inertia::render('HasilKecerdasanMajemuk', [
            'result' => $resultData,
            'interpretations' => $interpretations,
        ]);
    }
}
