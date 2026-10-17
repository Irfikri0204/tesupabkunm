/**
 * IMM Scoring Engine
 * Identifikasi Masalah Mahasiswa — full scoring, classification, and advice logic.
 */

// ─── INDICATOR DEFINITIONS ─────────────────────────────────────────────────

export interface Indicator {
    code: string;
    name: string;
    items: number[];
}

export interface Section {
    index: number;
    title: string;
    indicators: Indicator[];
}

export const INDICATOR_MAP: Section[] = [
    {
        index: 0, title: "Bidang Pribadi",
        indicators: [
            { code: "P1", name: "Kesehatan fisik", items: [1, 2, 3] },
            { code: "P2", name: "Perasaan", items: [4, 5, 6] },
            { code: "P3", name: "Kepercayaan diri", items: [7, 8, 9] },
            { code: "P4", name: "Spiritual dan makna hidup", items: [10, 11, 12] },
            { code: "P5", name: "Keselamatan diri", items: [13, 14, 15] },
        ]
    },
    {
        index: 1, title: "Bidang Sosial",
        indicators: [
            { code: "S1", name: "Pergaulan", items: [16, 17, 18] },
            { code: "S2", name: "Pertemanan dan penyesuaian diri", items: [19, 20, 21] },
            { code: "S3", name: "Hubungan dengan keluarga", items: [22, 23, 24] },
            { code: "S4", name: "Perundungan dan kekerasan", items: [25, 26, 27] },
            { code: "S5", name: "Kegiatan kampus dan organisasi", items: [28, 29, 30] },
        ]
    },
    {
        index: 2, title: "Bidang Belajar",
        indicators: [
            { code: "B1", name: "Pengaturan waktu", items: [31, 32, 33] },
            { code: "B2", name: "Semangat dan cara belajar", items: [34, 35, 36] },
            { code: "B3", name: "Nilai dan ujian", items: [37, 38, 39] },
            { code: "B4", name: "Risiko putus kuliah", items: [40, 41, 42] },
            { code: "B5", name: "Kejujuran akademik", items: [43, 44, 45] },
        ]
    },
    {
        index: 3, title: "Bidang Karier",
        indicators: [
            { code: "K1", name: "Mengenal diri dan jurusan", items: [46, 47, 48] },
            { code: "K2", name: "Rencana studi", items: [49, 50, 51] },
            { code: "K3", name: "Pilihan karier", items: [52, 53, 54] },
            { code: "K4", name: "Kesiapan kerja", items: [55, 56, 57] },
            { code: "K5", name: "Pekerjaan dan masa depan", items: [58, 59, 60] },
        ]
    },
    {
        index: 4, title: "Bidang Lainnya (Perilaku Berisiko)",
        indicators: [
            { code: "R1", name: "Gawai dan dunia digital", items: [61, 62, 63] },
            { code: "R2", name: "Judi dan pinjaman online", items: [64, 65, 66] },
            { code: "R3", name: "Keuangan", items: [67, 68, 69] },
            { code: "R4", name: "Narkoba, alkohol, dan rokok", items: [70, 71, 72] },
            { code: "R5", name: "Seksualitas dan identitas diri", items: [73, 74, 75] },
        ]
    },
];

// ─── SCORE HELPERS ──────────────────────────────────────────────────────────

type Answers = Record<number, number>;

/** Sum answers for a list of item numbers */
function sumItems(answers: Answers, items: number[]): number {
    return items.reduce((acc, i) => acc + (answers[i] ?? 0), 0);
}

/** Classify a section score (0-45) */
export function classifySectionScore(score: number): 'Baik' | 'Perlu Perhatian' | 'Perlu Pendampingan' {
    if (score <= 15) return 'Baik';
    if (score <= 30) return 'Perlu Perhatian';
    return 'Perlu Pendampingan';
}

