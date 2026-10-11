import AdminLayout from '@/layouts/AdminLayout';
import { Link } from '@inertiajs/react';
import { RiArrowLeftLine, RiSurveyLine, RiAlertFill, RiCheckDoubleLine, RiArrowDownSLine } from '@remixicon/react';
import React, { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { immInterpretations } from '@/utils/immInterpretations';
export default function Show({ data }: any) {
    const KATEGORI_COLOR: Record<string, string> = {
        'Kondisi Baik': 'bg-emerald-100 text-emerald-700 border-emerald-200',
        'Perlu Perhatian Khusus': 'bg-yellow-100 text-yellow-700 border-yellow-200',
        'Perlu Bantuan Segera': 'bg-red-100 text-red-700 border-red-200',
    };
    const badgeColor = KATEGORI_COLOR[data.conclusion] ?? 'bg-indigo-100 text-indigo-700 border-indigo-200';

    const CONCLUSION_DESC: Record<string, string> = {
        'Kondisi Baik': 'Secara umum mahasiswa dalam kondisi baik dan dapat mengelola aktivitasnya dengan aman.',
        'Perlu Perhatian Khusus': 'Terdapat area masalah yang butuh perhatian. Mahasiswa disarankan untuk mulai mengambil langkah penanganan atau berkonsultasi.',
        'Perlu Bantuan Segera': 'Mahasiswa ini menunjukkan indikasi masalah yang serius. Sangat disarankan untuk segera dijadwalkan sesi konseling.'
    };
    const totalScoreDesc = CONCLUSION_DESC[data.conclusion] ?? 'Tidak ada catatan khusus untuk skor ini.';

    const radarData = [
        { subject: 'Pribadi', score: data.skor_pribadi, fullMark: 45 },
        { subject: 'Sosial', score: data.skor_sosial, fullMark: 45 },
        { subject: 'Belajar', score: data.skor_belajar, fullMark: 45 },
        { subject: 'Karier', score: data.skor_karier, fullMark: 45 },
        { subject: 'Lainnya', score: data.skor_lainnya, fullMark: 45 },
    ];

    const fullResult = data.full_result || {};
    const criticalItems = fullResult.criticalItems?.filter((c: any) => c.triggered) || [];
    const sections = fullResult.sections || [];

    const [openNarrativeIndex, setOpenNarrativeIndex] = useState<number | null>(null);
    const [openSectionIndex, setOpenSectionIndex] = useState<number | null>(null);

    // Sort sections from worst to best
    const sortedSections = [...sections].sort((a, b) => b.score - a.score);

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
            },
            'Perlu Perhatian': {
                label: 'Perlu Perhatian',
                bg: 'bg-amber-50',
                border: 'border-amber-200',
                headerBg: 'bg-gradient-to-r from-amber-400 to-orange-500',
                tagBg: 'bg-amber-100 text-amber-800',
                accentColor: 'text-amber-700',
                actionBorder: 'border-l-amber-400',
            },
            'Baik': {
                label: 'Baik',
                bg: 'bg-emerald-50',
                border: 'border-emerald-200',
                headerBg: 'bg-gradient-to-r from-emerald-500 to-teal-500',
                tagBg: 'bg-emerald-100 text-emerald-800',
                accentColor: 'text-emerald-700',
                actionBorder: 'border-l-emerald-400',
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

        sortedSections.forEach((sec: any) => {
            const bKey = sec.title.split(' ')[1] as string; // "Bidang Pribadi" -> "Pribadi"
            let levelKey: LevelKey;
            if (sec.score > 30) levelKey = 'Perlu Pendampingan';
            else if (sec.score > 15) levelKey = 'Perlu Perhatian';
            else levelKey = 'Baik';

            groupings[levelKey].push(sec.title);

            if (immInterpretations[bKey] && (immInterpretations[bKey] as any)[levelKey]) {
                const interpretation = (immInterpretations[bKey] as any)[levelKey];
                interpretation.saran.forEach((s: string) =>
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
            blocks.push({
                config,
                levelKey: lvl,
                names,
                actions: Array.from(sectionActionsByLevel[lvl]),
                bidangList: groupings[lvl]
            });
        }

        return blocks;
    };

    const getSectionLevelInfo = (score: number) => {
        if (score <= 15) return { text: "Baik", style: "bg-emerald-100 text-emerald-800 border-emerald-200", borderStyle: "border-l-emerald-500" };
        if (score <= 30) return { text: "Perlu Perhatian", style: "bg-amber-100 text-amber-800 border-amber-200", borderStyle: "border-l-amber-400" };
        return { text: "Perlu Pendampingan", style: "bg-red-100 text-red-800 border-red-200", borderStyle: "border-l-red-400" };
    };

    const narrativeBlocks = generateNarrativeBlocks();

    return (
        <AdminLayout title={`Detail: ${data.nama}`}>
            <div className="max-w-4xl mx-auto space-y-6">
                <Link href="/admin/imm" className="flex items-center gap-2 text-slate-500 hover:text-purple-600 font-bold transition-colors">
                    <RiArrowLeftLine size={18} /> Kembali ke Daftar
                </Link>

                {/* Header */}
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] p-8 text-white shadow-xl shadow-slate-200/50">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
                            <RiSurveyLine size={32} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black">{data.nama}</h2>
                            <p className="text-white/80 font-medium mt-0.5">NIM: {data.nim || '-'} | {data.fakultas || '-'} | {data.program_studi || '-'}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Kolom Kiri / Utama */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* 1. Ringkasan Skor & Risiko */}
                        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
                            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                                <div className="p-6 md:p-8 flex flex-col justify-center items-center bg-slate-50/50">
                                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Skor Total</h3>
                                    <div className="relative flex items-center justify-center w-32 h-32 rounded-full bg-white shadow-sm border border-slate-100 mb-4">
                                        <div className="absolute inset-1 rounded-full border border-dashed border-slate-200"></div>
                                        <div className="text-center relative z-10">
                                            <p className="text-4xl font-black text-slate-800 tracking-tight">{data.total_score}</p>
                                        </div>
                                    </div>
                                    <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold border shadow-sm ${badgeColor}`}>
                                        {data.conclusion}
                                    </span>
                                    <div className="mt-4 bg-slate-50 p-4 rounded-xl border border-slate-100 w-full">
                                        <p className="text-sm text-slate-700 font-medium text-center">{totalScoreDesc}</p>
                                    </div>
                                </div>
                                
                                <div className="p-6 md:p-8 flex flex-col justify-center bg-white">
                                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Risiko Putus Kuliah</h3>
                                    <p className="text-3xl font-black text-slate-800 mb-2">{data.dropout_risk_score} <span className="text-sm font-semibold text-slate-400">/ 27</span></p>
                                    <span className={`inline-block px-3 py-1 mb-4 rounded-full text-xs font-bold w-max border ${data.dropout_risk_classification === 'Risiko rendah' || data.dropout_risk_classification === 'Aman' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : (data.dropout_risk_classification === 'Risiko sedang' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-red-100 text-red-700 border-red-200')}`}>
                                        {data.dropout_risk_classification}
                                    </span>
                                    
                                    {fullResult.dropoutRisk?.meaning && (
                                        <div className="mt-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                            <p className="text-sm text-slate-700 font-medium mb-2">{fullResult.dropoutRisk.meaning}</p>
                                            {fullResult.dropoutRisk.actions && fullResult.dropoutRisk.actions.length > 0 && (
                                                <ul className="text-xs text-slate-600 list-disc pl-4 space-y-1">
                                                    {fullResult.dropoutRisk.actions.map((act: string, i: number) => <li key={i}>{act}</li>)}
                                                </ul>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 2. Butir Kritis */}
                        {criticalItems.length > 0 && (
                            <div className="bg-red-50 rounded-[2rem] shadow-sm border border-red-200 overflow-hidden">
                                <div className="p-6 md:p-8">
                                    <div className="flex items-center gap-3 mb-2">
                                        <RiAlertFill size={24} className="text-red-600" />
                                        <h3 className="text-lg font-black text-red-700 uppercase tracking-tight">Perhatian: Butir Kritis!</h3>
                                    </div>
                                    <p className="text-sm text-red-600 mb-6 font-medium">Mahasiswa menjawab dengan skor tinggi pada indikator berisiko tinggi. Membutuhkan tindak lanjut konselor segera.</p>
                                    
                                    <div className="space-y-3">
                                        {criticalItems.map((c: any, i: number) => (
                                            <div key={i} className="bg-white p-5 rounded-2xl border border-red-100 shadow-sm relative overflow-hidden group">
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-400 group-hover:bg-red-500 transition-colors"></div>
                                                <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-2">Kondisi Terdeteksi</p>
                                                <p className="font-bold text-slate-800 mb-4">{c.condition}</p>
                                                
                                                <div className="bg-red-50/50 p-4 rounded-xl border border-red-100/50">
                                                    <p className="text-xs font-bold text-red-700 uppercase tracking-wider mb-1">Aksi Konselor</p>
                                                    <p className="text-sm text-red-800 font-medium leading-relaxed">{c.actionForCounselor}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 3. Rekomendasi & Saran (Narrative Blocks) */}
                        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-6 md:p-8">
                            <h3 className="text-lg font-black text-slate-800 mb-6 uppercase tracking-tight">Rekomendasi & Saran Khusus</h3>
                            <div className="space-y-4">
                                {narrativeBlocks.map((block, i) => {
                                    const isOpen = openNarrativeIndex === i;
                                    return (
                                        <div key={i} className={`border ${block.config.border} rounded-2xl overflow-hidden bg-white shadow-sm transition-all hover:shadow-md`}>
                                            <button 
                                                onClick={() => setOpenNarrativeIndex(isOpen ? null : i)}
                                                className={`w-full px-5 py-4 flex items-center justify-between ${block.config.bg} transition-colors text-left border-b ${isOpen ? block.config.border : 'border-transparent'}`}
                                            >
                                                <div>
                                                    <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${block.config.tagBg} mb-1`}>
                                                        Status: {block.config.label}
                                                    </span>
                                                    <h4 className="font-bold text-slate-800">
                                                        Bidang: {block.names}
                                                    </h4>
                                                </div>
                                                <div className={`p-1 rounded-full transition-colors ${isOpen ? 'bg-black/5' : 'bg-transparent'}`}>
                                                    <RiArrowDownSLine size={24} className={`text-slate-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                                                </div>
                                            </button>
                                            
                                            <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                                                <div className="p-5">
                                                    {block.actions.length > 0 ? (
                                                        <ul className="space-y-3">
                                                            {block.actions.map((action: string, ai: number) => (
                                                                <li key={ai} className={`flex items-start gap-3 text-sm text-slate-700 bg-slate-50 rounded-xl px-4 py-3 border-l-4 ${block.config.actionBorder}`}>
                                                                    <span className={`shrink-0 font-black text-xs mt-0.5 ${block.config.accentColor}`}>{ai + 1}.</span>
                                                                    <span className="leading-relaxed font-medium">{action}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <p className="text-sm text-slate-500 italic">Tidak ada saran khusus yang tercatat.</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 4. Rincian Indikator Per Bidang */}
                        {sections.length > 0 && (
                            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-6 md:p-8">
                                <h3 className="text-lg font-black text-slate-800 mb-6 uppercase tracking-tight">Rincian Indikator Tiap Bidang</h3>
                                <div className="space-y-4">
                                    {sortedSections.map((sec: any, idx: number) => {
                                        const isOpen = openSectionIndex === idx;
                                        const levelInfo = getSectionLevelInfo(sec.score);
                                        const bKey = sec.title.split(' ')[1];
                                        const interpretation = (immInterpretations[bKey] as any)?.[levelInfo.text];
                                        
                                        return (
                                            <div key={idx} className={`border border-slate-200 rounded-2xl overflow-hidden transition-all ${isOpen ? 'shadow-md ring-2 ring-slate-100 bg-slate-50' : 'bg-white hover:shadow-sm'} border-l-4 ${levelInfo.borderStyle}`}>
                                                <button 
                                                    onClick={() => setOpenSectionIndex(isOpen ? null : idx)}
                                                    className={`w-full px-5 py-4 flex items-center justify-between transition-colors text-left ${isOpen ? 'bg-slate-50' : 'hover:bg-slate-50/70'}`}
                                                >
                                                    <h4 className="font-bold text-slate-800 flex-1">{sec.title}</h4>
                                                    <div className="flex items-center gap-3">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${levelInfo.style}`}>
                                                            {levelInfo.text} ({sec.score}/45)
                                                        </span>
                                                        <div className={`p-1 rounded-full transition-colors ${isOpen ? 'bg-slate-200' : 'bg-slate-100'}`}>
                                                            <RiArrowDownSLine size={20} className={`text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                                                        </div>
                                                    </div>
                                                </button>
                                                
                                                <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                                                    <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50">
                                                        {interpretation?.artinya && (
                                                            <p className="text-slate-600 text-sm leading-relaxed p-4 bg-white rounded-xl border border-slate-200 shadow-sm mb-4">
                                                                <span className="font-bold text-slate-700 block mb-1">Penjelasan Kategori ({levelInfo.text}):</span>
                                                                {interpretation.artinya}
                                                            </p>
                                                        )}
                                                        <h5 className="font-bold text-slate-700 text-xs uppercase tracking-wider mb-3">Detail Indikator:</h5>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                                                            {sec.indicators?.map((ind: any, j: number) => (
                                                                <div key={j} className="bg-white p-4 rounded-xl border border-slate-100 flex items-start justify-between gap-2 shadow-sm">
                                                                    <div>
                                                                        <p className="text-sm font-bold text-slate-700">{ind.code} - {ind.name}</p>
                                                                        <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-wider">Butir: {ind.items?.join(', ')}</p>
                                                                    </div>
                                                                    <div className="text-right shrink-0">
                                                                        <p className={`text-lg font-black ${ind.classification === 'Baik' ? 'text-emerald-500' : (ind.classification === 'Perlu Perhatian' ? 'text-amber-500' : 'text-red-500')}`}>
                                                                            {ind.score}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            {(!sec.indicators || sec.indicators.length === 0) && (
                                                                <p className="text-sm text-slate-400 italic">Rincian indikator tidak tersedia.</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Kolom Kanan / Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-6 md:p-8">
                            <h3 className="text-sm font-black text-slate-800 mb-6 uppercase tracking-widest text-center">Peta Masalah</h3>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                        <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 11, fontWeight: 700 }} />
                                        <PolarRadiusAxis angle={90} domain={[0, 45]} tick={false} axisLine={false} />
                                        <Radar name="Skor" dataKey="score" stroke="#8b5cf6" strokeWidth={2.5} fill="#a78bfa" fillOpacity={0.3} dot={{ r: 3, fill: '#8b5cf6' }} />
                                        <Tooltip cursor={{ stroke: '#8b5cf6', strokeWidth: 1 }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-6 md:p-8">
                            <h3 className="text-lg font-black text-slate-800 mb-6 uppercase tracking-tight">Data Profil</h3>
                            <div className="space-y-4 text-sm">
                                <div>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Tanggal Tes</p>
                                    <p className="font-bold text-slate-800">{new Date(data.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                </div>
                                <hr className="border-slate-100" />
                                <div>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Semester</p>
                                    <p className="font-bold text-slate-800">{data.semester || '-'}</p>
                                </div>
                                <hr className="border-slate-100" />
                                <div>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Jenis Kelamin</p>
                                    <p className="font-bold text-slate-800">{data.jenis_kelamin || '-'}</p>
                                </div>
                                <hr className="border-slate-100" />
                                <div>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">No HP</p>
                                    <p className="font-bold text-slate-800">{data.nomor_hp || '-'}</p>
                                </div>
                                <hr className="border-slate-100" />
                                <div>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">IPK Terakhir</p>
                                    <p className="font-bold text-slate-800">{data.ipk_terakhir || '-'}</p>
                                </div>
                                <hr className="border-slate-100" />
                                <div>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Status Semester Lalu</p>
                                    <p className="font-bold text-slate-800">{data.status_semester_lalu || '-'}</p>
                                </div>
                            </div>
                        </div>

                        {data.penutup && data.penutup.layanan_dipilih && (
                            <div className="bg-purple-50 rounded-[2rem] shadow-sm border border-purple-200 p-6 md:p-8">
                                <h3 className="text-lg font-black text-purple-900 mb-2 uppercase tracking-tight">Layanan Bantuan</h3>
                                <p className="text-sm text-purple-700 mb-4 font-medium">Mahasiswa tertarik dengan layanan:</p>
                                <div className="space-y-2">
                                    {data.penutup.layanan_dipilih.map((l: string, i: number) => (
                                        <div key={i} className="bg-white px-4 py-3 rounded-xl shadow-sm border border-purple-100 font-bold text-sm text-purple-800">
                                            {l}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}
