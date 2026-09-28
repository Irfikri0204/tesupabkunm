<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\TestSetting;

$tests = [
    ['slug' => 'gayabelajar', 'name' => 'Kenali Gaya Belajarmu', 'is_open' => true],
    ['slug' => 'panas', 'name' => 'Tes Pola Emosimu', 'is_open' => true],
    ['slug' => 'swls', 'name' => 'Dimensi Kepuasan Hidup', 'is_open' => true],
    ['slug' => 'srq20', 'name' => 'Kenali Kesehatan Mentalmu', 'is_open' => true],
    ['slug' => 'kecerdasan-majemuk', 'name' => 'Tes Kecerdasan Majemuk', 'is_open' => true],
];

foreach ($tests as $t) {
    TestSetting::updateOrCreate(['slug' => $t['slug']], $t);
}

// Remove the wrongly named ones if they exist, to avoid confusion
TestSetting::whereIn('slug', ['gaya-belajar', 'srq-20'])->delete();

echo "Done. Settings restored to match UI expectations." . PHP_EOL;
