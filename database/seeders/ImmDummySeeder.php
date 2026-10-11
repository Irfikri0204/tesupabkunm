<?php

namespace Database\Seeders;

use App\Models\ImmFaculty;
use App\Models\ImmGroup;
use App\Models\ImmProdi;
use App\Models\ImmResult;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ImmDummySeeder extends Seeder
{
    public function run(): void
    {
        $group = ImmGroup::firstOrCreate(
            ['slug' => 'universitas-negeri-makassar'],
            [
                'name' => 'Universitas Negeri Makassar',
                'description' => 'Data simulasi',
                'is_active' => true,
            ]
        );

        $facultiesData = [
            'Fakultas Ilmu Pendidikan' => ['Pendidikan Guru Sekolah Dasar', 'Bimbingan dan Konseling', 'Pendidikan Luar Biasa'],
            'Fakultas Matematika dan IPA' => ['Matematika', 'Biologi', 'Fisika', 'Kimia'],
            'Fakultas Bahasa dan Sastra' => ['Sastra Indonesia', 'Sastra Inggris', 'Pendidikan Bahasa Jerman'],
        ];

        $prodisByFaculty = [];

        foreach ($facultiesData as $facultyName => $prodis) {
            $faculty = ImmFaculty::firstOrCreate(
                ['imm_group_id' => $group->id, 'slug' => Str::slug($facultyName)],
                [
                    'name' => $facultyName,
                    'is_active' => true,
                ]
            );

            $prodisByFaculty[$faculty->id] = [];

            foreach ($prodis as $prodiName) {
                $prodi = ImmProdi::firstOrCreate(
                    ['imm_faculty_id' => $faculty->id, 'slug' => Str::slug($prodiName)],
                    [
                        'name' => $prodiName,
                        'is_active' => true,
                    ]
                );
                $prodisByFaculty[$faculty->id][] = $prodi;
            }
        }

        // Generate 50 dummy results
        $facIds = array_keys($prodisByFaculty);

        for ($i = 0; $i < 50; $i++) {
            $facId = $facIds[array_rand($facIds)];
            $prodiList = $prodisByFaculty[$facId];
            $prodi = $prodiList[array_rand($prodiList)];
            $facultyName = ImmFaculty::find($facId)->name;

            // Generate scores ensuring max per section is 45 (15 questions * max 3)
            // But let's generate section scores directly for simplicity in dummy,
            // or we can generate 75 random answers between 0 and 3.
            $answers = [];
            for ($j = 1; $j <= 75; $j++) {
                $answers[$j] = rand(0, 3);
            }

            // Calculate section scores
            $skor_pribadi = 0; for($k=1; $k<=15; $k++) $skor_pribadi += $answers[$k];
            $skor_sosial = 0; for($k=16; $k<=30; $k++) $skor_sosial += $answers[$k];
            $skor_belajar = 0; for($k=31; $k<=45; $k++) $skor_belajar += $answers[$k];
            $skor_karier = 0; for($k=46; $k<=60; $k++) $skor_karier += $answers[$k];
            $skor_lainnya = 0; for($k=61; $k<=75; $k++) $skor_lainnya += $answers[$k];
            
            $total = $skor_pribadi + $skor_sosial + $skor_belajar + $skor_karier + $skor_lainnya;
            $class = 'Baik';
            if ($total > 115) $class = 'Perlu Pendampingan';
            elseif ($total > 75) $class = 'Perlu Perhatian Khusus';

            $dropoutRisk = 'Risiko rendah';
            $dropoutScore = rand(0, 6);
            $randRisk = rand(1, 10);
            if ($randRisk > 8) {
                $dropoutRisk = 'Risiko tinggi';
                $dropoutScore = rand(14, 27);
            } elseif ($randRisk > 5) {
                $dropoutRisk = 'Risiko sedang';
                $dropoutScore = rand(7, 13);
            }

            ImmResult::create([
                'imm_group_id' => $group->id,
                'imm_faculty_id' => $facId,
                'imm_prodi_id' => $prodi->id,
                'nama' => 'Mahasiswa ' . ($i + 1),
                'nim' => '200' . rand(10000, 99999),
                'fakultas' => $facultyName,
                'program_studi' => $prodi->name,
                'semester' => rand(1, 8),
                
                'answers' => $answers,
                
                'skor_pribadi' => $skor_pribadi,
                'skor_sosial' => $skor_sosial,
                'skor_belajar' => $skor_belajar,
                'skor_karier' => $skor_karier,
                'skor_lainnya' => $skor_lainnya,
                'total_score' => $total,
                'total_classification' => $class,
                'dropout_risk_classification' => $dropoutRisk,
                'dropout_risk_score' => $dropoutScore,
                'conclusion' => 'Kesimpulan dari tes',
                'full_result' => [],
                'penutup' => [],
            ]);
        }
    }
}
