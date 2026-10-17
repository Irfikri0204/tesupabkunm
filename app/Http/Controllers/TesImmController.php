<?php

namespace App\Http\Controllers;

use App\Models\ImmResult;
use App\Models\TestSetting;
use Illuminate\Http\Request;

class TesImmController extends Controller
{
    public function store(Request $request)
    {
        // Actually IMM isn't a test setting yet in the database, 
        // but if we want to enforce it, we could. Let's just store it for now.

        $validated = $request->validate([
            'userData' => 'required|array',
            'answers' => 'required|array',
            'result' => 'required|array',
            'penutup' => 'nullable|array',
        ]);

        $userData = $validated['userData'];
        $result = $validated['result'];

        // Enforce active status if group is provided
        if (!empty($userData['imm_group_id'])) {
            $group = \App\Models\ImmGroup::find($userData['imm_group_id']);
            if (!$group || !$group->is_active) {
                return response()->json([
                    'success' => false,
                    'message' => 'Kelompok / kampus ini saat ini sedang dinonaktifkan dan tidak menerima jawaban.'
                ], 403);
            }
        }

        if (!empty($userData['imm_faculty_id'])) {
            $faculty = \App\Models\ImmFaculty::find($userData['imm_faculty_id']);
            if (!$faculty || !$faculty->is_active) {
                return response()->json([
                    'success' => false,
                    'message' => 'Fakultas ini saat ini sedang dinonaktifkan dan tidak menerima jawaban.'
                ], 403);
            }
        }

        ImmResult::create([
            'imm_group_id' => !empty($userData['imm_group_id']) ? $userData['imm_group_id'] : null,
            'imm_faculty_id' => !empty($userData['imm_faculty_id']) ? $userData['imm_faculty_id'] : null,
            'imm_prodi_id' => !empty($userData['imm_prodi_id']) ? $userData['imm_prodi_id'] : null,
            'nama' => $userData['nama'] ?? '-',
            'nim' => $userData['nim'] ?? null,
            'fakultas' => $userData['fakultas'] ?? null,
            'program_studi' => $userData['program_studi'] ?? null,
            'semester' => $userData['semester'] ?? null,
            'jenis_kelamin' => $userData['jenis_kelamin'] ?? null,
            'tempat_tinggal' => $userData['tempat_tinggal'] ?? null,
            'nomor_hp' => $userData['nomor_hp'] ?? null,
            'email' => $userData['email'] ?? null,
            'status_bekerja' => $userData['status_bekerja'] ?? null,
            'status_pernikahan' => $userData['status_pernikahan'] ?? null,
            'penyandang_disabilitas' => $userData['penyandang_disabilitas'] ?? null,
            'disabilitas_jenis' => $userData['disabilitas_jenis'] ?? null,
            'penerima_beasiswa' => $userData['penerima_beasiswa'] ?? null,
            'ipk_terakhir' => $userData['ipk_terakhir'] ?? null,
            'status_semester_lalu' => $userData['status_semester_lalu'] ?? null,

            'answers' => $validated['answers'],

            'skor_pribadi' => $result['sections'][0]['score'] ?? 0,
            'skor_sosial' => $result['sections'][1]['score'] ?? 0,
            'skor_belajar' => $result['sections'][2]['score'] ?? 0,
            'skor_karier' => $result['sections'][3]['score'] ?? 0,
            'skor_lainnya' => $result['sections'][4]['score'] ?? 0,

            'total_score' => $result['totalScore'],
            'total_classification' => $result['totalClassification'],
            'conclusion' => $result['conclusion'],

            'dropout_risk_score' => $result['dropoutRisk']['score'] ?? 0,
            'dropout_risk_classification' => $result['dropoutRisk']['finalClassification'] ?? null,

            'full_result' => $result,
            'penutup' => $validated['penutup'],
        ]);

        return response()->json(['success' => true]);
    }
}