/** Classify a total score (0-225) */
export function classifyTotalScore(score: number): 'Baik' | 'Perlu Perhatian' | 'Perlu Bantuan' {
    if (score <= 75) return 'Baik';
    if (score <= 150) return 'Perlu Perhatian';
    return 'Perlu Bantuan';
}

/** Classify an indicator score (0-9) */
export function classifyIndicatorScore(score: number): 'Baik' | 'Perlu Perhatian' | 'Perlu Pendampingan' {
    if (score <= 3) return 'Baik';
    if (score <= 6) return 'Perlu Perhatian';
    return 'Perlu Pendampingan';
}

// ─── MAIN COMPUTATION ───────────────────────────────────────────────────────

export interface IndicatorResult {
    code: string;
    name: string;
    items: number[];
    score: number;
    classification: string;
}

export interface SectionResult {
    index: number;
    title: string;
    score: number;
    classification: string;
    indicators: IndicatorResult[];
}

export interface CriticalItem {
    items: number[];
    condition: string;
    triggered: boolean;
    messageForStudent: string;
    actionForCounselor: string;
}

export interface DropoutRisk {
    score: number;
    rawClassification: string;
    finalClassification: string;
    adjustedUp: boolean;
    adjustReason: string;
    meaning: string;
    actions: string[];
}

export interface IMMResult {
    sections: SectionResult[];
    totalScore: number;
    totalClassification: string;
    dropoutRisk: DropoutRisk;
    criticalItems: CriticalItem[];
    conclusion: string;
    conclusionMessage: string;
    conclusionAction: string;
    conclusionReasons: string[];
    sectionAdvice: SectionAdvice[];
    indicatorSuggestions: IndicatorSuggestion[];
}

export interface SectionAdvice {
    title: string;
    score: number;
    classification: string;
    meaning: string;
    actions: string[];
    contact: string;
}

export interface IndicatorSuggestion {
    code: string;
    name: string;
    score: number;
    suggestion: string;
}

// ─── SECTION ADVICE (Tabel Keputusan A) ─────────────────────────────────────

interface AdviceEntry {
    classification: string;
    meaning: string;
    actions: string[];
    contact: string;
}

