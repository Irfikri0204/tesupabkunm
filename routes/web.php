<?php

use App\Http\Controllers\TesGayaBelajarController;
use App\Http\Controllers\TesKecerdasanMajemukController;
use App\Http\Controllers\TesPanasController;
use App\Http\Controllers\TesSrq20Controller;
use App\Http\Controllers\TesSwlsController;
use App\Models\TeamMember;
use App\Models\SiteSetting;
use App\Models\TestSetting;
use App\Models\LinkedWebsite;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\PublicPostController;
use App\Http\Controllers\PublicModulController;
use App\Http\Controllers\PublicDynamicTestController;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\AdminTeamMemberController;
use App\Http\Controllers\AdminTestSettingController;
use App\Http\Controllers\AdminSiteSettingController;
use App\Http\Controllers\AdminGayaBelajarController;
use App\Http\Controllers\AdminKecerdasanMajemukController;
use App\Http\Controllers\AdminPanasController;
use App\Http\Controllers\AdminSrq20Controller;
use App\Http\Controllers\AdminSwlsController;
use App\Http\Controllers\DynamicTestController;
use App\Http\Controllers\Admin\PostController;
use App\Http\Controllers\Admin\ModulController;
use App\Http\Controllers\Admin\LinkedWebsiteController;

Route::get('/', function () {
    $teamMembers = TeamMember::orderBy('order')->get(['id', 'name', 'role', 'division', 'faculty', 'type', 'photo']);
    $siteSettings = SiteSetting::pluck('value', 'key')->toArray();
    $linkedWebsites = LinkedWebsite::where('is_active', true)->orderBy('order')->get();
    $dynamicTests = \App\Models\DynamicTest::where('is_active', true)->withCount('questions')->get();
    $testSettings = TestSetting::all();
    $latestPosts = \App\Models\Post::where('is_published', true)->orderBy('created_at', 'desc')->take(3)->get();

    return Inertia::render('home', [
        'teamMembers' => $teamMembers,
        'siteSettings' => $siteSettings,
        'linkedWebsites' => $linkedWebsites,
        'dynamicTests' => $dynamicTests,
        'testSettings' => $testSettings,
        'latestPosts' => $latestPosts,
    ]);
})->name('home');

Route::get('/profil-tim', function () {
    $teamMembers = TeamMember::orderBy('order')->get(['id', 'name', 'role', 'division', 'faculty', 'type', 'photo']);

    return Inertia::render('TeamMembers', [
        'teamMembers' => $teamMembers,
    ]);
})->name('profil-tim');

Route::get('/visi-misi', function () {
    $visi = SiteSetting::getValue('visi_text', 'Visi default...');
    $misi = SiteSetting::getValue('misi_text', 'Misi default...');
    return Inertia::render('VisiMisi', ['visi_text' => $visi, 'misi_text' => $misi]);
})->name('visi-misi');

Route::get('/struktur-organisasi', function () {
    $imagePath = SiteSetting::getValue('struktur_organisasi_image');
    $image = $imagePath ? asset('storage/' . $imagePath) : null;
    return Inertia::render('StrukturOrganisasi', ['struktur_organisasi_image' => $image]);
})->name('struktur-organisasi');

Route::get('/konselor-sebaya', function () {
    $members = TeamMember::where('type', 'konselor-sebaya')->orderBy('order')->get();
    
    $title = SiteSetting::getValue('konselor_sebaya_title', 'Teman Cerita Terpercaya');
    $desc = SiteSetting::getValue('konselor_sebaya_desc', '<p>Konselor Sebaya (Peer Counselor) adalah mahasiswa terlatih yang siap mendengarkan, memahami, dan membantu rekan sesama mahasiswa dalam menghadapi berbagai tantangan perkuliahan maupun masalah pribadi.</p><p>Pendekatan sebaya menjadikan proses konseling terasa lebih hangat, nyaman, dan sejalan dengan realita dunia mahasiswa.</p>');
    $imagePath = SiteSetting::getValue('konselor_sebaya_image');
    $image = $imagePath ? asset('storage/' . $imagePath) : null;

    return Inertia::render('KonselorSebaya', [
        'members' => $members,
        'title' => $title,
        'desc' => $desc,
        'image' => $image,
    ]);
})->name('konselor-sebaya');

Route::get('/kontak', function () {
    return Inertia::render('Kontak');
})->name('kontak');

Route::get('/about', function () {
    return Inertia::render('about');
})->name('about');

