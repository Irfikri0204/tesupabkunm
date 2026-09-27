<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Superadmin Account
        User::updateOrCreate(
            ['email' => 'superadmin@upabk.unm.ac.id'],
            [
                'name' => 'Superadmin UPA BK',
                'password' => Hash::make('superadmin123'),
            ]
        );

        // Admin Account
        User::updateOrCreate(
            ['email' => 'admin@upabk.unm.ac.id'],
            [
                'name' => 'Admin UPA BK',
                'password' => Hash::make('admin123'),
            ]
        );

        // Fikri's Account
        User::updateOrCreate(
            ['email' => 'fikrianggara72@gmail.com'],
            [
                'name' => 'Admin Fikri',
                'password' => Hash::make('password'),
            ]
        );
    }
}
