import Header from '@/Components/Header';
import LinkBack from '@/Components/LinkBack';
import { router } from '@inertiajs/react';
import { RiArrowLeftLine, RiArrowRightLine, RiCheckboxCircleLine, RiErrorWarningLine, RiHeartPulseLine } from '@remixicon/react';
import React, { useEffect, useState } from 'react';
import { computeIMMResult } from '@/utils/immScoring';
import axios from 'axios';

const SECTIONS = [
    {
        title: "Bidang Pribadi",
        items: [
            "Waktu tidur saya tidak teratur.",
            "Saya makan tidak teratur.",
            "Masalah kesehatan mengganggu kuliah saya.",
            "Saya merasa tertekan oleh tugas kuliah.",
            "Saya merasa cemas berlebihan.",
            "Saya merasa sedih dalam waktu yang lama.",
            "Saya kurang percaya diri.",
            "Saya merasa diri saya tidak berharga.",
            "Saya merasa malu dengan penampilan fisik saya.",
            "Saya merasa hidup saya tidak punya tujuan.",
            "Saya sulit menjalankan ibadah dengan teratur.",
            "Saya merasa jauh dari Tuhan.",
            "Saya merasa putus asa.",
            "Saya sengaja menyakiti diri sendiri.",
            "Saya berpikir untuk mengakhiri hidup.",
        ]
    },
    {
        title: "Bidang Sosial",
        items: [
            "Saya sulit berkenalan dengan orang baru.",
            "Saya malu berbicara di depan kelas.",
            "Saya sulit menolak ajakan teman.",
            "Saya merasa kesepian di kampus.",
            "Saya tidak punya teman untuk bercerita.",
            "Saya sulit menyesuaikan diri dengan kehidupan kampus.",
            "Saya merasa jauh dari orang tua.",
            "Orang tua menuntut terlalu banyak dari saya.",
            "Terjadi pertengkaran di rumah saya.",
            "Saya dirundung oleh orang lain.",
            "Saya mengalami pelecehan seksual.",
            "Saya mengalami kekerasan fisik.",
            "Saya enggan ikut kegiatan kampus.",
            "Kegiatan organisasi mengganggu kuliah saya.",
            "Saya mendapat tekanan dari senior.",
        ]
    },
    {
        title: "Bidang Belajar",
        items: [
            "Saya menunda-nunda tugas kuliah.",
            "Saya sulit membagi waktu antara kuliah dan kegiatan lain.",
            "Saya terlambat mengumpulkan tugas.",
            "Saya kehilangan semangat belajar.",
            "Saya sulit memahami materi kuliah.",
            "Saya takut bertanya kepada dosen.",
            "Saya mendapat nilai di bawah harapan saya.",
            "Saya gagal dalam ujian.",
            "Saya cemas saat menghadapi ujian.",
            "Saya tidak masuk kuliah tanpa alasan yang jelas.",
            "Saya tertinggal dalam mengikuti perkuliahan.",
            "Saya berpikir untuk berhenti kuliah.",
            "Saya menyalin tulisan orang lain tanpa menyebut sumbernya.",
            "Saya mengumpulkan tugas buatan AI sebagai karya sendiri.",
            "Saya memakai jasa joki untuk tugas kuliah.",
        ]
    },
    {
        title: "Bidang Karir",
        items: [
            "Saya bingung mengenali bakat saya.",
            "Saya merasa jurusan saya tidak sesuai dengan minat saya.",
            "Saya merasa terpaksa kuliah di jurusan ini.",
            "Saya bingung merencanakan kuliah sampai lulus.",
            "Saya ragu bisa lulus tepat waktu.",
            "Saya bingung mengatur mata kuliah yang harus saya ambil.",
            "Saya bingung ingin bekerja apa setelah lulus.",
            "Saya bingung memilih pekerjaan yang cocok untuk saya.",
            "Saya takut salah memilih karier.",
            "Saya kesulitan mendapat informasi lowongan kerja di bidang saya.",
            "Saya merasa belum punya keterampilan untuk bekerja.",
            "Saya merasa kurang punya pengalaman yang mendukung karier saya.",
            "Kerja sampingan mengganggu kuliah saya.",
            "Saya khawatir sulit mendapat pekerjaan setelah lulus.",
            "Saya kurang yakin mampu bersaing di dunia kerja.",
        ]
    },
    {
        title: "Bidang Perilaku Berisiko dan Keuangan",
        items: [
            "Saya sulit berhenti bermain gawai.",
            "Saya bermain game online sampai lupa waktu.",
            "Saya tertipu secara online.",
            "Saya bermain judi online.",
            "Saya meminjam uang lewat pinjaman online.",
            "Saya diteror oleh penagih utang.",
            "Saya khawatir tidak mampu membayar UKT.",
            "Saya kekurangan uang untuk kebutuhan sehari-hari.",
            "Saya sulit mengatur uang bulanan.",
            "Saya menggunakan narkoba.",
            "Saya minum minuman beralkohol.",
            "Saya merokok.",
            "Saya bingung dengan perasaan suka saya kepada sesama jenis.",
            "Saya bingung karena tertarik kepada laki-laki maupun perempuan.",
            "Saya merasa tertekan dengan ketertarikan seksual saya.",
        ]
    }
];