Route::get('/konseling', function () {
    $fakultas = \App\Models\Fakultas::orderBy('name')->get();
    $info = \App\Models\SiteSetting::whereIn('key', [
        'konseling_info_jam',
        'konseling_info_lokasi',
        'konseling_info_daring',
        'konseling_info_syarat',
        'konseling_info_kontak',
        'konseling_info_email',
    ])->pluck('value', 'key')->toArray();
    return Inertia::render('Konseling', ['fakultas' => $fakultas, 'info' => $info]);
})->name('konseling');
Route::post('/konseling', [\App\Http\Controllers\CounselingAppointmentController::class, 'store'])->name('konseling.store');

// Public Posts
Route::get('/berita', [PublicPostController::class, 'index'])->name('postingan.index');
Route::get('/berita/{slug}', [PublicPostController::class, 'show'])->name('postingan.show');

// Public Modules
Route::get('/modul', [PublicModulController::class, 'index'])->name('modul.index');

Route::get('/tes/gayabelajar', function () {
    if (!TestSetting::isOpen('gayabelajar')) {
        return Inertia::render('TestClosed', [
            'title' => 'Tes Kenali Gaya Belajarmu Ditutup',
            'message' => 'Tes Kenali Gaya Belajarmu sementara tidak menerima jawaban. Silakan coba lagi nanti.',
        ]);
    }

    return Inertia::render('IdentitasGayaBelajar');
});

// Halaman soal
Route::get('/tes/gayabelajar/soal', function () {
    if (!TestSetting::isOpen('gayabelajar')) {
        return Inertia::render('TestClosed', [
            'title' => 'Tes Kenali Gaya Belajarmu Ditutup',
            'message' => 'Tes Kenali Gaya Belajarmu sementara tidak menerima jawaban. Silakan coba lagi nanti.',
        ]);
    }

    return Inertia::render('gayabelajar');
});

// Endpoint kirim hasil tes
Route::post('/tes/gayabelajar/submit', [TesGayaBelajarController::class, 'store']);
Route::get('/hasil/gayabelajar', function () {
    return Inertia::render('hasilgayabelajar');
});

Route::get('/tes/panas', function () {
    if (!TestSetting::isOpen('panas')) {
        return Inertia::render('TestClosed', [
            'title' => 'Tes Pola Emosimu Ditutup',
            'message' => 'Tes Pola Emosimu sementara tidak menerima jawaban. Silakan coba lagi nanti.',
        ]);
    }

    return Inertia::render('IdentitasPanas');
});

// Halaman soal
Route::get('/tes/panas/soal', function () {
    if (!TestSetting::isOpen('panas')) {
        return Inertia::render('TestClosed', [
            'title' => 'Tes Pola Emosimu Ditutup',
            'message' => 'Tes Pola Emosimu sementara tidak menerima jawaban. Silakan coba lagi nanti.',
        ]);
    }

    return Inertia::render('panas');
});

// Endpoint kirim hasil tes
Route::post('/tes/panas/submit', [TesPanasController::class, 'store']);
Route::get('/hasil/panas', function () {
    return Inertia::render('hasilpanas');
});

Route::get('/tes/swls', function () {
    if (!TestSetting::isOpen('swls')) {
        return Inertia::render('TestClosed', [
            'title' => 'Tes Dimensi Kepuasan Hidup Ditutup',
            'message' => 'Tes Dimensi Kepuasan Hidup sementara tidak menerima jawaban. Silakan coba lagi nanti.',
        ]);
    }

    return Inertia::render('IdentitasSwls');
});

// Halaman soal
Route::get('/tes/swls/soal', function () {
    if (!TestSetting::isOpen('swls')) {
        return Inertia::render('TestClosed', [
            'title' => 'Tes Dimensi Kepuasan Hidup Ditutup',
            'message' => 'Tes Dimensi Kepuasan Hidup sementara tidak menerima jawaban. Silakan coba lagi nanti.',
        ]);
    }

    return Inertia::render('slsw');
});

// Endpoint kirim hasil tes
Route::post('/tes/swls/submit', [TesSwlsController::class, 'store']);
Route::get('/hasil/swls', function () {
    return Inertia::render('hasilswls');
});

Route::get('/tes/srq20', function () {
    if (!TestSetting::isOpen('srq20')) {
        return Inertia::render('TestClosed', [
            'title' => 'Tes Kenali Kesehatan Mentalmu Ditutup',
            'message' => 'Tes Kenali Kesehatan Mentalmu sementara tidak menerima jawaban. Silakan coba lagi nanti.',
        ]);
    }

    return Inertia::render('IdentitasSrq20');
});

