<?php

namespace App\Http\Controllers;

use App\Models\ImmGroup;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PublicImmReportController extends Controller
{
    public function show(Request $request, $group_slug)
    {
        $imm_group = ImmGroup::where('slug', $group_slug)->firstOrFail();

        $totalResponses = $imm_group->results()->count();
        
        $classificationCounts = $imm_group->results()
            ->select('total_classification', \DB::raw('count(*) as count'))
            ->groupBy('total_classification')
            ->pluck('count', 'total_classification')
            ->toArray();

        $dropoutCounts = $imm_group->results()
            ->select('dropout_risk_classification', \DB::raw('count(*) as count'))
            ->groupBy('dropout_risk_classification')
            ->pluck('count', 'dropout_risk_classification')
            ->toArray();

        $averages = $imm_group->results()
            ->selectRaw('
                AVG(skor_pribadi) as avg_pribadi,
                AVG(skor_sosial) as avg_sosial,
                AVG(skor_belajar) as avg_belajar,
                AVG(skor_karier) as avg_karier,
                AVG(skor_lainnya) as avg_lainnya
            ')->first();

        $faculties = $imm_group->faculties()
            ->where('is_active', true)
            ->withCount('results')
            ->with(['prodis' => function ($query) {
                $query->where('is_active', true)->withCount('results')->latest();
            }])
            ->latest()
            ->get();

        // Compute Detailed Stats per Faculty AND per Prodi (reuse helper)
        $facultyStats = [];
        foreach ($faculties as $faculty) {
            $facResults = $faculty->results()->select('skor_pribadi', 'skor_sosial', 'skor_belajar', 'skor_karier', 'skor_lainnya', 'dropout_risk_classification')->get();
            $facultyStats[$faculty->id] = [
                'bidang' => AdminImmGroupController::computeBidangStats($facResults),
                'dropout' => AdminImmGroupController::computeDropoutStats($facResults),
                'prodis' => [],
            ];
            foreach ($faculty->prodis as $prodi) {
                $prodiResults = \App\Models\ImmResult::where('imm_prodi_id', $prodi->id)
                    ->select('skor_pribadi', 'skor_sosial', 'skor_belajar', 'skor_karier', 'skor_lainnya', 'dropout_risk_classification')
                    ->get();
                $facultyStats[$faculty->id]['prodis'][$prodi->id] = [
                    'bidang' => AdminImmGroupController::computeBidangStats($prodiResults),
                    'dropout' => AdminImmGroupController::computeDropoutStats($prodiResults),
                ];
            }
        }

        // Paginated Students
        $query = $imm_group->results()->latest();
        if ($request->filled('search')) {
            $q = $request->search;
            $query->where(fn($b) => $b->where('nama', 'like', "%$q%")
                ->orWhere('nim', 'like', "%$q%")
                ->orWhere('fakultas', 'like', "%$q%"));
        }
        $students = $query->paginate(15)->withQueryString();

        return Inertia::render('Public/IMM/Report', [
            'group' => $imm_group,
            'faculties' => $faculties,
            'facultyStats' => $facultyStats,
            'totalResponses' => $totalResponses,
            'classificationCounts' => $classificationCounts,
            'dropoutCounts' => $dropoutCounts,
            'averages' => $averages,
            'students' => $students,
            'filters' => $request->only('search'),
        ]);
    }

    public function export(Request $request, $group_slug)
    {
        $imm_group = ImmGroup::where('slug', $group_slug)->firstOrFail();
        
        // Reuse the admin controller's export logic
        $controller = new AdminImmGroupController();
        // Redirect request to use same export
        return $controller->export($request, $imm_group);
    }
}