const SECTION_ADVICE_DATA: Record<string, AdviceEntry[]> = {
    "Bidang Pribadi": [
        {
            classification: "Baik",
            meaning: "Kondisi pribadi Anda baik. Kesehatan, perasaan, dan kepercayaan diri Anda terjaga.",
            actions: [
                "Tidur cukup, makan teratur, dan rutin berolahraga.",
                "Tetap luangkan waktu untuk ibadah.",
                "Ikuti kegiatan pengembangan diri di kampus."
            ],
            contact: "UPA BK bila ingin"
        },
        {
            classification: "Perlu Perhatian",
            meaning: "Ada beberapa masalah pribadi yang cukup sering Anda alami. Hal ini wajar dan dapat diatasi.",
            actions: [
                "Atur jam tidur dan jam makan.",
                "Tarik napas dalam-dalam saat merasa tertekan.",
                "Ceritakan perasaan Anda kepada orang yang Anda percaya.",
                "Ikuti kelas kelompok di UPA BK."
            ],
            contact: "UPA BK"
        },
        {
            classification: "Perlu Pendampingan",
            meaning: "Banyak masalah pribadi yang sering Anda alami. Ini dapat mengganggu kuliah Anda. Anda tidak perlu menghadapinya sendiri.",
            actions: [
                "Buat janji bertemu konselor di UPA BK.",
                "Periksakan keluhan kesehatan ke klinik kampus.",
                "Bila merasa sangat berat, hubungi Healing119."
            ],
            contact: "UPA BK; klinik kampus"
        }
    ],
    "Bidang Sosial": [
        {
            classification: "Baik",
            meaning: "Kehidupan sosial Anda baik. Anda punya teman, dekat dengan keluarga, dan merasa aman.",
            actions: [
                "Jaga pertemanan yang saling mendukung.",
                "Jaga komunikasi dengan keluarga.",
                "Ikuti organisasi sesuai minat Anda."
            ],
            contact: "UPA BK bila ingin"
        },
        {
            classification: "Perlu Perhatian",
            meaning: "Ada beberapa masalah sosial yang cukup sering Anda alami, misalnya sulit bergaul, kesepian, maupun kurang dekat dengan keluarga.",
            actions: [
                "Mulailah menyapa dan berkenalan dengan satu teman baru.",
                "Ikuti kelompok atau komunitas sesuai minat.",
                "Bicarakan keinginan Anda kepada orang tua dengan tenang.",
                "Ikuti kelas keterampilan bergaul di UPA BK."
            ],
            contact: "UPA BK"
        },
        {
            classification: "Perlu Pendampingan",
            meaning: "Banyak masalah sosial yang sering Anda alami, seperti kesepian, masalah keluarga, tekanan, maupun kekerasan. Anda berhak merasa aman.",
            actions: [
                "Buat janji bertemu konselor di UPA BK.",
                "Laporkan perundungan dan kekerasan ke Satgas PPKPT. Kerahasiaan Anda dijaga.",
                "Minta konselor membantu memperbaiki hubungan dengan keluarga."
            ],
            contact: "UPA BK; Satgas PPKPT"
        }
    ],
    "Bidang Belajar": [
        {
            classification: "Baik",
            meaning: "Kegiatan belajar Anda baik. Anda mampu mengatur waktu dan belajar dengan jujur.",
            actions: [
                "Pertahankan cara belajar Anda.",
                "Pasang target nilai yang lebih tinggi.",
                "Bantu teman yang kesulitan belajar."
            ],
            contact: "UPA BK bila ingin"
        },
        {
            classification: "Perlu Perhatian",
            meaning: "Ada beberapa masalah belajar yang cukup sering Anda alami, misalnya menunda tugas, kurang semangat, maupun cemas saat ujian.",
            actions: [
                "Buat jadwal belajar setiap minggu.",
                "Kerjakan tugas sejak hari pertama diberikan.",
                "Jauhkan gawai saat belajar.",
                "Beranikan diri bertanya kepada dosen."
            ],
            contact: "Dosen PA; UPA BK"
        },
        {
            classification: "Perlu Pendampingan",
            meaning: "Banyak masalah belajar yang sering Anda alami. Bila dibiarkan, kuliah bisa terhambat.",
            actions: [
                "Segera temui konselor di UPA BK.",
                "Bicarakan rencana kuliah dengan dosen PA.",
                "Kerjakan tugas sendiri. Minta bantuan bila kesulitan."
            ],
            contact: "UPA BK; Dosen PA"
        }
    ],
    "Bidang Karier": [
        {
            classification: "Baik",
            meaning: "Rencana karier Anda baik. Anda mengenal diri dan tahu arah masa depan.",
            actions: [
                "Mulailah mengumpulkan pengalaman kerja.",
                "Ikuti magang, lomba, dan pelatihan.",
                "Kenali alumni di bidang yang Anda minati."
            ],
            contact: "Pusat Karier bila ingin"
        },
        {
            classification: "Perlu Perhatian",
            meaning: "Ada beberapa masalah karier yang cukup sering Anda alami, misalnya bingung memilih pekerjaan maupun ragu dengan jurusan.",
            actions: [
                "Ikuti tes minat bakat di UPA BK.",
                "Susun rencana kuliah bersama dosen PA.",
                "Cari informasi lowongan dan magang di Pusat Karier."
            ],
            contact: "UPA BK; Pusat Karier"
        },
        {
            classification: "Perlu Pendampingan",
            meaning: "Banyak masalah karier yang sering Anda alami, seperti bingung arah masa depan maupun merasa salah jurusan.",
            actions: [
                "Buat janji konseling karier di UPA BK.",
                "Bicarakan kecocokan jurusan dengan dosen PA.",
                "Kunjungi Pusat Karier untuk pelatihan kerja."
            ],
            contact: "UPA BK; Dosen PA; Pusat Karier"
        }
    ],
    "Bidang Lainnya (Perilaku Berisiko)": [
        {
            classification: "Baik",
            meaning: "Anda mampu menjaga diri dan mengatur uang dengan baik. Tidak ada masalah berarti di bidang ini.",
            actions: [
                "Tetap batasi waktu bermain gawai.",
                "Hati-hati dengan tawaran judi online dan pinjaman online.",
                "Ajak teman menjauhi narkoba."
            ],
            contact: "UPA BK bila ingin"
        },
        {
            classification: "Perlu Perhatian",
            meaning: "Ada beberapa hal yang cukup sering mengganggu Anda, misalnya gawai, masalah uang, kebiasaan merokok, maupun perasaan bingung tentang diri sendiri.",
            actions: [
                "Batasi waktu bermain gawai setiap hari.",
                "Catat uang masuk dan uang keluar setiap bulan.",
                "Jangan meminjam lewat pinjaman online.",
                "Ceritakan hal yang membingungkan Anda kepada konselor UPA BK. Semuanya dijaga rahasia."
            ],
            contact: "UPA BK"
        },
        {
            classification: "Perlu Pendampingan",
            meaning: "Banyak hal yang sering mengganggu Anda di bidang ini, seperti judi online, utang, kekurangan uang, narkoba, maupun tekanan tentang diri sendiri. Semua ini bisa diatasi, dan Anda tidak perlu menghadapinya sendiri.",
            actions: [
                "Temui konselor UPA BK minggu ini. Semuanya dijaga rahasia.",
                "Tanyakan beasiswa dan keringanan UKT ke Bagian Kemahasiswaan.",
                "Bila diteror penagih utang, simpan buktinya dan lapor ke OJK (157)."
            ],
            contact: "UPA BK; Bagian Kemahasiswaan; OJK (157)"
        }
    ]
};

