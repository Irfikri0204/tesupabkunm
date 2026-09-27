import AdminLayout from '@/layouts/AdminLayout';
import { useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { RiGlobalLine, RiAddLine, RiEditLine, RiDeleteBinLine, RiExternalLinkLine, RiCloseLine } from '@remixicon/react';

interface Website {
    id: number;
    name: string;
    description: string | null;
    url: string;
    is_active: boolean;
    order: number;
}

function WebsiteModal({
    website,
    onClose,
}: {
    website?: Website | null;
    onClose: () => void;
}) {
    const isEdit = !!website;
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: website?.name ?? '',
        description: website?.description ?? '',
        url: website?.url ?? '',
        is_active: website?.is_active ?? true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(`/admin/linked-websites/${website!.id}`, {
                onSuccess: () => { reset(); onClose(); },
            });
        } else {
            post('/admin/linked-websites', {
                onSuccess: () => { reset(); onClose(); },
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 relative">
                <button onClick={onClose} className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 transition">
                    <RiCloseLine className="w-5 h-5 text-slate-500" />
                </button>
                <h2 className="text-xl font-black text-slate-800 mb-6">
                    {isEdit ? '✏️ Edit Website' : '➕ Tambah Website'}
                </h2>
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Nama Website</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                            placeholder="E-Career Growth Mindset"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Deskripsi</label>
                        <textarea
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            rows={2}
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                            placeholder="Platform karir dan growth mindset mahasiswa..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">URL Website</label>
                        <input
                            type="url"
                            value={data.url}
                            onChange={e => setData('url', e.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                            placeholder="https://ecareergrowth.com"
                        />
                        {errors.url && <p className="text-red-500 text-xs mt-1">{errors.url}</p>}
                    </div>



                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="is_active"
                            checked={data.is_active}
                            onChange={e => setData('is_active', e.target.checked)}
                            className="w-4 h-4 rounded text-purple-500"
                        />
                        <label htmlFor="is_active" className="text-sm font-bold text-slate-700">Aktif (tampil di halaman)</label>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-sm font-bold hover:from-purple-500 hover:to-indigo-500 transition disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function LinkedWebsitesIndex({ websites }: { websites: Website[] }) {
    const [showModal, setShowModal] = useState(false);
    const [editTarget, setEditTarget] = useState<Website | null>(null);

    const handleDelete = (id: number) => {
        if (!confirm('Hapus website ini?')) return;
        router.delete(`/admin/linked-websites/${id}`);
    };

    return (
        <AdminLayout title="Web Lainnya">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">Kelola Web Lainnya</h1>
                    <p className="text-sm text-slate-500 mt-1">Tambahkan dan kelola daftar platform web milik UPA BK UNM</p>
                </div>
                <button
                    onClick={() => { setEditTarget(null); setShowModal(true); }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-purple-500/20 hover:from-purple-500 hover:to-indigo-500 transition"
                >
                    <RiAddLine className="w-5 h-5" />
                    Tambah Website
                </button>
            </div>

            {websites.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-16 text-center">
                    <div className="inline-flex w-20 h-20 bg-slate-100 rounded-full items-center justify-center mb-4">
                        <RiGlobalLine className="w-10 h-10 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-700 mb-2">Belum ada website terdaftar</h3>
                    <p className="text-sm text-slate-500">Klik tombol "Tambah Website" untuk mulai menambahkan.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {websites.map((site) => (
                        <div
                            key={site.id}
                            className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden hover:-translate-y-1 transition-transform"
                        >
                            {/* Color bar top */}
                            <div className="h-2 bg-primary" />

                            <div className="p-6">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-md bg-primary"
                                        >
                                            <RiGlobalLine className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-slate-800 text-sm">{site.name}</h3>
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${site.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                                {site.is_active ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {site.description && (
                                    <p className="text-sm text-slate-500 mb-4 leading-relaxed">{site.description}</p>
                                )}

                                <a
                                    href={site.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-800 transition mb-5 truncate"
                                >
                                    <RiExternalLinkLine className="w-3.5 h-3.5 shrink-0" />
                                    {site.url}
                                </a>

                                <div className="flex gap-2 pt-4 border-t border-slate-100">
                                    <button
                                        onClick={() => { setEditTarget(site); setShowModal(true); }}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition"
                                    >
                                        <RiEditLine className="w-4 h-4" /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(site.id)}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition"
                                    >
                                        <RiDeleteBinLine className="w-4 h-4" /> Hapus
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <WebsiteModal
                    website={editTarget}
                    onClose={() => { setShowModal(false); setEditTarget(null); }}
                />
            )}
        </AdminLayout>
    );
}
