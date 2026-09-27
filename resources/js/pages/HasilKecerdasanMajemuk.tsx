import IdentitasLayout from '@/layouts/IdentitasLayout';
import { RiAwardFill, RiLightbulbLine, RiListCheck, RiPieChartLine } from '@remixicon/react';
import { useState } from 'react';

interface ResultData {
    result: {
        nama: string;
        kelas: string;
        asal_sekolah: string;
        top_categories: string[];
        skor_per_kategori: Record<string, { skor: number, interpretasi: string }>;
    };
    interpretations: Record<string, { penjelasan: string, cocok: string, tips: string }>;
}

export default function HasilKecerdasanMajemuk({ result, interpretations }: ResultData) {
    const [showAllScores, setShowAllScores] = useState(false);

    const interpretasiPriority: Record<string, number> = {
        'sangat kuat': 0,
        'cukup kuat': 1,
        'perlu dikembangkan': 2,
    };

    const sortedScoreEntries = Object.entries(result.skor_per_kategori)
        .sort(([, a], [, b]) => {
            const scoreA = Number(a.skor);
            const scoreB = Number(b.skor);

            const interpretasiA = a.interpretasi?.toString().trim().toLowerCase() ?? '';
            const interpretasiB = b.interpretasi?.toString().trim().toLowerCase() ?? '';
            const priorityA = interpretasiPriority[interpretasiA] ?? 3;
            const priorityB = interpretasiPriority[interpretasiB] ?? 3;

            if (priorityA !== priorityB) {
                return priorityA - priorityB;
            }

            return scoreB - scoreA;
        });

    return (
        <IdentitasLayout>
            <div className="mx-auto max-w-5xl py-12 px-4 sm:px-6 overflow-x-hidden">
                {/* Header Hasil */}
                <div className="mb-16 text-center" data-aos="zoom-out">
                    <div className="mb-6 flex justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 animate-ping rounded-full bg-yellow-400 opacity-20"></div>
                            <div className="relative rounded-full bg-gradient-to-tr from-yellow-400 to-amber-600 p-6 shadow-2xl">
                                <RiAwardFill size={64} className="text-white" />
                            </div>
                        </div>
                    </div>
                    <h1 className="text-3xl font-black text-purple-900 sm:text-4xl md:text-5xl lg:text-6xl tracking-tighter">
                        Analisis Potensimu
                    </h1>
                    <p className="mt-4 text-xl text-purple-700 font-medium">
                        Halo, <span className="text-purple-900 font-black underline decoration-yellow-400 decoration-4 underline-offset-4">{result.nama}</span>! Inilah profil kecerdasan unikmu.
                    </p>
                </div>

{/* Top Category */}
                <div className="space-y-10">
                    <div className="flex items-center gap-4 border-b border-purple-100 pb-6" data-aos="fade-right">
                        <div className="rounded-xl bg-purple-100 p-2 text-purple-600">
                            <RiLightbulbLine size={28} />
                        </div>
                        <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Kekuatan Terbesarmu</h2>
                    </div>

                    <div className="grid gap-8">
                        {(() => {
                            const topCategory = result.top_categories?.[0];
                            const interpretation = topCategory ? interpretations[topCategory] : null;
                            const gradient = 'from-purple-600 to-indigo-700';

                            if (!interpretation) return <div className="p-8 text-center text-slate-400">Data analisis belum tersedia.</div>;

                            return (
                                <div
                                    className="group overflow-hidden rounded-[2rem] sm:rounded-[3rem] bg-white shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-purple-50"
                                    data-aos="fade-up"
                                >
                                    <div className="flex flex-col lg:flex-row">
                                        <div className={`flex w-full items-center justify-center bg-gradient-to-br ${gradient} p-8 sm:p-10 text-white lg:w-64 shadow-inner`}>
                                            <div className="text-center">
                                                <span className="block text-6xl font-black italic opacity-20 transform -rotate-12 translate-x-2">1</span>
                                                <span className="relative -top-4 block text-sm font-black uppercase tracking-[0.3em] whitespace-nowrap">Dominan</span>
                                            </div>
                                        </div>
                                        <div className="flex-1 p-6 sm:p-8 md:p-12">
                                            <div className="mb-6 flex items-center justify-between gap-4">
                                                <h3 className="text-2xl sm:text-3xl font-black text-purple-900 tracking-tight md:text-4xl">{topCategory}</h3>
                                                <div className={`hidden sm:block h-12 w-12 rounded-2xl bg-gradient-to-br ${gradient} opacity-10 blur-xl group-hover:opacity-30 transition-opacity`}></div>
                                            </div>

                                            <p className="mb-8 text-lg leading-relaxed text-gray-600 font-medium">{interpretation.penjelasan}</p>

                                            <div className="grid gap-6 md:grid-cols-2">
                                                <div className="rounded-[1.5rem] sm:rounded-[2rem] bg-purple-50/50 p-5 sm:p-6 border border-purple-100/50">
                                                    <h4 className="mb-3 flex items-center gap-2 text-[10px] sm:text-xs font-black text-purple-800 uppercase tracking-widest">
                                                        <div className="h-2 w-2 rounded-full bg-purple-400"></div> Karir & Aktivitas
                                                    </h4>
                                                    <p className="text-purple-950 font-bold leading-relaxed">{interpretation.cocok}</p>
                                                </div>
                                                <div className="rounded-[1.5rem] sm:rounded-[2rem] bg-amber-50/50 p-5 sm:p-6 border border-amber-100/50">
                                                    <h4 className="mb-3 flex items-center gap-2 text-[10px] sm:text-xs font-black text-amber-800 uppercase tracking-widest">
                                                        <div className="h-2 w-2 rounded-full bg-amber-400"></div> Strategi Belajar
                                                    </h4>
                                                    <p className="text-amber-950 font-bold leading-relaxed">{interpretation.tips}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </div>

                {/* All Categories Scores List */}
                <div className="mt-20">
                    <div className="flex flex-col items-center justify-center gap-6">
                        <button
                            onClick={() => setShowAllScores(!showAllScores)}
                            className="group relative flex items-center gap-3 rounded-[2rem] bg-white px-10 py-5 font-black text-purple-700 shadow-[0_15px_40px_rgba(166,124,186,0.15)] transition-all hover:bg-purple-50 hover:shadow-purple-200 active:scale-95"
                            data-aos="zoom-in"
                        >
                            <div className="rounded-full bg-purple-100 p-2 text-purple-600 transition-transform group-hover:rotate-12">
                                {showAllScores ? <RiPieChartLine size={20} /> : <RiListCheck size={20} />}
                            </div>
                            <span className="uppercase tracking-widest text-sm">
                                {showAllScores ? 'Tutup Detail Skor' : 'Lihat Analisis Lengkap'}
                            </span>
                        </button>

                        {showAllScores && (
                            <div
                                className="mt-10 w-full overflow-hidden rounded-[2rem] sm:rounded-[3rem] bg-white p-6 sm:p-8 md:p-14 shadow-2xl border border-purple-50"
                                data-aos="fade-up"
                            >
                                <h2 className="mb-4 text-center text-3xl font-black text-gray-900 tracking-tight">Profil Kecerdasan Lengkap</h2>
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                                     {sortedScoreEntries.map(([name, data], i) => (
                                                <div key={name} className="group flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-gray-100 bg-gray-50/50 p-4 px-6 sm:p-5 sm:px-8 transition-all hover:bg-white hover:border-purple-200 hover:shadow-lg" data-aos="fade-up" data-aos-delay={i * 50}>
                                                <span className="font-black text-gray-700 tracking-tight text-sm sm:text-base">{name}</span>
                                                <span className={`rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-wider sm:tracking-[0.2em] shadow-sm ${
                                                    data.interpretasi?.toLowerCase() === 'sangat kuat' ? 'bg-green-500 text-white' :
                                                    data.interpretasi?.toLowerCase() === 'cukup kuat' ? 'bg-blue-500 text-white' :
                                                    'bg-orange-500 text-white'
                                                }`}>
                                                    {data.interpretasi}
                                                </span>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Message */}
                <div
                    className="mt-24 relative overflow-hidden rounded-[2.5rem] sm:rounded-[4rem] bg-gradient-to-br from-purple-900 via-indigo-900 to-black p-8 sm:p-10 text-center text-white shadow-[0_30px_60px_rgba(49,46,129,0.3)] md:p-20"
                    data-aos="zoom-in"
                >
                    {/* Abstract background blobs */}
                    <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-purple-600/20 blur-[100px]"></div>
                    <div className="absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-indigo-600/20 blur-[100px]"></div>

                    <div className="relative z-10">
                        <p className="text-xl leading-relaxed text-purple-100 italic font-black sm:text-2xl md:text-3xl lg:text-4xl tracking-tight">
                            "Setiap orang punya kecerdasan yang berbeda dan semuanya penting. Kecerdasan aslimu adalah kompas masa depanmu."
                        </p>

                        <div className="mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row">
                            <a
                                href="/tes/kecerdasan-majemuk"
                                className="w-full sm:w-auto flex items-center justify-center gap-3 rounded-2xl bg-white/10 px-10 py-5 text-sm font-black text-white hover:bg-white/20 transition-all backdrop-blur-md border border-white/20"
                            >
                                <span className="uppercase tracking-[0.2em]">Ulangi Tes</span>
                            </a>
                            <a
                                href="/"
                                className="w-full sm:w-auto flex items-center justify-center gap-3 rounded-2xl bg-yellow-400 px-12 py-5 text-sm font-black text-purple-950 hover:bg-yellow-300 hover:shadow-[0_0_30px_rgba(250,204,21,0.4)] transition-all active:scale-95"
                            >
                                <span className="uppercase tracking-[0.2em]">Kembali ke Beranda</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </IdentitasLayout>
    );
}
