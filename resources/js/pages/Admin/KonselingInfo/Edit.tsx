import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { RiCheckLine, RiInformationLine, RiTimeLine, RiMapPinLine, RiComputerLine, RiShieldCheckLine, RiPhoneLine, RiMailLine } from '@remixicon/react';

interface Props {
    data: Record<string, string>;
    labels: Record<string, string>;
}

const fieldIcons: Record<string, JSX.Element> = {
    konseling_info_jam:    <RiTimeLine className="w-5 h-5 text-primary" />,
    konseling_info_lokasi: <RiMapPinLine className="w-5 h-5 text-blue-600" />,
    konseling_info_daring: <RiComputerLine className="w-5 h-5 text-teal-600" />,
    konseling_info_syarat: <RiShieldCheckLine className="w-5 h-5 text-amber-600" />,
    konseling_info_kontak: <RiPhoneLine className="w-5 h-5 text-green-600" />,
    konseling_info_email:  <RiMailLine className="w-5 h-5 text-rose-600" />,
};

const fieldColors: Record<string, string> = {
    konseling_info_jam:    'from-purple-50 to-indigo-50 border-purple-100',
    konseling_info_lokasi: 'from-blue-50 to-cyan-50 border-blue-100',
    konseling_info_daring: 'from-teal-50 to-emerald-50 border-teal-100',
    konseling_info_syarat: 'from-amber-50 to-yellow-50 border-amber-100',
    konseling_info_kontak: 'from-green-50 to-lime-50 border-green-100',
    konseling_info_email:  'from-rose-50 to-pink-50 border-rose-100',
};

export default function Edit({ data, labels }: Props) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;

    const { data: formData, setData, post, processing, errors } = useForm<Record<string, string>>(
        Object.fromEntries(Object.keys(labels).map(k => [k, data[k] ?? '']))
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/konseling-info');
    };

    return (
        <AdminLayout title="Info Konseling">
            <Head title="Edit Informasi Konseling" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Informasi Layanan Konseling</h1>
                <p className="text-slate-500 text-sm mt-1">
                    Teks yang diatur di sini akan tampil pada halaman pendaftaran konseling publik.
                </p>
            </div>

            {flash?.success && (
                <div className="mb-6 flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 px-5 py-3.5 rounded-xl text-sm font-semibold">
                    <RiCheckLine className="w-5 h-5 text-emerald-500" />
                    {flash.success}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                    {Object.keys(labels).map(key => (
                        <div key={key} className={`bg-gradient-to-br ${fieldColors[key] || 'from-slate-50 to-slate-100 border-slate-200'} border rounded-2xl p-5`}>
                            <div className="flex items-center gap-2.5 mb-3">
                                <div className="w-9 h-9 rounded-xl bg-white/70 flex items-center justify-center">
                                    {fieldIcons[key] || <RiInformationLine className="w-5 h-5 text-slate-500" />}
                                </div>
                                <label className="text-sm font-bold text-slate-700">{labels[key]}</label>
                            </div>
                            {key === 'konseling_info_kontak' ? (
                                <input
                                    type="text"
                                    value={formData[key]}
                                    onChange={e => setData(key, e.target.value)}
                                    placeholder="Contoh: 6281234567890"
                                    className="w-full bg-white/80 rounded-xl border border-white/50 p-3 text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-400 outline-none transition-all"
                                />
                            ) : key === 'konseling_info_email' ? (
                                <input
                                    type="email"
                                    value={formData[key]}
                                    onChange={e => setData(key, e.target.value)}
                                    placeholder="Contoh: upabk@unm.ac.id"
                                    className="w-full bg-white/80 rounded-xl border border-white/50 p-3 text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 outline-none transition-all"
                                />
                            ) : (
                                <textarea
                                    rows={3}
                                    value={formData[key]}
                                    onChange={e => setData(key, e.target.value)}
                                    className="w-full bg-white/80 rounded-xl border border-white/50 p-3 text-sm resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                />
                            )}
                            {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
                        </div>
                    ))}
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex items-center gap-2 px-8 py-3 bg-primary hover:bg-purple-900 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-primary/30 disabled:opacity-60"
                    >
                        <RiCheckLine className="w-5 h-5" />
                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
