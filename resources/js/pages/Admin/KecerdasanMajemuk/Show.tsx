import AdminLayout from '@/layouts/AdminLayout';
import { Link } from '@inertiajs/react';
import { RiArrowLeftLine, RiBrainLine, RiStarFill } from '@remixicon/react';
import React from 'react';

// skor_per_kategori = { "Linguistik": { skor: 10, interpretasi: "Cukup kuat" } }
interface SkorItem { skor: number; interpretasi: string; }

const INTERP_CONFIG: Record<string, { color: string; bar: string }> = {
    'sangat kuat':          { color: 'bg-emerald-100 text-emerald-800 border-emerald-200', bar: 'from-emerald-400 to-emerald-600' },
    'cukup kuat':           { color: 'bg-blue-100 text-blue-800 border-blue-200',          bar: 'from-blue-400 to-blue-600' },
    'perlu dikembangkan':   { color: 'bg-amber-100 text-amber-800 border-amber-200',       bar: 'from-amber-400 to-amber-500' },
};

export default function Show({ data }: any) {
    const rawSkor: Record<string, SkorItem | number> = data.skor_per_kategori ?? {};

    // normalize: support both { skor, interpretasi } and plain number
    const normalize = (v: SkorItem | number): SkorItem => {
        if (typeof v === 'number') {
            const skor = v;
            const interpretasi = skor >= 13 ? 'Sangat Kuat' : skor >= 9 ? 'Cukup kuat' : 'Perlu dikembangkan';
            return { skor, interpretasi };
        }
        return v;
    };

    const entries = Object.entries(rawSkor)
        .map(([k, v]) => [k, normalize(v)] as [string, SkorItem])
        .sort((a, b) => b[1].skor - a[1].skor);

    const topCategory = entries[0]?.[0] ?? '-';
    const topSkor = entries[0]?.[1];

    return (
        <AdminLayout title={`Detail: ${data.nama}`}>
            <div className="max-w-3xl space-y-6">
                <Link href="/admin/kecerdasan-majemuk" className="flex items-center gap-2 text-slate-500 hover:text-purple-600 font-bold transition-colors">
                    <RiArrowLeftLine size={18} /> Kembali ke Daftar
                </Link>

                {/* Header card */}
                <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 text-white shadow-xl">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
                            <RiBrainLine size={32} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black">{data.nama}</h2>
                            <p className="text-purple-200 font-medium mt-0.5">{data.kelas} · {data.asal_sekolah}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-white/10 rounded-2xl p-4 backdrop-blur">
                            <p className="text-xs text-purple-200 uppercase font-black tracking-widest mb-1">Kode Unik</p>
                            <p className="font-mono font-bold">{data.kode_acak}</p>
                        </div>
                        <div className="bg-white/10 rounded-2xl p-4 backdrop-blur">
                            <p className="text-xs text-purple-200 uppercase font-black tracking-widest mb-1">Tanggal Tes</p>
                            <p className="font-bold">{new Date(data.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                        {data.bukti_follow && (
                            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur">
                                <p className="text-xs text-purple-200 uppercase font-black tracking-widest mb-1">Bukti Follow</p>
                                <a href={`/storage/${data.bukti_follow}`} target="_blank" rel="noopener noreferrer" className="text-yellow-300 font-bold text-sm hover:underline">Lihat Foto ↗</a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Top category highlight */}
                {topSkor && (
                    <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] p-6 shadow-xl border border-slate-100 flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-yellow-100 flex items-center justify-center flex-shrink-0">
                            <RiStarFill size={28} className="text-yellow-500" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-black tracking-widest mb-0.5">Kecerdasan Dominan</p>
                            <p className="text-xl font-black text-slate-800">{topCategory}</p>
                            <p className="text-sm text-slate-500 font-medium">Skor {topSkor.skor}/15 — <span className="text-emerald-600 font-bold">{topSkor.interpretasi}</span></p>
                        </div>
                    </div>
                )}

                {/* All categories */}
                <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 shadow-xl border border-slate-100">
                    <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-6">Profil Kecerdasan Lengkap</h3>
                    <div className="space-y-5">
                        {entries.map(([kategori, item], i) => {
                            const key = item.interpretasi?.toLowerCase().trim();
                            const cfg = INTERP_CONFIG[key] ?? INTERP_CONFIG['perlu dikembangkan'];
                            const pct = Math.min(100, Math.round((item.skor / 15) * 100));
                            return (
                                <div key={kategori}>
                                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                        <div className="flex items-center gap-2">
                                            {i === 0 && <RiStarFill size={14} className="text-yellow-400 flex-shrink-0" />}
                                            <span className="font-black text-slate-700">{kategori}</span>
                                        </div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-black text-purple-700 text-sm">{item.skor}/15</span>
                                            <span className={`text-xs font-black px-2.5 py-0.5 rounded-full border ${cfg.color} whitespace-nowrap`}>
                                                {item.interpretasi}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2.5">
                                        <div className={`h-2.5 rounded-full bg-gradient-to-r ${cfg.bar} transition-all`} style={{ width: `${pct}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
