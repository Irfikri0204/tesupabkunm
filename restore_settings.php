<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\TestSetting;

// Slug yang dipakai di routes/web.php
$tests = [
    // Slug lama (yang dipakai oleh routes yang sudah ada)
    ['slug' => 'gayabelajar', 'name' => 'Tes Gaya Belajar (VAK)', 'is_open' => true],
    ['slug' => 'panas', 'name' => 'Tes Pola Emosi (PANAS)', 'is_open' => true],
    ['slug' => 'swls', 'name' => 'Kepuasan Hidup (SWLS)', 'is_open' => true],
    ['slug' => 'srq20', 'name' => 'Kesehatan Mental (SRQ-20)', 'is_open' => true],
    ['slug' => 'kecerdasan-majemuk', 'name' => 'Kecerdasan Majemuk', 'is_open' => true],
    // Slug baru (dari dynamic test seeder)
    ['slug' => 'gaya-belajar', 'name' => 'Tes Gaya Belajar (VAK)', 'is_open' => true],
    ['slug' => 'srq-20', 'name' => 'Kesehatan Mental (SRQ-20)', 'is_open' => true],
];

foreach ($tests as $t) {
    TestSetting::updateOrCreate(['slug' => $t['slug']], $t);
}

echo "Done. Total TestSettings: " . TestSetting::count() . PHP_EOL;
foreach (TestSetting::all() as $s) {
    echo "  [{$s->slug}] {$s->name} | " . ($s->is_open ? 'OPEN' : 'CLOSED') . PHP_EOL;
}