// ─── SARAN PER INDIKATOR (B) ────────────────────────────────────────────────

const INDICATOR_SUGGESTIONS: Record<string, string> = {
    P1: "Tidur dan makan pada jam yang sama setiap hari.",
    P2: "Saat tertekan, tarik napas dalam-dalam dan ceritakan kepada orang yang Anda percaya.",
    P3: "Tulis tiga hal baik tentang diri Anda setiap hari.",
    P4: "Luangkan waktu untuk ibadah dan kegiatan yang bermakna.",
    P5: "Anda tidak sendirian. Hari ini juga, hubungi konselor di UPA BK maupun Healing119.",
    S1: "Latih berkenalan dengan satu orang baru setiap minggu.",
    S2: "Ikuti satu komunitas sesuai minat agar punya teman bercerita.",
    S3: "Ajak orang tua bicara santai. Konselor dapat membantu Anda menyiapkannya.",
    S4: "Laporkan perundungan dan kekerasan ke Satgas PPKPT. Itu bukan salah Anda.",
    S5: "Pilih satu kegiatan yang Anda sukai dan atur waktunya dengan kuliah.",
    B1: "Bagi tugas besar menjadi bagian kecil dan kerjakan sejak awal.",
    B2: "Belajar bersama teman dan catat pertanyaan untuk dosen.",
    B3: "Ubah cara belajar Anda dan latih cara menenangkan diri sebelum ujian.",
    B4: "Segera temui dosen PA dan konselor sebelum masalah bertambah.",
    B5: "Kerjakan tugas sendiri dan tulis sumber yang Anda kutip.",
    K1: "Ikuti tes minat bakat di UPA BK.",
    K2: "Susun rencana kuliah sampai lulus bersama dosen PA.",
    K3: "Ikuti konseling karier di UPA BK.",
    K4: "Ikuti pelatihan dan magang dari Pusat Karier.",
    K5: "Atur waktu kerja sampingan agar tidak mengganggu kuliah.",
    R1: "Matikan gawai saat belajar dan jangan percaya janji untung besar di internet.",
    R2: "Hapus aplikasi judi online, jangan menambah pinjaman, dan temui konselor UPA BK. Semuanya dijaga rahasia.",
    R3: "Buat rencana pengeluaran bulanan dan tanyakan beasiswa ke Bagian Kemahasiswaan.",
    R4: "Kurangi sedikit demi sedikit. Konselor UPA BK bisa membantu Anda berhenti.",
    R5: "Perasaan bingung ini boleh dibicarakan. Konselor UPA BK siap mendengarkan tanpa menghakimi, dan semuanya dijaga rahasia.",
};

