import AdminLayout from '@/layouts/AdminLayout';
import { Link } from '@inertiajs/react';
import { RiArrowLeftLine, RiUserLine, RiCalendarLine, RiHeartLine } from '@remixicon/react';
import React from 'react';

interface ShowProps {
    data: any;
    title: string;
    backUrl: string;
    color: string; // gradient e.g. 'from-orange-500 to-red-600'
    categoryLabel?: string;
    icon?: React.ReactNode;
}

export function TesShow({ data, title, backUrl, color, icon }: ShowProps) {
    const KATEGORI_COLOR: Record<string, string> = {
        'Positif':             'bg-emerald-100 text-emerald-700 border-emerald-200',
        'Negatif':             'bg-red-100 text-red-700 border-red-200',
        'Seimbang':            'bg-yellow-100 text-yellow-700 border-yellow-200',
        'visual':              'bg-blue-100 text-blue-700 border-blue-200',
        'auditory':            'bg-purple-100 text-purple-700 border-purple-200',
        'kinesthetic':         'bg-green-100 text-green-700 border-green-200',
        'Sangat Puas':         'bg-emerald-100 text-emerald-700 border-emerald-200',
        'Puas':                'bg-blue-100 text-blue-700 border-blue-200',
        'Biasa':               'bg-yellow-100 text-yellow-700 border-yellow-200',
        'Kurang Puas':         'bg-orange-100 text-orange-700 border-orange-200',
        'Tidak Puas':          'bg-red-100 text-red-700 border-red-200',
        'Tidak Berisiko':      'bg-emerald-100 text-emerald-700 border-emerald-200',
        'Berisiko Gangguan':   'bg-red-100 text-red-700 border-red-200',
    };

    const badgeColor = KATEGORI_COLOR[data.kategori] ?? 'bg-indigo-100 text-indigo-700 border-indigo-200';

    return (
        <AdminLayout title={`Detail: ${data.nama}`}>
            <div className="max-w-2xl">
                <Link href={backUrl} className="mb-6 flex items-center gap-2 text-slate-500 hover:text-purple-600 font-bold transition-colors">
                    <RiArrowLeftLine size={18} /> Kembali ke Daftar
                </Link>

                <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    {/* Header */}
                    <div className={`bg-gradient-to-br ${color} p-8 text-white`}>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                                {icon ?? <RiUserLine size={32} />}
                            </div>
                            <div>
                                <h2 className="text-2xl font-black">{data.nama}</h2>
                                <p className="text-white/80 font-medium mt-0.5">{title}</p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 space-y-6">
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                            <div className="p-4 bg-slate-50 rounded-2xl">
                                <p className="text-xs text-slate-500 uppercase font-black tracking-widest mb-1">Tanggal Lahir</p>
                                <p className="font-bold text-slate-800">{data.tanggal_lahir}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl">
                                <p className="text-xs text-slate-500 uppercase font-black tracking-widest mb-1">Jenis Kelamin</p>
                                <p className="font-bold text-slate-800">{data.jenis_kelamin}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl">
                                <p className="text-xs text-slate-500 uppercase font-black tracking-widest mb-1">Tanggal Tes</p>
                                <p className="font-bold text-slate-800">{new Date(data.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            </div>
                        </div>

                        {/* Result */}
                        <div className={`rounded-2xl border p-6 ${badgeColor}`}>
                            <div className="flex items-center justify-between gap-4">
                                <div className="min-w-0">
                                    <p className="text-xs font-black uppercase tracking-widest mb-1 opacity-70">Hasil Tes</p>
                                    <p className="text-2xl sm:text-3xl font-black truncate">{data.kategori}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-xs font-black uppercase tracking-widest mb-1 opacity-70">Total Skor</p>
                                    <p className="text-4xl sm:text-5xl font-black">{data.total_skor}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
