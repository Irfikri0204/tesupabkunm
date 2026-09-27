<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\SiteSetting;

$setting = SiteSetting::where('key', 'konseling_info_syarat')->first();
if ($setting) {
    $setting->value = str_replace([' dan gratis', ' gratis'], '', $setting->value);
    $setting->save();
    echo "Updated\n";
} else {
    echo "Not found\n";
}