// ─── RISIKO PUTUS KULIAH (C) ────────────────────────────────────────────────

const DROPOUT_ITEMS = [37, 38, 40, 41, 42, 47, 48, 50, 67];

interface DropoutAdviceEntry {
    classification: string;
    meaning: string;
    actions: string[];
}

const DROPOUT_ADVICE: DropoutAdviceEntry[] = [
    {
        classification: "Risiko rendah",
        meaning: "Risiko putus kuliah Anda rendah. Kuliah Anda berjalan baik.",
        actions: [
            "Pertahankan kehadiran dan semangat kuliah Anda."
        ]
    },
    {
        classification: "Risiko sedang",
        meaning: "Ada beberapa tanda yang dapat menghambat kuliah Anda. Lebih baik dibicarakan sekarang.",
        actions: [
            "Temui dosen PA untuk membahas rencana kuliah.",
            "Ikuti kelas cara belajar di UPA BK."
        ]
    },
    {
        classification: "Risiko tinggi",
        meaning: "Ada banyak tanda yang dapat membuat Anda berhenti kuliah. Mari cari jalan keluarnya bersama.",
        actions: [
            "Konselor/Psikolog akan menghubungi Anda.",
            "Temui dosen PA minggu ini.",
            "Tanyakan bantuan biaya ke Bagian Kemahasiswaan bila perlu."
        ]
    }
];

// ─── BUTIR KRITIS (D) ──────────────────────────────────────────────────────

interface CriticalItemDef {
    items: number[];
    conditionFn: (answers: Answers) => boolean;
    condition: string;
    messageForStudent: string;
    actionForCounselor: string;
}