// Halaman soal
Route::get('/tes/srq20/soal', function () {
    if (!TestSetting::isOpen('srq20')) {
        return Inertia::render('TestClosed', [
            'title' => 'Tes Kenali Kesehatan Mentalmu Ditutup',
            'message' => 'Tes Kenali Kesehatan Mentalmu sementara tidak menerima jawaban. Silakan coba lagi nanti.',
        ]);
    }

    return Inertia::render('srq20');
});

// Endpoint kirim hasil tes
Route::post('/tes/srq20/submit', [TesSrq20Controller::class, 'store']);
Route::get('/hasil/srq20', function () {
    return Inertia::render('hasilsrq20');
});

Route::get('/tes/kecerdasan-majemuk', function () {
    if (!TestSetting::isOpen('kecerdasan-majemuk')) {
        return Inertia::render('TestClosed', [
            'title' => 'Tes Kecerdasan Majemuk Ditutup',
            'message' => 'Tes Kecerdasan Majemuk sementara tidak menerima jawaban. Silakan coba lagi nanti.',
        ]);
    }

    return Inertia::render('IdentitasKecerdasanMajemuk');
})->name('tes.kecerdasan-majemuk');

Route::get('/tes/kecerdasan-majemuk/soal', function () {
    if (!TestSetting::isOpen('kecerdasan-majemuk')) {
        return Inertia::render('TestClosed', [
            'title' => 'Tes Kecerdasan Majemuk Ditutup',
            'message' => 'Tes Kecerdasan Majemuk sementara tidak menerima jawaban. Silakan coba lagi nanti.',
        ]);
    }

    return Inertia::render('KecerdasanMajemuk');
})->name('tes.kecerdasan-majemuk.soal');

Route::post('/tes/kecerdasan-majemuk/submit', [TesKecerdasanMajemukController::class, 'store'])->name('tes.kecerdasan-majemuk.submit');

Route::get('/hasil/kecerdasan-majemuk/{kode}', [TesKecerdasanMajemukController::class, 'showResults'])->name('hasil.kecerdasan-majemuk');

Route::get('/tes/identifikasi-masalah/soal', function () {
    if (!TestSetting::isOpen('identifikasi-masalah')) {
        return Inertia::render('TestClosed', [
            'title' => 'Tes Identifikasi Masalah Mahasiswa Ditutup',
            'message' => 'Tes Identifikasi Masalah Mahasiswa sementara tidak menerima jawaban. Silakan coba lagi nanti.',
        ]);
    }

    return Inertia::render('IdentifikasiMasalah');
})->name('tes.identifikasi-masalah.soal');

Route::post('/tes/identifikasi-masalah/submit', [\App\Http\Controllers\TesImmController::class, 'store']);

Route::get('/tes/identifikasi-masalah/{group_slug?}/{faculty_slug?}', function ($group_slug = null, $faculty_slug = null) {
    if (!TestSetting::isOpen('identifikasi-masalah')) {
        return Inertia::render('TestClosed', [
            'title' => 'Tes Identifikasi Masalah Mahasiswa Ditutup',
            'message' => 'Tes Identifikasi Masalah Mahasiswa sementara tidak menerima jawaban. Silakan coba lagi nanti.',
        ]);
    }

    $prefilledGroup = null;
    $prefilledFaculty = null;

    if ($group_slug) {
        $group = \App\Models\ImmGroup::where('slug', $group_slug)->first();
        if (!$group || !$group->is_active) {
            return Inertia::render('TestClosed', [
                'title' => 'Pengisian Formulir Tidak Tersedia',
                'message' => 'Kelompok / kampus ini saat ini sedang dinonaktifkan atau belum menerima respon pengisian data. Silakan hubungi pengelola.',
            ]);
        }

        $group->load(['faculties' => function ($query) {
            $query->where('is_active', true)->with(['prodis' => function ($q) {
                $q->where('is_active', true);
            }]);
        }]);

        $prefilledGroup = $group;

        if ($faculty_slug) {
            $faculty = \App\Models\ImmFaculty::where('imm_group_id', $group->id)
                ->where('slug', $faculty_slug)
                ->first();
            if (!$faculty || !$faculty->is_active) {
                return Inertia::render('TestClosed', [
                    'title' => 'Pengisian Formulir Tidak Tersedia',
                    'message' => 'Fakultas ini saat ini sedang dinonaktifkan atau belum menerima respon pengisian data. Silakan hubungi pengelola.',
                ]);
            }
            $faculty->load(['prodis' => function ($q) {
                $q->where('is_active', true);
            }]);
            $prefilledFaculty = $faculty;
        }
    }

    $groups = \App\Models\ImmGroup::where('is_active', true)->orderBy('name')->get();

    return Inertia::render('IdentitasIdentifikasiMasalah', [
        'groups' => $groups,
        'prefilledGroup' => $prefilledGroup,
        'prefilledFaculty' => $prefilledFaculty,
    ]);
})->name('tes.identifikasi-masalah');

