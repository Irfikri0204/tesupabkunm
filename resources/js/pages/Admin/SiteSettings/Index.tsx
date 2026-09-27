import AdminLayout from '@/layouts/AdminLayout';
import { useForm } from '@inertiajs/react';
import { RiSaveLine } from '@remixicon/react';
import React from 'react';

const SETTING_ICONS: Record<string, string> = {
    'instagram_url': '📸',
    'whatsapp_number': '💬',
    'email': '📧',
    'address': '📍',
    'phone': '📞',
};

function SettingRow({ item }: { item: any }) {
    const { data, setData, put, processing, isDirty } = useForm({
        value: item.value ?? '',
    });

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/site-settings/${item.id}`, { preserveScroll: true } as any);
    };

    return (
        <form onSubmit={handleSave} className="rounded-2xl border border-slate-100 p-5 hover:border-purple-200 hover:bg-purple-50/20 transition-all">
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                {SETTING_ICONS[item.key] ?? '⚙️'} {item.label ?? item.key}
            </label>
            <div className="flex gap-3">
                <input
                    type="text"
                    value={data.value}
                    onChange={e => setData('value', e.target.value)}
                    className="flex-1 rounded-xl border border-slate-200 bg-white p-3 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all text-sm font-medium"
                    placeholder={`Masukkan ${item.label ?? item.key}...`}
                />
                <button
                    type="submit"
                    disabled={processing || !isDirty}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-3 rounded-xl font-bold text-sm hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <RiSaveLine size={16} />
                    {processing ? 'Simpan...' : 'Simpan'}
                </button>
            </div>
        </form>
    );
}

export default function Index({ data }: any) {
    return (
        <AdminLayout title="Situs & Kontak">
            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50">
                    <h3 className="text-lg font-black text-slate-800 tracking-tight uppercase">Pengaturan Situs & Kontak</h3>
                    <p className="text-sm text-slate-500 mt-1">Edit setiap pengaturan lalu klik "Simpan" untuk menyimpan perubahannya.</p>
                </div>
                <div className="p-6 space-y-4">
                    {data.map((item: any) => (
                        <SettingRow key={item.id} item={item} />
                    ))}
                    {data.length === 0 && (
                        <p className="text-center text-slate-400 py-12 font-medium">Tidak ada pengaturan situs ditemukan.</p>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