const CRITICAL_ITEM_DEFS: CriticalItemDef[] = [
    {
        items: [14, 15],
        conditionFn: (a) => [1, 2, 3].some(v => a[14] === v || a[15] === v),
        condition: "1, 2, maupun 3",
        messageForStudent: "Anda menyampaikan keinginan menyakiti diri maupun mengakhiri hidup. Perasaan ini bisa dibantu. Konselor/Psikolog akan menghubungi Anda.",
        actionForCounselor: "Hari itu juga: hubungi mahasiswa, tanyakan keselamatannya, buat rencana keselamatan, rujuk ke psikolog/psikiater. Bila bahaya segera: Healing119, IGD."
    },
    {
        items: [13],
        conditionFn: (a) => a[13] === 2 || a[13] === 3,
        condition: "2 maupun 3",
        messageForStudent: "Anda sering merasa putus asa. Perasaan ini bisa berubah. Bicarakan dengan konselor.",
        actionForCounselor: "≤ 3 hari kerja: konseling; periksa butir 14 dan 15."
    },
    {
        items: [26, 27],
        conditionFn: (a) => [1, 2, 3].some(v => a[26] === v || a[27] === v),
        condition: "1, 2, maupun 3",
        messageForStudent: "Anda mengalami kekerasan. Itu bukan salah Anda. Konselor dan Satgas PPKPT siap membantu secara rahasia.",
        actionForCounselor: "≤ 3 hari kerja: dampingi korban, informasikan Satgas PPKPT, jaga kerahasiaan."
    },
    {
        items: [42],
        conditionFn: (a) => a[42] === 2 || a[42] === 3,
        condition: "2 maupun 3",
        messageForStudent: "Anda sering berpikir untuk berhenti kuliah. Sebelum memutuskan, bicarakan dulu dengan konselor dan dosen PA.",
        actionForCounselor: "≤ 3 hari kerja: konseling akademik; hubungi dosen PA dengan izin mahasiswa."
    },
    {
        items: [64],
        conditionFn: (a) => [1, 2, 3].some(v => a[64] === v),
        condition: "1, 2, maupun 3",
        messageForStudent: "Anda bermain judi online. Konselor siap membantu Anda berhenti. Semuanya dijaga rahasia.",
        actionForCounselor: "≤ 3 hari kerja: konseling tanpa menghakimi; tanyakan utang dan pinjaman online."
    },
    {
        items: [65],
        conditionFn: (a) => a[65] === 2 || a[65] === 3,
        condition: "2 maupun 3",
        messageForStudent: "Anda sering meminjam lewat pinjaman online. Jangan menambah pinjaman dulu. Konselor bisa membantu Anda menyusun rencana melunasinya.",
        actionForCounselor: "≤ 3 hari kerja: konseling keuangan; arahkan ke Bagian Kemahasiswaan."
    },
    {
        items: [66],
        conditionFn: (a) => [1, 2, 3].some(v => a[66] === v),
        condition: "1, 2, maupun 3",
        messageForStudent: "Anda diteror penagih utang. Itu tidak dibenarkan. Simpan buktinya dan lapor ke OJK (157). Konselor siap menemani Anda.",
        actionForCounselor: "≤ 3 hari kerja: dampingi, bantu pengaduan ke OJK; periksa butir 13–15."
    },
    {
        items: [70],
        conditionFn: (a) => [1, 2, 3].some(v => a[70] === v),
        condition: "1, 2, maupun 3",
        messageForStudent: "Anda menggunakan narkoba. Konselor siap membantu Anda berhenti. Semuanya dijaga rahasia.",
        actionForCounselor: "≤ 3 hari kerja: konseling tanpa menghakimi; rujuk ke layanan kesehatan/rehabilitasi (IPWL)."
    },
    {
        items: [73, 74, 75],
        conditionFn: (a) => [73, 74, 75].some(i => a[i] === 2 || a[i] === 3),
        condition: "2 maupun 3",
        messageForStudent: "Anda sering merasa bingung maupun tertekan tentang ketertarikan seksual Anda. Perasaan ini boleh dibicarakan. Konselor UPA BK siap mendengarkan tanpa menghakimi, dan semuanya dijaga rahasia.",
        actionForCounselor: "≤ 3 hari kerja: konseling individual secara rahasia (bukan kelompok); periksa butir 13–15; lihat pedoman konselor di Subbab 6."
    },
];

// ─── CONCLUSION MESSAGES ────────────────────────────────────────────────────

interface ConclusionInfo {
    message: string;
    action: string;
}

const CONCLUSION_INFO: Record<string, ConclusionInfo> = {
    "Perlu Bantuan Segera": {
        message: "Terima kasih sudah jujur. Anda tidak sendirian. Konselor/Psikolog akan menghubungi Anda. Bila Anda merasa tidak aman sekarang, hubungi Healing119 (119 ekstensi 8) maupun IGD terdekat.",
        action: "Hubungi mahasiswa hari itu juga."
    },
    "Perlu Bantuan": {
        message: "Ada hal yang sebaiknya Anda bicarakan dengan konselor/psikolog. Konselor/Psikolog akan menghubungi Anda. Anda juga boleh langsung datang ke UPA BK.",
        action: "Konseling individual; hubungi dalam 3 hari kerja."
    },
    "Perlu Pendampingan": {
        message: "Ada hal yang sebaiknya Anda bicarakan dengan konselor/psikolog. Konselor/Psikolog akan menghubungi Anda. Anda juga boleh langsung datang ke UPA BK.",
        action: "Konseling individual; hubungi dalam 3 hari kerja."
    },
    "Perlu Perhatian": {
        message: "Ada beberapa hal yang cukup sering mengganggu Anda. Coba ikuti saran di bawah ini, dan Anda juga diundang ikut kegiatan kelompok di UPA BK.",
        action: "Undang ke kegiatan kelompok."
    },
    "Kondisi Baik": {
        message: "Secara umum kondisi Anda baik. Teruskan kebiasaan baik Anda, ya.",
        action: "Beri informasi layanan."
    }
};

