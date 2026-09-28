<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== DYNAMIC TESTS ===" . PHP_EOL;
$tests = DB::table('dynamic_tests')->get();
foreach ($tests as $t) {
    $qCount = DB::table('dynamic_test_questions')->where('dynamic_test_id', $t->id)->count();
    $cCount = DB::table('dynamic_test_categories')->where('dynamic_test_id', $t->id)->count();
    echo "  [{$t->slug}] {$t->title} | Questions: $qCount | Categories: $cCount" . PHP_EOL;
}

echo PHP_EOL . "=== TEST SETTINGS ===" . PHP_EOL;
$settings = DB::table('test_settings')->get();
foreach ($settings as $s) {
    $open = $s->is_open ? 'OPEN' : 'CLOSED';
    echo "  [{$s->slug}] {$s->name} | $open" . PHP_EOL;
}

echo PHP_EOL . "=== LEGACY ASSESSMENT TABLES ===" . PHP_EOL;
$legacyTables = ['gaya_belajars', 'kecerdasan_majemuks', 'panas', 'srq20s', 'swls'];
foreach ($legacyTables as $tbl) {
    try {
        $count = DB::table($tbl)->count();
        echo "  $tbl: $count rows" . PHP_EOL;
    } catch (\Exception $e) {
        echo "  $tbl: TABLE NOT FOUND" . PHP_EOL;
    }
}
