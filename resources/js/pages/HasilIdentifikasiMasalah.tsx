import Header from '@/Components/Header';
import { router } from '@inertiajs/react';
import {
    RiAlertLine,
    RiArrowLeftLine,
    RiDownloadLine,
    RiHeartPulseLine,
    RiShieldCheckLine,
    RiErrorWarningLine,
    RiUserHeartLine,
    RiPrinterLine,
    RiArrowDownSLine,
} from '@remixicon/react';
import React, { useEffect, useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { immInterpretations } from '@/utils/immInterpretations';

const CONCLUSION_COLORS: Record<string, { bg: string; border: string; text: string; icon: any }> = {
    "Perlu Bantuan Segera": { bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-800', icon: RiAlertLine },
    "Perlu Pendampingan": { bg: 'bg-orange-50', border: 'border-orange-400', text: 'text-orange-800', icon: RiUserHeartLine },
    "Perlu Perhatian": { bg: 'bg-yellow-50', border: 'border-yellow-400', text: 'text-yellow-800', icon: RiErrorWarningLine },
    "Kondisi Baik": { bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-800', icon: RiShieldCheckLine },
};

const CLASSIFICATION_BADGE: Record<string, string> = {
    "Baik": "bg-green-100 text-green-800 border-green-200",
    "Perlu Perhatian": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Perlu Pendampingan": "bg-orange-100 text-orange-800 border-orange-200",
    "Risiko rendah": "bg-green-100 text-green-800 border-green-200",
    "Risiko sedang": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Risiko tinggi": "bg-red-100 text-red-800 border-red-200",
};

export default function HasilIdentifikasiMasalah() {
    const [result, setResult] = useState<IMMResult | null>(null);
    const [userData, setUserData] = useState<any>(null);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [penutup, setPenutup] = useState<any>(null);
    const [openSectionIndex, setOpenSectionIndex] = useState<number | null>(null);
    const [openNarrativeIndex, setOpenNarrativeIndex] = useState<number | null>(null);

    useEffect(() => {
        const rawResult = localStorage.getItem('immResult');
        const rawUser = localStorage.getItem('userDataIdentifikasiMasalah');
        const rawAnswers = localStorage.getItem('immAnswers');
        const rawPenutup = localStorage.getItem('immPenutup');

        if (!rawResult || !rawUser) {
            router.visit('/tes/identifikasi-masalah');
            return;
        }

        setResult(JSON.parse(rawResult));
        setUserData(JSON.parse(rawUser));
        if (rawAnswers) setAnswers(JSON.parse(rawAnswers));
        if (rawPenutup) setPenutup(JSON.parse(rawPenutup));
    }, []);

    if (!result || !userData) return null;

    const conclusionStyle = CONCLUSION_COLORS[result.conclusion] ?? CONCLUSION_COLORS["Kondisi Baik"];
    const ConclusionIcon = conclusionStyle.icon;
    const triggeredCriticals = result.criticalItems.filter(c => c.triggered);

    const radarData = result.sections.map(sec => ({
        subject: sec.title,
        skor: sec.score,
        fullMark: 45,
    }));

    const getSectionLevelInfo = (score: number) => {
        if (score <= 15) return { text: "Baik", style: "bg-emerald-100 text-emerald-800 border-emerald-200", borderStyle: "border-l-emerald-500" };
        if (score <= 30) return { text: "Perlu Perhatian", style: "bg-amber-100 text-amber-800 border-amber-200", borderStyle: "border-l-amber-400" };
        return { text: "Perlu Pendampingan", style: "bg-red-100 text-red-800 border-red-200", borderStyle: "border-l-red-400" };
    };

    const getTotalScoreLevelInfo = (score: number) => {
        if (score <= 75) return { text: "Baik", style: "bg-emerald-100 text-emerald-800 border-emerald-200" };
        if (score <= 150) return { text: "Perlu Perhatian", style: "bg-amber-100 text-amber-800 border-amber-200" };
        return { text: "Perlu Pendampingan", style: "bg-red-100 text-red-800 border-red-200" };
    };

    // Sort sections from worst to best (highest score first)
    const sortedSections = [...result.sectionAdvice].sort((a, b) => b.score - a.score);

    // Generate structured narrative data
    const generateNarrativeBlocks = () => {
        const LEVEL_CONFIG = {
            'Perlu Pendampingan': {
                label: 'Perlu Pendampingan',
                bg: 'bg-red-50',
                border: 'border-red-200',
                headerBg: 'bg-gradient-to-r from-red-500 to-rose-600',
                tagBg: 'bg-red-100 text-red-800',
                accentColor: 'text-red-700',
                actionBorder: 'border-l-red-400',
                intro: (names: string) =>
                    `Anda teridentifikasi membutuhkan pendampingan di ${names}. Di bidang ini, Anda mungkin sering mengalami masalah yang cukup berat dan dapat mengganggu jalannya kuliah Anda. Ingat, Anda tidak perlu menghadapi ini sendirian — ada tim konselor yang siap membantu.`
            },
            'Perlu Perhatian': {
                label: 'Perlu Perhatian',
                bg: 'bg-amber-50',
                border: 'border-amber-200',
                headerBg: 'bg-gradient-to-r from-amber-400 to-orange-500',
                tagBg: 'bg-amber-100 text-amber-800',
                accentColor: 'text-amber-700',
                actionBorder: 'border-l-amber-400',
                intro: (names: string) =>
                    `Anda teridentifikasi perlu memberikan perhatian lebih pada ${names}. Di bidang ini, ada beberapa masalah yang cukup sering Anda rasakan. Hal ini wajar terjadi pada banyak mahasiswa dan dapat diatasi dengan langkah-langkah yang tepat.`
            },
            'Baik': {
                label: 'Baik',
                bg: 'bg-emerald-50',
                border: 'border-emerald-200',
                headerBg: 'bg-gradient-to-r from-emerald-500 to-teal-500',
                tagBg: 'bg-emerald-100 text-emerald-800',
                accentColor: 'text-emerald-700',
                actionBorder: 'border-l-emerald-400',
                intro: (names: string) =>
                    `Kondisi Anda baik di ${names}. Anda telah mampu mengelola bidang ini dengan baik. Pertahankan kebiasaan positif Anda agar tetap dalam kondisi optimal.`
            }
        } as const;

        type LevelKey = keyof typeof LEVEL_CONFIG;

        const groupings: Record<LevelKey, string[]> = {
            'Perlu Pendampingan': [],
            'Perlu Perhatian': [],
            'Baik': []
        };

        const sectionActionsByLevel: Record<LevelKey, Set<string>> = {
            'Perlu Pendampingan': new Set(),
            'Perlu Perhatian': new Set(),
            'Baik': new Set()
        };

        sortedSections.forEach(sec => {
            const bKey = sec.title.split(' ')[1] as string; // "Bidang Pribadi" -> "Pribadi"
            let levelKey: LevelKey;
            if (sec.score > 30) levelKey = 'Perlu Pendampingan';
            else if (sec.score > 15) levelKey = 'Perlu Perhatian';
            else levelKey = 'Baik';

            groupings[levelKey].push(sec.title);

            if (immInterpretations[bKey] && immInterpretations[bKey][levelKey]) {
                immInterpretations[bKey][levelKey].saran.forEach((s: string) =>
                    sectionActionsByLevel[levelKey].add(s)
                );
            }
        });

        const blocks = [];
        const order: LevelKey[] = ['Perlu Pendampingan', 'Perlu Perhatian', 'Baik'];

        for (const lvl of order) {
            if (groupings[lvl].length === 0) continue;
            const config = LEVEL_CONFIG[lvl];
            const names = groupings[lvl].map(t => t.replace('Bidang ', '')).join(', ');
            const formattedNames = `bidang ${groupings[lvl].map(t => t.replace('Bidang ', '')).join(' dan ')}`.toLowerCase();
            blocks.push({
                config,
                levelKey: lvl,
                names,
                intro: config.intro(formattedNames),
                actions: Array.from(sectionActionsByLevel[lvl]),
                bidangList: groupings[lvl]
            });
        }

        return blocks;
    };

    return (
        <>
            <Header />
            <main className="min-h-[100dvh] bg-slate-50 font-sans pb-20 print:bg-white print:pb-0">
                {/* Top bar */}
                <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm px-4 md:px-8 py-4 print:hidden">
                    <div className="max-w-4xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => router.visit('/')} className="p-2 rounded-lg hover:bg-slate-100">
                                <RiArrowLeftLine size={20} />
                            </button>
                            <div>
                                <h2 className="font-bold text-slate-800">Hasil Sistem Identifikasi Kondisi - Mahasiswa (SIK-M)</h2>
                                <p className="text-xs text-slate-500">{userData.nama} — {userData.nim}</p>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 md:px-8 mt-8 space-y-8">

                    {/* Print Header (only visible in print) */}
                    <div className="hidden print:block mb-6">
                        <h1 className="text-2xl font-black text-center">LEMBAR HASIL</h1>
                        <h2 className="text-lg font-bold text-center text-slate-600">Sistem Identifikasi Kondisi - Mahasiswa (SIK-M)</h2>
                        <div className="mt-4 grid grid-cols-2 gap-2 text-sm border rounded-lg p-4">
                            <div><strong>Nama:</strong> {userData.nama}</div>
                            <div><strong>NIM:</strong> {userData.nim}</div>
                            <div><strong>Fakultas:</strong> {userData.fakultas}</div>
                            <div><strong>Program Studi:</strong> {userData.program_studi}</div>
                            <div><strong>Semester:</strong> {userData.semester}</div>
                            <div><strong>IPK:</strong> {userData.ipk_terakhir}</div>
                        </div>
                    </div>

                    {/* ────────────── KESIMPULAN UTAMA ────────────── */}
                    <div className={`rounded-3xl border-2 ${conclusionStyle.border} ${conclusionStyle.bg} p-6 md:p-10 relative overflow-hidden`}>
                        <ConclusionIcon size={140} className="absolute -right-8 -bottom-8 opacity-10" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <ConclusionIcon size={28} className={conclusionStyle.text} />
                                <h1 className={`text-2xl md:text-3xl font-black ${conclusionStyle.text}`}>
                                    {result.conclusion}
                                </h1>
                            </div>
                            <p className={`text-lg leading-relaxed ${conclusionStyle.text}`}>
                                {result.conclusionMessage}
                            </p>
                            {/* Alasan disembunyikan untuk mahasiswa */}
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
                            {/* ────────────── SKOR TOTAL ────────────── */}
                            <div className="lg:col-span-2 p-6 md:p-8 flex flex-col justify-center items-center bg-slate-50/50">
                                <h2 className="text-lg font-bold text-slate-800 mb-2">Skor Keseluruhan</h2>
                                <p className="text-sm text-slate-500 mb-8 text-center">Akumulasi poin dari seluruh indikator</p>
                                
                                <div className="relative flex items-center justify-center w-48 h-48 rounded-full bg-white shadow-sm border border-slate-100 mb-4">
                                    <div className="absolute inset-2 rounded-full border border-dashed border-slate-200"></div>
                                    <div className="text-center relative z-10">
                                        <p className="text-5xl font-black text-slate-800 tracking-tight">{result.totalScore}</p>
                                        <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-widest">/ 225</p>
                                    </div>
                                </div>

                                <span className={`inline-block mt-4 px-4 py-1.5 rounded-full text-sm font-bold border shadow-sm ${getTotalScoreLevelInfo(result.totalScore).style}`}>
                                    {getTotalScoreLevelInfo(result.totalScore).text}
                                </span>
                            </div>

                            {/* ────────────── RADAR CHART ────────────── */}
                            <div className="lg:col-span-3 p-6 md:p-8">
                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-800">Peta Kecenderungan</h2>
                                        <p className="text-sm text-slate-500 mt-1">Area terluar = kecenderungan masalah tinggi</p>
                                    </div>
                                </div>
                                <div className="h-[320px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                                            <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }} />
                                            <PolarRadiusAxis angle={30} domain={[0, 45]} tick={false} axisLine={false} />
                                            <Radar name="Skor" dataKey="skor" stroke="#6366f1" strokeWidth={2.5} fill="#818cf8" fillOpacity={0.3} label={{ position: 'top', fill: '#4338ca', fontSize: 12, fontWeight: 'bold' }} />
                                            <Tooltip cursor={{ stroke: '#6366f1', strokeWidth: 1 }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }} />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ────────────── URAIAN HASIL (NARRATIVE) ────────────── */}
                        <div className="rounded-3xl overflow-hidden shadow-sm border border-slate-200">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 md:px-8 py-6">
                                <div className="flex items-center gap-3 mb-1">
                                    <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                                        <RiUserHeartLine size={20} className="text-white" />
                                    </div>
                                    <h2 className="text-xl font-black text-white tracking-tight">Uraian Hasil Identifikasi</h2>
                                </div>
                                <p className="text-indigo-200 text-sm ml-12">Rangkuman kondisi Anda berdasarkan hasil tes, diurutkan dari prioritas tertinggi.</p>
                            </div>

                            {/* Blocks */}
                            <div className="bg-white divide-y divide-slate-100">
                                {generateNarrativeBlocks().map((block, i) => (
                                    <div key={i} className="p-5 md:p-7">
                                        {/* Level label + bidang tags */}
                                        <div className="flex flex-wrap items-center gap-2 mb-3">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold text-white ${block.config.headerBg}`}>
                                                {block.config.label}
                                            </span>
                                            {block.bidangList.map((b: string) => (
                                                <span key={b} className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${block.config.tagBg}`}>
                                                    {b.replace('Bidang ', '')}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Intro paragraph */}
                                        <p className="text-slate-600 text-sm leading-relaxed">
                                            {block.intro}
                                        </p>

                                        {/* Accordion: Yang perlu dilakukan */}
                                        {block.actions.length > 0 && (
                                            <div className="mt-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setOpenNarrativeIndex(openNarrativeIndex === i ? null : i)}
                                                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                                                        openNarrativeIndex === i
                                                            ? `${block.config.bg} ${block.config.border} rounded-b-none border-b-0`
                                                            : `${block.config.bg} ${block.config.border} hover:brightness-95`
                                                    }`}
                                                >
                                                    <span className={`text-xs font-bold uppercase tracking-wider ${block.config.accentColor}`}>
                                                        Yang perlu Anda lakukan
                                                    </span>
                                                    <RiArrowDownSLine
                                                        size={16}
                                                        className={`shrink-0 ${block.config.accentColor} transition-transform duration-200 ${
                                                            openNarrativeIndex === i ? 'rotate-180' : ''
                                                        }`}
                                                    />
                                                </button>

                                                <div className={`overflow-hidden transition-all duration-300 ${
                                                    openNarrativeIndex === i ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
                                                }`}>
                                                    <ul className={`border ${block.config.border} border-t-0 rounded-b-xl ${block.config.bg} px-4 pb-4 pt-2 space-y-2`}>
                                                        {block.actions.map((action: string, ai: number) => (
                                                            <li key={ai} className={`flex items-start gap-3 text-sm text-slate-700 bg-white rounded-xl px-4 py-3 border-l-4 ${block.config.actionBorder}`}>
                                                                <span className="shrink-0 font-bold text-slate-400 text-xs w-5 text-right mt-0.5">{ai + 1}.</span>
                                                                <span className="leading-relaxed">{action}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                    {/* ────────────── HASIL PER BIDANG (RINGKAS) ────────────── */}
                        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
                            <h2 className="text-xl font-black text-slate-800 mb-6">Rincian per Bidang Masalah (Berdasarkan Urutan Prioritas)</h2>
                            <div className="space-y-4">
                                {sortedSections.map((sec, idx) => {
                                    const isOpen = openSectionIndex === idx;
                                    const levelInfo = getSectionLevelInfo(sec.score);
                                    return (
                                        <div key={idx} className={`border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 transition-all ${isOpen ? 'shadow-md ring-2 ring-slate-100' : 'hover:shadow-sm'} border-l-4 ${levelInfo.borderStyle}`}>
                                            <button 
                                                onClick={() => setOpenSectionIndex(isOpen ? null : idx)}
                                                className={`w-full px-5 py-4 flex items-center justify-between transition-colors text-left ${isOpen ? 'bg-white' : 'hover:bg-slate-100/70'}`}
                                            >
                                                <h3 className="font-bold text-slate-800 flex-1">{idx + 1}. {sec.title}</h3>
                                                <div className="flex items-center gap-3">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${levelInfo.style}`}>
                                                        {levelInfo.text} (Skor: {sec.score}/45)
                                                    </span>
                                                    <div className={`p-1 rounded-full transition-colors ${isOpen ? 'bg-slate-100' : 'bg-transparent'}`}>
                                                        <RiArrowDownSLine size={20} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                                                    </div>
                                                </div>
                                            </button>
                                            <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                                                <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-white">
                                                    <p className="text-slate-600 text-sm leading-relaxed p-4 bg-slate-50 rounded-xl border border-slate-100">{sec.meaning}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>



                    {/* ────────────── BANTUAN DARURAT ────────────── */}
                    <div className="bg-orange-50 border-l-4 border-orange-400 p-6 md:p-8 rounded-r-3xl shadow-sm relative overflow-hidden">
                        <RiHeartPulseLine size={120} className="absolute -right-6 -bottom-6 text-orange-200/50" />
                        <div className="relative z-10">
                            <h3 className="text-xl font-black text-orange-900 mb-3">Butuh bantuan segera?</h3>
                            <p className="text-orange-800 mb-4 leading-relaxed">
                                Jika Anda sedang merasa tidak aman, ingin menyakiti diri, ataupun berpikir untuk mengakhiri hidup, segera hubungi <strong>UPA BK UNM (telepon/WhatsApp 0878-2791-2460)</strong> atau <strong>Healing119 (119 ekstensi 8)</strong>. Anda tidak sendirian.
                            </p>
                        </div>
                    </div>

                    {/* ────────────── KEMBALI ────────────── */}
                    <div className="text-center print:hidden">
                        <button
                            onClick={() => router.visit('/')}
                            className="px-8 py-3 rounded-xl font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-all"
                        >
                            Kembali ke Beranda
                        </button>
                    </div>
                </div>
            </main>

            {/* Print styles */}
            <style>{`
                @media print {
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    .print\\:hidden { display: none !important; }
                    .print\\:block { display: block !important; }
                    .print\\:bg-white { background-color: white !important; }
                    .print\\:pb-0 { padding-bottom: 0 !important; }
                    main { padding-top: 0 !important; }
                    @page { margin: 1cm; }
                }
            `}</style>
        </>
    );
}