Route::get('/hasil/identifikasi-masalah', function () {
    return Inertia::render('HasilIdentifikasiMasalah');
})->name('hasil.identifikasi-masalah');

Route::get('/laporan-imm/{group_slug}', [\App\Http\Controllers\PublicImmReportController::class, 'show'])->name('public.imm.report');
Route::get('/laporan-imm/{group_slug}/export', [\App\Http\Controllers\PublicImmReportController::class, 'export'])->name('public.imm.export');

// Developer Route
Route::get('/fikri', function () {
    $content = \App\Models\SiteSetting::where('key', 'developer_profile_content')->value('value');
    $photo = \App\Models\SiteSetting::where('key', 'developer_profile_photo')->value('value');
    return Inertia::render('Fikri', [
        'aboutContent' => $content,
        'photo' => $photo ? asset('storage/' . $photo) : null,
    ]);
});

// Admin Routes

Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/', function () {
        return redirect()->route('admin.dashboard');
    });
    Route::get('/login', [AdminAuthController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [AdminAuthController::class, 'login']);

    Route::middleware('auth')->group(function () {
        Route::post('/logout', [AdminAuthController::class, 'logout'])->name('logout');
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

        // CRUD routes
        Route::post('team-members/bulk-delete', [AdminTeamMemberController::class, 'bulkDestroy'])->name('team-members.bulk-delete');
        Route::post('team-members/reorder', [AdminTeamMemberController::class, 'reorder'])->name('team-members.reorder');
        Route::resource('team-members', AdminTeamMemberController::class);
        Route::resource('test-settings', AdminTestSettingController::class);
        Route::resource('site-settings', AdminSiteSettingController::class);
        
        // Tes Management Routes — explicit routes FIRST to avoid {id} wildcard conflicts
        Route::get('gaya-belajar/export/excel', [AdminGayaBelajarController::class, 'export'])->name('gaya-belajar.export');
        Route::post('gaya-belajar/bulk-delete', [AdminGayaBelajarController::class, 'bulkDestroy'])->name('gaya-belajar.bulk-delete');
        Route::resource('gaya-belajar', AdminGayaBelajarController::class)->only(['index', 'show', 'destroy']);
        
        Route::get('kecerdasan-majemuk/export/excel', [AdminKecerdasanMajemukController::class, 'export'])->name('kecerdasan-majemuk.export');
        Route::post('kecerdasan-majemuk/bulk-delete', [AdminKecerdasanMajemukController::class, 'bulkDestroy'])->name('kecerdasan-majemuk.bulk-delete');
        Route::resource('kecerdasan-majemuk', AdminKecerdasanMajemukController::class)->only(['index', 'destroy', 'show']);
        
        Route::get('panas/export/excel', [AdminPanasController::class, 'export'])->name('panas.export');
        Route::post('panas/bulk-delete', [AdminPanasController::class, 'bulkDestroy'])->name('panas.bulk-delete');
        Route::resource('panas', AdminPanasController::class)->only(['index', 'show', 'destroy']);
        
        Route::get('srq20/export/excel', [AdminSrq20Controller::class, 'export'])->name('srq20.export');
        Route::post('srq20/bulk-delete', [AdminSrq20Controller::class, 'bulkDestroy'])->name('srq20.bulk-delete');
        Route::resource('srq20', AdminSrq20Controller::class)->only(['index', 'show', 'destroy']);
        
        Route::get('swls/export/excel', [AdminSwlsController::class, 'export'])->name('swls.export');
        Route::post('swls/bulk-delete', [AdminSwlsController::class, 'bulkDestroy'])->name('swls.bulk-delete');
        Route::resource('swls', AdminSwlsController::class)->only(['index', 'show', 'destroy']);
        
        Route::get('imm/export/excel', [\App\Http\Controllers\AdminImmController::class, 'export'])->name('imm.export');
        Route::post('imm/bulk-delete', [\App\Http\Controllers\AdminImmController::class, 'bulkDestroy'])->name('imm.bulk-delete');
        Route::post('imm/clear-all', [\App\Http\Controllers\AdminImmController::class, 'clearAll'])->name('imm.clear-all');
        Route::resource('imm', \App\Http\Controllers\AdminImmController::class)->only(['index', 'show', 'destroy']);
        
        Route::get('imm-groups/{imm_group}/export', [\App\Http\Controllers\AdminImmGroupController::class, 'export'])->name('imm-groups.export');
        Route::resource('imm-groups', \App\Http\Controllers\AdminImmGroupController::class)->except(['create', 'edit']);
        Route::post('imm-groups/{imm_group}/faculties', [\App\Http\Controllers\AdminImmFacultyController::class, 'store'])->name('imm-faculties.store');
        Route::put('imm-faculties/{imm_faculty}', [\App\Http\Controllers\AdminImmFacultyController::class, 'update'])->name('imm-faculties.update');
        Route::delete('imm-faculties/{imm_faculty}', [\App\Http\Controllers\AdminImmFacultyController::class, 'destroy'])->name('imm-faculties.destroy');
        Route::patch('imm-faculties/{imm_faculty}/toggle', [\App\Http\Controllers\AdminImmFacultyController::class, 'toggle'])->name('imm-faculties.toggle');

        Route::post('imm-faculties/{imm_faculty}/prodis', [\App\Http\Controllers\AdminImmProdiController::class, 'store'])->name('imm-prodis.store');
        Route::put('imm-prodis/{imm_prodi}', [\App\Http\Controllers\AdminImmProdiController::class, 'update'])->name('imm-prodis.update');
        Route::delete('imm-prodis/{imm_prodi}', [\App\Http\Controllers\AdminImmProdiController::class, 'destroy'])->name('imm-prodis.destroy');
        // Posts
        Route::post('posts/bulk-delete', [PostController::class, 'bulkDestroy'])->name('posts.bulk-delete');
        Route::resource('posts', PostController::class);

        // Modules
        Route::post('moduls/bulk-delete', [ModulController::class, 'bulkDestroy'])->name('moduls.bulk-delete');
        Route::resource('moduls', ModulController::class);

        // Web Lainnya
        Route::resource('linked-websites', LinkedWebsiteController::class)->only(['index', 'store', 'update', 'destroy']);

        // Developer Profile Content
        Route::get('developer-profile', [\App\Http\Controllers\AdminDeveloperProfileController::class, 'edit'])->name('developer-profile.edit');
        Route::post('developer-profile', [\App\Http\Controllers\AdminDeveloperProfileController::class, 'update'])->name('developer-profile.update');

        // Konseling
        Route::get('konseling/export/excel', [\App\Http\Controllers\AdminCounselingController::class, 'export'])->name('konseling.export');
        Route::post('konseling/bulk-delete', [\App\Http\Controllers\AdminCounselingController::class, 'bulkDestroy'])->name('konseling.bulk-delete');
        Route::post('konseling/{konseling}/approve', [\App\Http\Controllers\AdminCounselingController::class, 'approve'])->name('konseling.approve');
        Route::delete('konseling/{konseling}', [\App\Http\Controllers\AdminCounselingController::class, 'destroy'])->name('konseling.destroy');
        Route::resource('konseling', \App\Http\Controllers\AdminCounselingController::class)->only(['index', 'update']);

        Route::resource('fakultas', \App\Http\Controllers\AdminFakultasController::class)->except(['create', 'show', 'edit']);

        Route::get('konseling-info', [\App\Http\Controllers\AdminKonselingInfoController::class, 'edit'])->name('konseling-info.edit');
        Route::post('konseling-info', [\App\Http\Controllers\AdminKonselingInfoController::class, 'update'])->name('konseling-info.update');

        // Tentang Kami (Visi Misi, Struktur Organisasi, Kontak)
        Route::get('tentang-kami', [\App\Http\Controllers\AdminTentangKamiController::class, 'edit'])->name('tentang-kami.edit');
        Route::post('tentang-kami', [\App\Http\Controllers\AdminTentangKamiController::class, 'update'])->name('tentang-kami.update');
        Route::post('tentang-kami/delete-image', [\App\Http\Controllers\AdminTentangKamiController::class, 'deleteImage'])->name('tentang-kami.delete-image');
    });
});
