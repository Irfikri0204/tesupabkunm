<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\DynamicTest;
use App\Models\DynamicTestIdentity;
use App\Models\DynamicTestCategory;
use App\Models\DynamicTestQuestion;
use App\Models\DynamicTestChoice;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class DynamicTestSeeder extends Seeder
{
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DynamicTest::truncate();
        DynamicTestIdentity::truncate();
        DynamicTestCategory::truncate();
        DynamicTestQuestion::truncate();
        DynamicTestChoice::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // 1. GAYA BELAJAR (VAK)
        $this->seedGayaBelajar();
        
        // 2. KECERDASAN MAJEMUK
        $this->seedKecerdasanMajemuk();
        
        // 3. TES PANAS (POLA EMOSI)
        $this->seedPanas();
        
        // 4. KESEHATAN MENTAL (SRQ-20)
        $this->seedSrq20();
        
        // 5. KEPUASAN HIDUP (SWLS)
        $this->seedSwls();
    }

    private function seedGayaBelajar()
    {
        $test = DynamicTest::create([
            'title' => 'Tes Gaya Belajar (VAK)',
            'slug' => 'gaya-belajar',
            'description' => 'Tes ini dirancang untuk mengetahui kecenderungan gaya belajar Anda apakah Visual, Auditory, atau Kinesthetic.',
            'instructions' => 'Pilihlah salah satu opsi jawaban yang paling mendeskripsikan diri Anda pada setiap situasi.',
            'tips' => 'Jawab secara spontan sesuai yang biasa Anda rasakan, bukan apa yang Anda anggap ideal.',
            'is_active' => true,
        ]);

        $this->createStandardIdentities($test);

        // Kategori (Multi-Axis)
        $categories = [
            ['name' => 'Visual', 'min_score' => 0, 'max_score' => 100, 'description' => 'Anda adalah pembelajar visual. Anda lebih mudah menyerap informasi dengan melihat gambar, diagram, atau membaca teks. Gunakan stabilo, mind-mapping, dan flashcard untuk hasil maksimal.'],
            ['name' => 'Auditory', 'min_score' => 0, 'max_score' => 100, 'description' => 'Anda adalah pembelajar auditori. Anda menyukai penjelasan lisan, diskusi, dan mendengarkan. Cobalah merekam suara saat belajar atau berdiskusi dengan teman.'],
            ['name' => 'Kinesthetic', 'min_score' => 0, 'max_score' => 100, 'description' => 'Anda adalah pembelajar kinestetik. Anda belajar melalui praktik langsung dan gerakan fisik. Lakukan eksperimen, gunakan alat peraga, atau belajarlah sambil berjalan-jalan santai.']
        ];
        foreach ($categories as $cat) {
            $test->categories()->create($cat);
        }

        // Soal
        $questions = [
            [
                'q' => 'Saat belajar untuk ujian, Anda lebih suka...',
                'c' => [
                    ['text' => 'Membaca catatan, buku teks, dan melihat diagram', 'weight' => 1, 'cat' => 'Visual'],
                    ['text' => 'Mendengarkan penjelasan orang lain atau rekaman kelas', 'weight' => 1, 'cat' => 'Auditory'],
                    ['text' => 'Berjalan-jalan sambil mengingat informasi atau praktek langsung', 'weight' => 1, 'cat' => 'Kinesthetic'],
                ]
            ],
            [
                'q' => 'Saat mengingat arah ke suatu tempat baru...',
                'c' => [
                    ['text' => 'Membayangkan peta atau rute di kepala', 'weight' => 1, 'cat' => 'Visual'],
                    ['text' => 'Mengingat petunjuk suara seperti belok kiri setelah pom bensin', 'weight' => 1, 'cat' => 'Auditory'],
                    ['text' => 'Mengikuti insting arah karena sudah pernah melewatinya', 'weight' => 1, 'cat' => 'Kinesthetic'],
                ]
            ],
            [
                'q' => 'Saat menonton film...',
                'c' => [
                    ['text' => 'Memerhatikan detail adegan dan efek visual', 'weight' => 1, 'cat' => 'Visual'],
                    ['text' => 'Lebih fokus pada dialog tokoh dan musik latar', 'weight' => 1, 'cat' => 'Auditory'],
                    ['text' => 'Terbawa suasana emosi dan ikut tegang jika film aksi', 'weight' => 1, 'cat' => 'Kinesthetic'],
                ]
            ]
        ];

        $this->createQuestionsAndChoices($test, $questions);
    }

    private function seedKecerdasanMajemuk()
    {
        $test = DynamicTest::create([
            'title' => 'Kecerdasan Majemuk',
            'slug' => 'kecerdasan-majemuk',
            'description' => 'Berdasarkan teori Howard Gardner, tes ini mengukur 9 jenis kecerdasan untuk menemukan potensi dominan Anda.',
            'instructions' => 'Skor dari 1 (Sangat Tidak Setuju) sampai 5 (Sangat Setuju).',
            'tips' => 'Jujurlah pada diri sendiri untuk menemukan potensi alami Anda.',
            'is_active' => true,
        ]);

        $this->createStandardIdentities($test);

        $categories = [
            ['name' => 'Linguistik', 'min_score' => 0, 'max_score' => 100, 'description' => 'Kecerdasan dalam mengolah kata dan bahasa. Cocok menjadi penulis, jurnalis, atau pembicara.'],
            ['name' => 'Logika-Matematika', 'min_score' => 0, 'max_score' => 100, 'description' => 'Kecerdasan menganalisis masalah logis dan matematis. Cocok untuk programmer atau ilmuwan.'],
            ['name' => 'Visual-Spasial', 'min_score' => 0, 'max_score' => 100, 'description' => 'Kecerdasan memvisualisasikan ruang dan desain. Profesi arsitek atau desainer sangat pas.'],
            ['name' => 'Kinetik-Jasmani', 'min_score' => 0, 'max_score' => 100, 'description' => 'Kecerdasan mengontrol gerak tubuh. Atlet, penari, atau ahli bedah adalah bidang yang cocok.'],
            ['name' => 'Musikal', 'min_score' => 0, 'max_score' => 100, 'description' => 'Kecerdasan terkait nada dan ritme. Potensi menjadi musisi atau komposer.'],
            ['name' => 'Interpersonal', 'min_score' => 0, 'max_score' => 100, 'description' => 'Kecerdasan memahami orang lain. Sangat cocok di bidang konseling, HR, atau manajemen.'],
            ['name' => 'Intrapersonal', 'min_score' => 0, 'max_score' => 100, 'description' => 'Kecerdasan memahami diri sendiri. Cocok sebagai filsuf, peneliti, atau psikolog.'],
            ['name' => 'Naturalis', 'min_score' => 0, 'max_score' => 100, 'description' => 'Kecerdasan mengenali flora, fauna, dan alam. Cocok di bidang biologi atau lingkungan.'],
            ['name' => 'Eksistensial', 'min_score' => 0, 'max_score' => 100, 'description' => 'Kecerdasan memikirkan makna hidup dan keberadaan.']
        ];
        foreach ($categories as $cat) { $test->categories()->create($cat); }

        // Sample Questions
        $questions = [];
        $cats = array_column($categories, 'name');
        foreach ($cats as $idx => $catName) {
            $questions[] = [
                'q' => "Saya merasa tertarik dengan aktivitas yang berkaitan dengan $catName.",
                'c' => [
                    ['text' => 'Sangat Tidak Setuju', 'weight' => 1, 'cat' => $catName],
                    ['text' => 'Tidak Setuju', 'weight' => 2, 'cat' => $catName],
                    ['text' => 'Netral', 'weight' => 3, 'cat' => $catName],
                    ['text' => 'Setuju', 'weight' => 4, 'cat' => $catName],
                    ['text' => 'Sangat Setuju', 'weight' => 5, 'cat' => $catName],
                ]
            ];
            $questions[] = [
                'q' => "Saya mudah menyerap informasi yang menggunakan pendekatan $catName.",
                'c' => [
                    ['text' => 'Sangat Tidak Setuju', 'weight' => 1, 'cat' => $catName],
                    ['text' => 'Tidak Setuju', 'weight' => 2, 'cat' => $catName],
                    ['text' => 'Netral', 'weight' => 3, 'cat' => $catName],
                    ['text' => 'Setuju', 'weight' => 4, 'cat' => $catName],
                    ['text' => 'Sangat Setuju', 'weight' => 5, 'cat' => $catName],
                ]
            ];
        }

        $this->createQuestionsAndChoices($test, $questions);
    }

    private function seedPanas()
    {
        $test = DynamicTest::create([
            'title' => 'Tes Pola Emosi (PANAS)',
            'slug' => 'panas',
            'description' => 'Positive and Negative Affect Schedule (PANAS) mengukur kecenderungan afek positif dan negatif dalam periode waktu tertentu.',
            'instructions' => 'Berikan nilai sejauh mana Anda merasakan emosi berikut selama 1 minggu terakhir.',
            'tips' => 'Jawab dengan insting pertama Anda.',
            'is_active' => true,
        ]);

        $this->createStandardIdentities($test);

        $categories = [
            ['name' => 'Afek Positif Tinggi', 'min_score' => 35, 'max_score' => 50, 'description' => 'Anda cenderung merasa antusias, aktif, dan waspada. Ini adalah energi positif yang sangat baik.'],
            ['name' => 'Afek Positif Sedang / Cukup', 'min_score' => 20, 'max_score' => 34, 'description' => 'Emosi Anda seimbang. Kadang merasa semangat, kadang biasa saja.'],
            ['name' => 'Afek Negatif Tinggi', 'min_score' => 0, 'max_score' => 19, 'description' => 'Anda mungkin sedang mengalami banyak tekanan, distres, atau kecemasan akhir-akhir ini.'],
        ];
        foreach ($categories as $cat) { $test->categories()->create($cat); }

        $emosi = ['Tertarik', 'Distres', 'Bersemangat', 'Kesal', 'Kuat', 'Merasa Bersalah', 'Takut', 'Memusuhi', 'Antusias', 'Bangga'];
        $questions = [];
        foreach ($emosi as $em) {
            $questions[] = [
                'q' => "Sejauh mana Anda merasa $em?",
                'c' => [
                    ['text' => 'Sangat Sedikit', 'weight' => 1, 'cat' => null],
                    ['text' => 'Sedikit', 'weight' => 2, 'cat' => null],
                    ['text' => 'Sedang', 'weight' => 3, 'cat' => null],
                    ['text' => 'Cukup Banyak', 'weight' => 4, 'cat' => null],
                    ['text' => 'Sangat Banyak', 'weight' => 5, 'cat' => null],
                ]
            ];
        }

        $this->createQuestionsAndChoices($test, $questions);
    }

    private function seedSrq20()
    {
        $test = DynamicTest::create([
            'title' => 'Kesehatan Mental (SRQ-20)',
            'slug' => 'srq-20',
            'description' => 'Self-Reporting Questionnaire (SRQ-20) untuk mendeteksi potensi masalah kesehatan mental dasar.',
            'instructions' => 'Jawab YA jika Anda mengalami hal ini dalam 30 hari terakhir.',
            'tips' => 'Kejujuran adalah kunci dari identifikasi awal.',
            'is_active' => true,
        ]);

        $this->createStandardIdentities($test);

        $categories = [
            ['name' => 'Kondisi Mental Baik', 'min_score' => 0, 'max_score' => 5, 'description' => 'Secara umum kesehatan mental Anda dalam batas normal dan stabil.'],
            ['name' => 'Indikasi Masalah Mental (Perlu Perhatian)', 'min_score' => 6, 'max_score' => 20, 'description' => 'Anda mungkin sedang mengalami distres psikologis. Sangat disarankan untuk berkonsultasi dengan layanan konseling UPA BK UNM.']
        ];
        foreach ($categories as $cat) { $test->categories()->create($cat); }

        $pertanyaan = [
            'Apakah Anda sering merasa sakit kepala?',
            'Apakah nafsu makan Anda buruk?',
            'Apakah Anda sulit tidur?',
            'Apakah Anda mudah merasa takut?',
            'Apakah Anda merasa cemas, tegang, atau khawatir?',
            'Apakah tangan Anda gemetar?',
            'Apakah Anda mengalami gangguan pencernaan?',
            'Apakah Anda sulit berpikir jernih?',
            'Apakah Anda merasa tidak bahagia?',
            'Apakah Anda lebih sering menangis?'
        ];

        $questions = [];
        foreach ($pertanyaan as $p) {
            $questions[] = [
                'q' => $p,
                'c' => [
                    ['text' => 'Ya', 'weight' => 1, 'cat' => null],
                    ['text' => 'Tidak', 'weight' => 0, 'cat' => null]
                ]
            ];
        }
        $this->createQuestionsAndChoices($test, $questions);
    }

    private function seedSwls()
    {
        $test = DynamicTest::create([
            'title' => 'Kepuasan Hidup (SWLS)',
            'slug' => 'swls',
            'description' => 'Satisfaction with Life Scale (SWLS) mengukur kepuasan hidup global seseorang.',
            'instructions' => 'Tunjukkan tingkat persetujuan Anda dengan setiap pernyataan berikut.',
            'tips' => 'Jawab secara umum sesuai dengan kehidupan yang Anda jalani saat ini.',
            'is_active' => true,
        ]);

        $this->createStandardIdentities($test);

        $categories = [
            ['name' => 'Sangat Tidak Puas', 'min_score' => 5, 'max_score' => 9, 'description' => 'Anda sangat tidak puas dengan hidup Anda saat ini.'],
            ['name' => 'Tidak Puas', 'min_score' => 10, 'max_score' => 14, 'description' => 'Anda merasa banyak hal yang belum terpenuhi.'],
            ['name' => 'Sedikit Tidak Puas', 'min_score' => 15, 'max_score' => 19, 'description' => 'Terdapat beberapa area kehidupan yang kurang memuaskan.'],
            ['name' => 'Netral', 'min_score' => 20, 'max_score' => 20, 'description' => 'Anda merasa netral, tidak puas namun tidak juga kecewa.'],
            ['name' => 'Sedikit Puas', 'min_score' => 21, 'max_score' => 25, 'description' => 'Secara umum, hidup Anda berjalan cukup baik.'],
            ['name' => 'Puas', 'min_score' => 26, 'max_score' => 30, 'description' => 'Anda merasa puas dengan berbagai aspek kehidupan.'],
            ['name' => 'Sangat Puas', 'min_score' => 31, 'max_score' => 35, 'description' => 'Anda sangat mencintai hidup Anda dan merasa telah mencapai banyak hal yang diinginkan.']
        ];
        foreach ($categories as $cat) { $test->categories()->create($cat); }

        $pertanyaan = [
            'Dalam hampir semua hal, hidup saya mendekati ideal.',
            'Kondisi hidup saya sangat baik.',
            'Saya puas dengan hidup saya.',
            'Sejauh ini saya telah mendapatkan hal-hal penting yang saya inginkan dalam hidup.',
            'Jika saya dapat mengulang hidup saya kembali, hampir tidak ada hal yang akan saya ubah.'
        ];

        $questions = [];
        foreach ($pertanyaan as $p) {
            $questions[] = [
                'q' => $p,
                'c' => [
                    ['text' => 'Sangat Tidak Setuju', 'weight' => 1, 'cat' => null],
                    ['text' => 'Tidak Setuju', 'weight' => 2, 'cat' => null],
                    ['text' => 'Agak Tidak Setuju', 'weight' => 3, 'cat' => null],
                    ['text' => 'Netral', 'weight' => 4, 'cat' => null],
                    ['text' => 'Agak Setuju', 'weight' => 5, 'cat' => null],
                    ['text' => 'Setuju', 'weight' => 6, 'cat' => null],
                    ['text' => 'Sangat Setuju', 'weight' => 7, 'cat' => null],
                ]
            ];
        }
        $this->createQuestionsAndChoices($test, $questions);
    }

    private function createStandardIdentities($test)
    {
        $test->identities()->create([
            'field_name' => 'nama_lengkap',
            'field_label' => 'Nama Lengkap',
            'field_type' => 'text',
            'is_required' => true,
        ]);
        $test->identities()->create([
            'field_name' => 'asal_instansi',
            'field_label' => 'Asal Instansi/Sekolah',
            'field_type' => 'text',
            'is_required' => true,
        ]);
    }

    private function createQuestionsAndChoices($test, $questions)
    {
        foreach ($questions as $qData) {
            $q = $test->questions()->create(['question_text' => $qData['q']]);
            foreach ($qData['c'] as $cData) {
                $q->choices()->create([
                    'choice_text' => $cData['text'],
                    'weight' => $cData['weight'],
                    'category_name' => $cData['cat'],
                ]);
            }
        }
    }
}
