import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { RiAddLine, RiDeleteBin2Line, RiEdit2Line, RiCheckLine, RiCloseLine, RiBookOpenLine } from '@remixicon/react';
import { useState } from 'react';

interface Fakultas {
    id: number;
    name: string;
}

interface Props {
    fakultas: Fakultas[];
}

export default function Index({ fakultas }: Props) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editItem, setEditItem] = useState<Fakultas | null>(null);

    const { data: addData, setData: setAddData, post: postAdd, processing: processingAdd, reset: resetAdd, errors: addErrors } = useForm({
        name: '',
    });

    const { data: editData, setData: setEditData, put: putEdit, processing: processingEdit, reset: resetEdit, errors: editErrors } = useForm({
        name: '',
    });

    const openAddModal = () => {
        resetAdd();
        setIsAddModalOpen(true);
    };

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postAdd('/admin/fakultas', {
            onSuccess: () => {
                setIsAddModalOpen(false);
                resetAdd();
            },
        });
    };

    const openEditModal = (item: Fakultas) => {
        setEditItem(item);
        setEditData('name', item.name);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editItem) return;
        putEdit(`/admin/fakultas/${editItem.id}`, {
            onSuccess: () => {
                setEditItem(null);
                resetEdit();
            },
        });
    };

    const handleDelete = (id: number) => {
        if (!confirm('Yakin ingin menghapus fakultas ini?')) return;
        router.delete(`/admin/fakultas/${id}`);
    };

    return (
        <AdminLayout title="Kelola Fakultas">
            <Head title="Kelola Fakultas" />

            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Daftar Fakultas</h1>
                    <p className="text-slate-500 text-sm">Kelola daftar fakultas untuk form pendaftaran konseling mahasiswa.</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 bg-primary hover:bg-purple-900 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm"
                >
                    <RiAddLine className="w-5 h-5" /> Tambah Fakultas
                </button>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="p-4 font-bold text-slate-700 text-sm w-16 text-center">No</th>
                            <th className="p-4 font-bold text-slate-700 text-sm">Nama Fakultas</th>
                            <th className="p-4 font-bold text-slate-700 text-sm w-32 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fakultas.length > 0 ? (
                            fakultas.map((f, idx) => (
                                <tr key={f.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                                    <td className="p-4 text-center text-slate-500 text-sm">{idx + 1}</td>
                                    <td className="p-4 font-medium text-slate-800">{f.name}</td>
                                    <td className="p-4">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => openEditModal(f)}
                                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <RiEdit2Line className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(f.id)}
                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <RiDeleteBin2Line className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="p-8 text-center text-slate-500">
                                    Belum ada data fakultas.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Tambah */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-lg flex items-center gap-2"><RiBookOpenLine/> Tambah Fakultas</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-red-500"><RiCloseLine/></button>
                        </div>
                        <form onSubmit={handleAddSubmit} className="p-5">
                            <div className="mb-4">
                                <label className="block text-sm font-bold text-slate-700 mb-2">Nama Fakultas</label>
                                <input
                                    type="text"
                                    value={addData.name}
                                    onChange={e => setAddData('name', e.target.value)}
                                    className="w-full border-slate-200 rounded-xl focus:ring-primary focus:border-primary p-3 bg-slate-50 outline-none"
                                    placeholder="Contoh: Fakultas Psikologi"
                                    required
                                />
                                {addErrors.name && <p className="text-red-500 text-xs mt-1">{addErrors.name}</p>}
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg">Batal</button>
                                <button type="submit" disabled={processingAdd} className="px-4 py-2 font-bold text-white bg-primary hover:bg-purple-900 rounded-lg disabled:opacity-50 flex items-center gap-1">
                                    <RiCheckLine className="w-5 h-5"/> Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Edit */}
            {editItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-lg flex items-center gap-2"><RiEdit2Line/> Edit Fakultas</h3>
                            <button onClick={() => setEditItem(null)} className="text-slate-400 hover:text-red-500"><RiCloseLine/></button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="p-5">
                            <div className="mb-4">
                                <label className="block text-sm font-bold text-slate-700 mb-2">Nama Fakultas</label>
                                <input
                                    type="text"
                                    value={editData.name}
                                    onChange={e => setEditData('name', e.target.value)}
                                    className="w-full border-slate-200 rounded-xl focus:ring-primary focus:border-primary p-3 bg-slate-50 outline-none"
                                    required
                                />
                                {editErrors.name && <p className="text-red-500 text-xs mt-1">{editErrors.name}</p>}
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button type="button" onClick={() => setEditItem(null)} className="px-4 py-2 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg">Batal</button>
                                <button type="submit" disabled={processingEdit} className="px-4 py-2 font-bold text-white bg-primary hover:bg-purple-900 rounded-lg disabled:opacity-50 flex items-center gap-1">
                                    <RiCheckLine className="w-5 h-5"/> Simpan Perubahan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