// ─── COMPUTE FULL RESULT ────────────────────────────────────────────────────

export function computeIMMResult(answers: Answers, userData: any): IMMResult {
    // 1. Compute per-section & per-indicator scores
    const sections: SectionResult[] = INDICATOR_MAP.map(sec => {
        const indicators: IndicatorResult[] = sec.indicators.map(ind => {
            const score = sumItems(answers, ind.items);
            return {
                code: ind.code,
                name: ind.name,
                items: ind.items,
                score,
                classification: classifyIndicatorScore(score)
            };
        });

        const sectionScore = indicators.reduce((acc, ind) => acc + ind.score, 0);
        return {
            index: sec.index,
            title: sec.title,
            score: sectionScore,
            classification: classifySectionScore(sectionScore),
            indicators
        };
    });

    const totalScore = sections.reduce((acc, s) => acc + s.score, 0);
    const totalClassification = classifyTotalScore(totalScore);

    // 2. Dropout risk
    const dropoutRawScore = sumItems(answers, DROPOUT_ITEMS);
    let rawDropoutClass: string;
    if (dropoutRawScore <= 6) rawDropoutClass = "Risiko rendah";
    else if (dropoutRawScore <= 13) rawDropoutClass = "Risiko sedang";
    else rawDropoutClass = "Risiko tinggi";

    // Auto-tinggi if item 42 answered 2 or 3
    if (answers[42] === 2 || answers[42] === 3) {
        rawDropoutClass = "Risiko tinggi";
    }

    // Increase one level if IPK < 2.00 or cuti/tidak aktif
    let finalDropoutClass = rawDropoutClass;
    let adjustedUp = false;
    let adjustReason = '';
    const ipk = parseFloat(userData?.ipk_terakhir ?? '4.0');
    const statusSemester = userData?.status_semester_lalu ?? '';
    if (ipk < 2.0 || statusSemester === 'Cuti' || statusSemester === 'Tidak Aktif') {
        adjustedUp = true;
        adjustReason = ipk < 2.0 ? `IPK di bawah 2,00 (${ipk})` : `Status semester lalu: ${statusSemester}`;
        if (rawDropoutClass === "Risiko rendah") finalDropoutClass = "Risiko sedang";
        else if (rawDropoutClass === "Risiko sedang") finalDropoutClass = "Risiko tinggi";
        // already tinggi stays tinggi
    }

    const dropoutAdvice = DROPOUT_ADVICE.find(d => d.classification === finalDropoutClass)!;
    const dropoutRisk: DropoutRisk = {
        score: dropoutRawScore,
        rawClassification: rawDropoutClass,
        finalClassification: finalDropoutClass,
        adjustedUp,
        adjustReason,
        meaning: dropoutAdvice.meaning,
        actions: dropoutAdvice.actions
    };

    // 3. Critical items
    const criticalItems: CriticalItem[] = CRITICAL_ITEM_DEFS
        .map(def => ({
            items: def.items,
            condition: def.condition,
            triggered: def.conditionFn(answers),
            messageForStudent: def.messageForStudent,
            actionForCounselor: def.actionForCounselor
        }));

    // 4. Conclusion (sequential check — stop at first "Ya")
    let conclusion: string;
    const conclusionReasons: string[] = [];

    const item14or15critical = [1, 2, 3].some(v => answers[14] === v || answers[15] === v);
    const hasOtherCritical = criticalItems.slice(1).some(c => c.triggered);
    const hasSectionPerluPendampingan = sections.some(s => s.classification === 'Perlu Pendampingan');
    const hasIndicatorPerluPendampingan = sections.some(s => s.indicators.some(i => i.classification === 'Perlu Pendampingan'));
    const hasSectionPerluPerhatian = sections.some(s => s.classification === 'Perlu Perhatian');

    if (item14or15critical) {
        conclusion = "Perlu Bantuan Segera";
        if (answers[14] >= 1) conclusionReasons.push(`Butir 14 (menyakiti diri) dijawab ${answers[14]}`);
        if (answers[15] >= 1) conclusionReasons.push(`Butir 15 (mengakhiri hidup) dijawab ${answers[15]}`);
    } else if (hasOtherCritical || hasSectionPerluPendampingan || hasIndicatorPerluPendampingan || finalDropoutClass === "Risiko tinggi") {
        conclusion = "Perlu Pendampingan";
        if (hasOtherCritical) {
            const triggeredCriticals = criticalItems.slice(1).filter(c => c.triggered);
            triggeredCriticals.forEach(c => conclusionReasons.push(`Butir kritis ${c.items.join(', ')} terpicu`));
        }
        if (hasSectionPerluPendampingan) {
            sections.filter(s => s.classification === 'Perlu Pendampingan').forEach(s => 
                conclusionReasons.push(`${s.title} skor ${s.score} (Perlu Pendampingan)`));
        }
        if (hasIndicatorPerluPendampingan) {
            sections.forEach(s => s.indicators.filter(i => i.classification === 'Perlu Pendampingan').forEach(i =>
                conclusionReasons.push(`Indikator ${i.code} (${i.name}) skor ${i.score}`)));
        }
        if (finalDropoutClass === "Risiko tinggi") conclusionReasons.push("Risiko putus kuliah tinggi");
    } else if (hasSectionPerluPerhatian || finalDropoutClass === "Risiko sedang") {
        conclusion = "Perlu Perhatian";
        if (hasSectionPerluPerhatian) {
            sections.filter(s => s.classification === 'Perlu Perhatian').forEach(s =>
                conclusionReasons.push(`${s.title} skor ${s.score} (Perlu Perhatian)`));
        }
        if (finalDropoutClass === "Risiko sedang") conclusionReasons.push("Risiko putus kuliah sedang");
    } else {
        conclusion = "Kondisi Baik";
    }

    const conclusionInfo = CONCLUSION_INFO[conclusion];

    // 5. Section advice (Tabel Keputusan A)
    const sectionAdvice: SectionAdvice[] = sections.map(sec => {
        const adviceList = SECTION_ADVICE_DATA[sec.title];
        const entry = adviceList?.find(e => e.classification === sec.classification) ?? adviceList?.[0];
        return {
            title: sec.title,
            score: sec.score,
            classification: sec.classification,
            meaning: entry?.meaning ?? '',
            actions: entry?.actions ?? [],
            contact: entry?.contact ?? ''
        };
    });

    // 6. Indicator suggestions (only if score >= 4, max 5, sorted by highest score)
    const allIndicators = sections.flatMap(s => s.indicators);
    const indicatorSuggestions: IndicatorSuggestion[] = allIndicators
        .filter(i => i.score >= 4)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map(i => ({
            code: i.code,
            name: i.name,
            score: i.score,
            suggestion: INDICATOR_SUGGESTIONS[i.code] ?? ''
        }));

    return {
        sections,
        totalScore,
        totalClassification,
        dropoutRisk,
        criticalItems,
        conclusion,
        conclusionMessage: conclusionInfo.message,
        conclusionAction: conclusionInfo.action,
        conclusionReasons,
        sectionAdvice,
        indicatorSuggestions
    };
}
