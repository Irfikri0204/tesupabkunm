<?php

use App\Http\Controllers\TesGayaBelajarController;
use App\Http\Controllers\TesPanasController;
use App\Http\Controllers\TesSrq20Controller;
use App\Http\Controllers\TesSwlsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('home');
})->name('home');

Route::get('/about', function () {
    return Inertia::render('about');
})->name('about');

Route::get('/tes/gayabelajar', function () {
    return Inertia::render('IdentitasGayaBelajar');
});

// Halaman soal
Route::get('/tes/gayabelajar/soal', function () {
    return Inertia::render('gayabelajar');
});

// Endpoint kirim hasil tes
Route::post('/tes/gayabelajar/submit', [TesGayaBelajarController::class, 'store']);
Route::get('/hasil/gayabelajar', function () {
    return Inertia::render('hasilgayabelajar');
});

Route::get('/tes/panas', function () {
    return Inertia::render('IdentitasPanas');
});

// Halaman soal
Route::get('/tes/panas/soal', function () {
    return Inertia::render('panas');
});

// Endpoint kirim hasil tes
Route::post('/tes/panas/submit', [TesPanasController::class, 'store']);
Route::get('/hasil/panas', function () {
    return Inertia::render('hasilpanas');
});
Route::get('/tes/swls', function () {
    return Inertia::render('IdentitasSwls');
});

// Halaman soal
Route::get('/tes/swls/soal', function () {
    return Inertia::render('slsw');
});

// Endpoint kirim hasil tes
Route::post('/tes/swls/submit', [TesSwlsController::class, 'store']);
Route::get('/hasil/swls', function () {
    return Inertia::render('hasilswls');
});
Route::get('/tes/srq20', function () {
    return Inertia::render('IdentitasSrq20');
});

// Halaman soal
Route::get('/tes/srq20/soal', function () {
    return Inertia::render('srq20');
});

// Endpoint kirim hasil tes
Route::post('/tes/srq20/submit', [TesSrq20Controller::class, 'store']);
Route::get('/hasil/srq20', function () {
    return Inertia::render('hasilsrq20');
});