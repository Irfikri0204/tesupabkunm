<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\TeamMember;
use App\Models\GayaBelajar;
use App\Models\KecerdasanMajemuk;
use App\Models\Panas;
use App\Models\Srq20;
use App\Models\Swls;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $metrics = [
            'total_gaya_belajar' => GayaBelajar::count(),
            'total_kecerdasan_majemuk' => KecerdasanMajemuk::count(),
            'total_panas' => Panas::count(),
            'total_srq20' => Srq20::count(),
            'total_swls' => Swls::count(),
            'total_team' => TeamMember::count(),
        ];

        return Inertia::render('Admin/Dashboard', [
            'metrics' => $metrics,
        ]);
    }
}
