<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

$exclude = [
    'users',
    'fakultas',
    'migrations',
    'personal_access_tokens',
    'password_reset_tokens',
    'sessions',
    'cache',
    'cache_locks',
    'jobs',
    'job_batches',
    'failed_jobs'
];

$tables = DB::select('SHOW TABLES');
$dbName = env('DB_DATABASE');
$key = 'Tables_in_' . $dbName;

Schema::disableForeignKeyConstraints();

foreach ($tables as $table) {
    // Handling standard array/object from SHOW TABLES
    $tableName = is_object($table) ? collect($table)->first() : (is_array($table) ? array_values($table)[0] : null);

    if ($tableName && !in_array($tableName, $exclude)) {
        echo "Truncating: " . $tableName . PHP_EOL;
        DB::table($tableName)->truncate();
    }
}

Schema::enableForeignKeyConstraints();
echo "Done." . PHP_EOL;