const LAYANAN_OPTIONS = [
    "Konseling individual",
    "Layanan psikolog",
    "Konseling kelompok",
    "Pendampingan kasus kekerasan",
    "Bimbingan belajar",
    "Bantuan berhenti judi online",
    "Bimbingan karier",
    "Bantuan berhenti narkoba",
    "Bantuan beasiswa",
    "Layanan kesehatan",
];

export default function IdentifikasiMasalah() {
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    // answers structure: { "1": 0, "2": 2, ... }
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [userData, setUserData] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [penutup, setPenutup] = useState({
        top_1: '',
        top_2: '',
        top_3: '',
        masalah_lain: '',
        masalah_lain_teks: '',
        butuh_layanan: '',
        layanan_dipilih: [] as string[],
        layanan_lainnya: false,
        layanan_lainnya_teks: '',
        bersedia_dihubungi: '',
        jujur: '',
    });

    useEffect(() => {
        const data = localStorage.getItem('userDataIdentifikasiMasalah');
        if (!data) {
            router.visit('/tes/identifikasi-masalah');
        } else {
            setUserData(JSON.parse(data));
        }
    }, []);

    const handleAnswer = (questionGlobalIndex: number, value: number) => {
        setAnswers(prev => ({ ...prev, [questionGlobalIndex]: value }));
    };

    const isCurrentSectionComplete = () => {
        if (currentSectionIndex === SECTIONS.length) {
            // Validate Penutup
            // Validate Penutup — top_1, top_2, top_3 are optional now
            if (!penutup.masalah_lain) return false;
            if (penutup.masalah_lain === 'Ada' && !penutup.masalah_lain_teks.trim()) return false;
            if (!penutup.butuh_layanan) return false;
            if (penutup.butuh_layanan === 'Ya') {
                if (penutup.layanan_dipilih.length === 0 && (!penutup.layanan_lainnya || !penutup.layanan_lainnya_teks.trim())) return false;
            }
            if (!penutup.bersedia_dihubungi) return false;
            if (!penutup.jujur) return false;
            return true;
        }

        const startIndex = currentSectionIndex * 15 + 1;
        for (let i = 0; i < 15; i++) {
            if (answers[startIndex + i] === undefined) {
                return false;
            }
        }
        return true;
    };

    const handleNext = () => {
        if (currentSectionIndex < SECTIONS.length) {
            window.scrollTo(0, 0);
            setCurrentSectionIndex(prev => prev + 1);
        } else {
            // FINISH — compute scores and navigate to results
            const result = computeIMMResult(answers, userData);
            localStorage.setItem('immResult', JSON.stringify(result));
            localStorage.setItem('immAnswers', JSON.stringify(answers));
            localStorage.setItem('immPenutup', JSON.stringify(penutup));
            
            setIsSubmitting(true);
            axios.post('/tes/identifikasi-masalah/submit', {
                userData,
                answers,
                result,
                penutup
            }).then(() => {
                router.visit('/hasil/identifikasi-masalah');
            }).catch(() => {
                // Tetap lanjut ke hasil walau gagal simpan agar user tidak stuck
                router.visit('/hasil/identifikasi-masalah');
            });
        }
    };

    const handlePrev = () => {
        if (currentSectionIndex > 0) {
            window.scrollTo(0, 0);
            setCurrentSectionIndex(prev => prev - 1);
        }
    };

    if (!userData) return null;

    const answeredCount = Object.keys(answers).length;
    const totalQuestions = 75;
    const progress = (answeredCount / totalQuestions) * 100;

    const toggleLayanan = (layanan: string) => {
        setPenutup(prev => {
            const current = prev.layanan_dipilih;
            if (current.includes(layanan)) {
                return { ...prev, layanan_dipilih: current.filter(l => l !== layanan) };
            } else {
                return { ...prev, layanan_dipilih: [...current, layanan] };
            }
        });
    };

    return (
        <>
            <Header />
            <main className="min-h-[100dvh] bg-slate-50 font-sans pb-20">
                <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm px-4 md:px-8 py-4">
                    <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <LinkBack />
                            <div>
                                <h2 className="font-bold text-slate-800">Sistem Identifikasi Kondisi - Mahasiswa (SIK-M)</h2>
                                <p className="text-xs text-slate-500">Menjawab sebagai: {userData.nama}</p>
                            </div>
                        </div>
                        <div className="flex-1 max-w-xs w-full">
                            <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                                <span>Progres</span>
                                <span>{answeredCount} / {totalQuestions} terjawab</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-out"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 md:px-8 mt-8">
                    {currentSectionIndex < SECTIONS.length ? (
                        <>
                            {/* Header Section */}
                            <div className="mb-8 flex items-center justify-between">
                                <h1 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tight">
                                    Bagian {currentSectionIndex + 1}: <span className="text-blue-600">{SECTIONS[currentSectionIndex].title}</span>
                                </h1>
                            </div>

                            {/* Questions */}
                            <div className="space-y-6">
                                {SECTIONS[currentSectionIndex].items.map((question, idx) => {
                                    const qIndex = currentSectionIndex * 15 + 1 + idx;
                                    return (
                                        <div key={qIndex} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 transition-shadow hover:shadow-md">
                                            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-start gap-4">
                                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 shrink-0 text-sm">
                                                    {qIndex}
                                                </span>
                                                <span className="pt-1">{question}</span>
                                            </h3>
                                            
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                {[
                                                    { val: 0, label: 'Tidak Pernah' },
                                                    { val: 1, label: 'Jarang' },
                                                    { val: 2, label: 'Sering' },
                                                    { val: 3, label: 'Hampir Selalu' }
                                                ].map((opt) => (
                                                    <button
                                                        key={opt.val}
                                                        onClick={() => handleAnswer(qIndex, opt.val)}
                                                        className={`flex items-center justify-center p-3 sm:p-4 rounded-2xl border-2 transition-all ${
                                                            answers[qIndex] === opt.val
                                                                ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-600/20 shadow-sm'
                                                                : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-blue-300 hover:bg-white hover:text-slate-700'
                                                        }`}
                                                    >
                                                        <span className="font-bold text-sm text-center leading-tight">{opt.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        // PERTANYAAN PENUTUP
                        <div className="animate-fade-in space-y-8">
                            <div className="mb-8">
                                <h1 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tight">
                                    Pertanyaan Penutup
                                </h1>
                                <p className="text-slate-500 mt-2">Mohon jawab beberapa pertanyaan terakhir ini.</p>
                            </div>

                            {/* Q1: Tiga pernyataan paling mengganggu */}
                            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
                                <h3 className="text-lg font-bold text-slate-800 mb-2">1. Tuliskan tiga nomor pernyataan yang paling mengganggu Anda saat ini (mulai dari yang paling berat):</h3>
                                <p className="text-sm text-slate-500 mb-4 italic">Opsional — kosongkan jika tidak ada yang ingin disorot.</p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-600 mb-2">Pertama</label>
                                        <input 
                                            type="number" min="1" max="75" 
                                            value={penutup.top_1} onChange={(e) => {
                                                const val = parseInt(e.target.value);
                                                if (e.target.value === '' || (val >= 1 && val <= 75)) {
                                                    setPenutup(p => ({ ...p, top_1: e.target.value }));
                                                }
                                            }}
                                            placeholder="No. Pernyataan (1-75)" 
                                            className="w-full rounded-xl border-slate-200 bg-slate-50 p-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-600 mb-2">Kedua</label>
                                        <input 
                                            type="number" min="1" max="75" 
                                            value={penutup.top_2} onChange={(e) => {
                                                const val = parseInt(e.target.value);
                                                if (e.target.value === '' || (val >= 1 && val <= 75)) {
                                                    setPenutup(p => ({ ...p, top_2: e.target.value }));
                                                }
                                            }}
                                            placeholder="No. Pernyataan (1-75)" 
                                            className="w-full rounded-xl border-slate-200 bg-slate-50 p-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-600 mb-2">Ketiga</label>
                                        <input 
                                            type="number" min="1" max="75" 
                                            value={penutup.top_3} onChange={(e) => {
                                                const val = parseInt(e.target.value);
                                                if (e.target.value === '' || (val >= 1 && val <= 75)) {
                                                    setPenutup(p => ({ ...p, top_3: e.target.value }));
                                                }
                                            }}
                                            placeholder="No. Pernyataan (1-75)" 
                                            className="w-full rounded-xl border-slate-200 bg-slate-50 p-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" 
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Q2: Masalah lain */}
                            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
                                <h3 className="text-lg font-bold text-slate-800 mb-4">2. Adakah masalah lain yang Anda alami tetapi belum tercantum dalam daftar?</h3>
                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        {['Tidak ada', 'Ada'].map(opt => (
                                            <button
                                                key={opt}
                                                onClick={() => {
                                                    setPenutup(p => ({ ...p, masalah_lain: opt, masalah_lain_teks: opt === 'Tidak ada' ? '' : p.masalah_lain_teks }));
                                                }}
                                                className={`flex-1 rounded-xl border-2 py-3 px-4 font-semibold text-sm transition-all ${
                                                    penutup.masalah_lain === opt
                                                        ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-600/20'
                                                        : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-blue-300 hover:bg-white'
                                                }`}
                                            >
                                                {opt === 'Ada' ? 'Ada, yaitu:' : 'Tidak ada'}
                                            </button>
                                        ))}
                                    </div>
                                    {penutup.masalah_lain === 'Ada' && (
                                        <textarea 
                                            rows={3} 
                                            value={penutup.masalah_lain_teks}
                                            onChange={(e) => setPenutup(p => ({ ...p, masalah_lain_teks: e.target.value }))}
                                            placeholder="Ceritakan masalah Anda di sini..." 
                                            className="w-full rounded-xl border-slate-200 bg-slate-50 p-4 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none"
                                        ></textarea>
                                    )}
                                </div>
                            </div>

                            {/* Q3: Butuh layanan */}
                            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
                                <h3 className="text-lg font-bold text-slate-800 mb-4">3. Apakah Anda membutuhkan layanan konseling dan layanan lainnya?</h3>
                                <div className="space-y-4">
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <button
                                            onClick={() => setPenutup(p => ({ ...p, butuh_layanan: 'Tidak', layanan_dipilih: [], layanan_lainnya: false, layanan_lainnya_teks: '' }))}
                                            className={`sm:w-1/3 rounded-xl border-2 py-3 px-4 font-semibold text-sm transition-all ${
                                                penutup.butuh_layanan === 'Tidak'
                                                    ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-600/20'
                                                    : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-blue-300 hover:bg-white'
                                            }`}
                                        >
                                            Tidak
                                        </button>
                                        <button
                                            onClick={() => setPenutup(p => ({ ...p, butuh_layanan: 'Ya' }))}
                                            className={`sm:flex-1 rounded-xl border-2 py-3 px-4 font-semibold text-sm transition-all text-left flex items-center justify-between ${
                                                penutup.butuh_layanan === 'Ya'
                                                    ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-600/20'
                                                    : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-blue-300 hover:bg-white'
                                            }`}
                                        >
                                            Ya, saya membutuhkan (boleh memilih lebih dari satu):
                                            {penutup.butuh_layanan === 'Ya' && <RiCheckboxCircleLine />}
                                        </button>
                                    </div>
                                    
                                    {penutup.butuh_layanan === 'Ya' && (
                                        <div className="mt-4 animate-fade-in">
                                            <div className="grid md:grid-cols-2 gap-3 mb-4">
                                                {LAYANAN_OPTIONS.map(opt => (
                                                    <label key={opt} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${penutup.layanan_dipilih.includes(opt) ? 'border-blue-500 bg-blue-50' : 'border-slate-100 bg-white hover:border-blue-200'}`}>
                                                        <input 
                                                            type="checkbox" 
                                                            checked={penutup.layanan_dipilih.includes(opt)}
                                                            onChange={() => toggleLayanan(opt)}
                                                            className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                                                        />
                                                        <span className={penutup.layanan_dipilih.includes(opt) ? 'font-semibold text-blue-900' : 'text-slate-600'}>{opt}</span>
                                                    </label>
                                                ))}
                                            </div>
                                            <div className="flex flex-col sm:flex-row items-center gap-3">
                                                <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${penutup.layanan_lainnya ? 'border-blue-500 bg-blue-50' : 'border-slate-100 bg-white hover:border-blue-200'}`}>
                                                    <input 
                                                        type="checkbox" 
                                                        checked={penutup.layanan_lainnya}
                                                        onChange={(e) => setPenutup(p => ({ ...p, layanan_lainnya: e.target.checked, layanan_lainnya_teks: e.target.checked ? p.layanan_lainnya_teks : '' }))}
                                                        className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                                                    />
                                                    <span className={penutup.layanan_lainnya ? 'font-semibold text-blue-900' : 'text-slate-600'}>Lainnya, sebutkan:</span>
                                                </label>
                                                <input 
                                                    type="text" 
                                                    value={penutup.layanan_lainnya_teks}
                                                    onChange={(e) => setPenutup(p => ({ ...p, layanan_lainnya_teks: e.target.value }))}
                                                    disabled={!penutup.layanan_lainnya}
                                                    className="flex-1 w-full rounded-xl border-slate-200 bg-slate-50 p-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all disabled:opacity-50"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Q4: Bersedia dihubungi */}
                            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
                                <h3 className="text-lg font-bold text-slate-800 mb-4">4. Bersediakah Anda dihubungi konselor maupun psikolog?</h3>
                                <div className="flex gap-4">
                                    {['Ya, bersedia', 'Tidak'].map(opt => (
                                        <button
                                            key={opt}
                                            onClick={() => setPenutup(p => ({ ...p, bersedia_dihubungi: opt }))}
                                            className={`flex-1 rounded-xl border-2 py-3 px-4 font-semibold text-sm transition-all ${
                                                penutup.bersedia_dihubungi === opt
                                                    ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-600/20'
                                                    : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-blue-300 hover:bg-white'
                                            }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Q5: Jujur */}
                            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
                                <h3 className="text-lg font-bold text-slate-800 mb-4">5. Apakah Anda mengisi semua pernyataan dengan jujur?</h3>
                                <div className="flex gap-4">
                                    {['Ya', 'Tidak sepenuhnya'].map(opt => (
                                        <button
                                            key={opt}
                                            onClick={() => setPenutup(p => ({ ...p, jujur: opt }))}
                                            className={`flex-1 rounded-xl border-2 py-3 px-4 font-semibold text-sm transition-all ${
                                                penutup.jujur === opt
                                                    ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-600/20'
                                                    : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-blue-300 hover:bg-white'
                                            }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Info Box */}
                            <div className="bg-orange-50 border-l-4 border-orange-400 p-6 md:p-8 rounded-r-3xl shadow-sm relative overflow-hidden">
                                <RiHeartPulseLine size={120} className="absolute -right-6 -bottom-6 text-orange-200/50" />
                                <div className="relative z-10">
                                    <h3 className="text-xl font-black text-orange-900 mb-3">Butuh bantuan segera?</h3>
                                    <p className="text-orange-800 mb-4 leading-relaxed">
                                        Jika Anda sedang merasa tidak aman, ingin menyakiti diri, ataupun berpikir untuk mengakhiri hidup, segera hubungi <strong>UPA BK UNM (telepon/WhatsApp 0878-2791-2460)</strong>. Anda tidak sendirian.
                                    </p>
                                    <p className="font-bold text-orange-900">Terima kasih atas kesediaan Anda mengisi IMM.</p>
                                </div>
                            </div>

                        </div>
                    )}

                    {/* Navigation */}
                    <div className="mt-10 p-6 bg-white border border-slate-100 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
                        <button
                            onClick={handlePrev}
                            disabled={currentSectionIndex === 0}
                            className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <RiArrowLeftLine size={20} /> Sebelumnya
                        </button>
                        
                        {!isCurrentSectionComplete() && (
                            <div className="flex items-center gap-2 text-amber-600 text-sm font-bold bg-amber-50 px-4 py-2 rounded-lg">
                                <RiErrorWarningLine size={18} /> Lengkapi semua isian untuk lanjut
                            </div>
                        )}

                        <button
                            onClick={handleNext}
                            disabled={!isCurrentSectionComplete() || isSubmitting}
                            className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:bg-slate-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 transition-all active:scale-95"
                        >
                            {currentSectionIndex < SECTIONS.length ? (
                                <>Selanjutnya <RiArrowRightLine size={20} /></>
                            ) : isSubmitting ? (
                                <><svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Mengirim Jawaban...</>
                            ) : (
                                <>Kirim Jawaban <RiCheckboxCircleLine size={20} /></>
                            )}
                        </button>
                    </div>
                </div>
            </main>
        </>
    );
}
