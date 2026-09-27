import AdminLayout from '@/layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { RiToggleLine, RiToggleFill } from '@remixicon/react';
import React from 'react';

const TEST_LABELS: Record<string, string> = {
    'gayabelajar': 'Tes Kenali Gaya Belajarmu',
    'panas': 'Tes Pola Emosimu (PANAS)',
    'swls': 'Tes Dimensi Kepuasan Hidup (SWLS)',
    'srq20': 'Tes Kenali Kesehatan Mentalmu (SRQ-20)',
    'kecerdasan-majemuk': 'Tes Kecerdasan Majemuk Siswa',
};

function ToggleRow({ item }: { item: any }) {
    const toggle = () => {
        const newValue = !item.is_open;
        router.put(`/admin/test-settings/${item.id}`, { is_open: newValue }, {
            preserveScroll: true,
        });
    };

    return (
        <div className="flex items-center justify-between p-5 rounded-2xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50/30 transition-all group">
            <div>
                <h3 className="font-black text-slate-800">{TEST_LABELS[item.slug] ?? item.name}</h3>
                <p className="text-sm text-slate-500 mt-0.5">
                    Slug: <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">{item.slug}</span>
                </p>
            </div>
            <div className="flex items-center gap-3">
                <span className={`text-xs font-black uppercase px-3 py-1 rounded-full ${item.is_open ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                    {item.is_open ? 'Dibuka' : 'Ditutup'}
                </span>
                <button
                    onClick={toggle}
                    className={`text-4xl transition-colors ${item.is_open ? 'text-emerald-500 hover:text-emerald-600' : 'text-slate-300 hover:text-slate-400'}`}
                    title={item.is_open ? 'Klik untuk menutup tes' : 'Klik untuk membuka tes'}
                >
                    {item.is_open ? <RiToggleFill size={48} /> : <RiToggleLine size={48} />}
                </button>
            </div>
        </div>
    );
}

export default function Index({ data }: any) {
    return (
        <AdminLayout title="Pengaturan Tes">
            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50">
                    <h3 className="text-lg font-black text-slate-800 tracking-tight uppercase">Status Buka/Tutup Tes</h3>
                    <p className="text-sm text-slate-500 mt-1">Aktifkan atau nonaktifkan setiap tes dengan menekan toggle di sebelah kanan.</p>
                </div>
                <div className="p-6 space-y-3">
                    {data.map((item: any) => (
                        <ToggleRow key={item.id} item={item} />
                    ))}
                    {data.length === 0 && (
                        <p className="text-center text-slate-400 py-12 font-medium">Tidak ada pengaturan tes ditemukan.</p>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
