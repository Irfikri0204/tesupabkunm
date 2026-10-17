import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import {
    RiAddLine,
    RiDeleteBin2Line,
    RiEdit2Line,
    RiCheckLine,
    RiCloseLine,
    RiBookOpenLine,
    RiGraduationCapLine,
    RiArrowDownSLine,
    RiArrowUpSLine
} from '@remixicon/react';
import React, { useState } from 'react';

interface Prodi {
    id: number;
    fakultas_id: number;
    name: string;
}

interface Fakultas {
    id: number;
    name: string;
    prodis?: Prodi[];
}

interface Props {
    fakultas: Fakultas[];
}

export default function Index({ fakultas }: Props) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editItem, setEditItem] = useState<Fakultas | null>(null);

    // Prodi modal state
    const [addProdiFakultas, setAddProdiFakultas] = useState<Fakultas | null>(null);
    const [editProdiItem, setEditProdiItem] = useState<{ prodi: Prodi; fakultasName: string } | null>(null);
    const [expandedFakultasId, setExpandedFakultasId] = useState<number | null>(null);

    // Fakultas forms
    const { data: addData, setData: setAddData, post: postAdd, processing: processingAdd, reset: resetAdd, errors: addErrors } = useForm({
        name: '',
    });

    const { data: editData, setData: setEditData, put: putEdit, processing: processingEdit, reset: resetEdit, errors: editErrors } = useForm({
        name: '',
    });

    // Prodi forms
    const { data: addProdiData, setData: setAddProdiData, post: postAddProdi, processing: processingAddProdi, reset: resetAddProdi, errors: addProdiErrors } = useForm({
        fakultas_id: 0,
        name: '',
    });

    const { data: editProdiData, setData: setEditProdiData, put: putEditProdi, processing: processingEditProdi, reset: resetEditProdi, errors: editProdiErrors } = useForm({
        name: '',
    });

    // Fakultas Handlers
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
        if (!confirm('Yakin ingin menghapus fakultas ini? Semua program studi di dalamnya juga akan terhapus.')) return;
        router.delete(`/admin/fakultas/${id}`);
    };

    // Prodi Handlers
    const openAddProdiModal = (f: Fakultas) => {
        resetAddProdi();
        setAddProdiData({
            fakultas_id: f.id,
            name: '',
        });
        setAddProdiFakultas(f);
    };

    const handleAddProdiSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postAddProdi('/admin/prodis', {
            onSuccess: () => {
                const facId = addProdiFakultas?.id;
                setAddProdiFakultas(null);
                resetAddProdi();
                if (facId) setExpandedFakultasId(facId);
            },
        });
    };

    const openEditProdiModal = (prodi: Prodi, fakultasName: string) => {
        setEditProdiItem({ prodi, fakultasName });
        setEditProdiData('name', prodi.name);
    };

    const handleEditProdiSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editProdiItem) return;
        putEditProdi(`/admin/prodis/${editProdiItem.prodi.id}`, {
            onSuccess: () => {
                setEditProdiItem(null);
                resetEditProdi();
            },
        });
    };

    const handleDeleteProdi = (id: number) => {
        if (!confirm('Yakin ingin menghapus program studi / jurusan ini?')) return;
        router.delete(`/admin/prodis/${id}`);
    };

    const toggleExpand = (id: number) => {
        setExpandedFakultasId(prev => prev === id ? null : id);
    };

    return (
        <AdminLayout title="Kelola Fakultas & Program Studi">
            <Head title="Kelola Fakultas & Program Studi" />

            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">Daftar Fakultas & Program Studi</h1>
                    <p className="text-slate-500 text-sm mt-1">Kelola daftar fakultas dan jurusan untuk form pendaftaran konseling mahasiswa.</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 bg-primary hover:bg-purple-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm active:scale-95"
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
                            <th className="p-4 font-bold text-slate-700 text-sm text-center w-40">Program Studi</th>
                            <th className="p-4 font-bold text-slate-700 text-sm w-44 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fakultas.length > 0 ? (
                            fakultas.map((f, idx) => {
                                const isExpanded = expandedFakultasId === f.id;
                                const prodiCount = f.prodis?.length || 0;
                                return (
                                    <React.Fragment key={f.id}>
                                        <tr className={`border-b border-slate-100 transition-colors ${isExpanded ? 'bg-purple-50/40' : 'hover:bg-slate-50/50'}`}>
                                            <td className="p-4 text-center text-slate-500 text-sm font-semibold">{idx + 1}</td>
                                            <td className="p-4 font-bold text-slate-800">
                                                <div className="flex items-center gap-2">
                                                    <RiBookOpenLine className="w-5 h-5 text-primary shrink-0" />
                                                    <span>{f.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-center">
                                                <button
                                                    onClick={() => toggleExpand(f.id)}
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                                                        prodiCount > 0
                                                            ? 'bg-purple-100 text-primary hover:bg-purple-200'
                                                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                                    }`}
                                                >
                                                    <RiGraduationCapLine className="w-4 h-4" />
                                                    {prodiCount} Prodi
                                                    {isExpanded ? <RiArrowUpSLine className="w-4 h-4 ml-0.5" /> : <RiArrowDownSLine className="w-4 h-4 ml-0.5" />}
                                                </button>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex justify-center items-center gap-1.5">
                                                    <button
                                                        onClick={() => openAddProdiModal(f)}
                                                        title="Tambah Prodi ke Fakultas ini"
                                                        className="px-2.5 py-1.5 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg flex items-center gap-1 transition-colors"
                                                    >
                                                        <RiAddLine className="w-4 h-4" /> Prodi
                                                    </button>
                                                    <button
                                                        onClick={() => openEditModal(f)}
                                                        title="Edit Nama Fakultas"
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    >
                                                        <RiEdit2Line className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(f.id)}
                                                        title="Hapus Fakultas"
                                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <RiDeleteBin2Line className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>

                                        {/* Expanded Row for Prodis */}
                                        {isExpanded && (
                                            <tr className="bg-purple-50/20 border-b border-purple-100">
                                                <td colSpan={4} className="p-6">
                                                    <div className="bg-white rounded-2xl border border-purple-100 p-5 shadow-xs">
                                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                                                            <div className="flex items-center gap-2">
                                                                <RiGraduationCapLine className="w-5 h-5 text-primary" />
                                                                <h4 className="font-bold text-sm text-slate-800">
                                                                    Program Studi / Jurusan di <span className="text-primary">{f.name}</span>
                                                                </h4>
                                                            </div>
                                                            <button
                                                                onClick={() => openAddProdiModal(f)}
                                                                className="flex items-center gap-1.5 bg-primary hover:bg-purple-900 text-white px-3.5 py-1.5 rounded-lg font-bold text-xs transition-colors shadow-xs"
                                                            >
                                                                <RiAddLine className="w-4 h-4" /> Tambah Program Studi
                                                            </button>
                                                        </div>

                                                        {f.prodis && f.prodis.length > 0 ? (
                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                                {f.prodis.map((p, pIdx) => (
                                                                    <div
                                                                        key={p.id}
                                                                        className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-white rounded-xl border border-slate-200/80 hover:border-purple-200 hover:shadow-xs transition-all"
                                                                    >
                                                                        <div className="flex items-center gap-2.5 truncate mr-2">
                                                                            <span className="w-6 h-6 rounded-lg bg-purple-100 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                                                                                {pIdx + 1}
                                                                            </span>
                                                                            <span className="text-sm font-semibold text-slate-800 truncate" title={p.name}>
                                                                                {p.name}
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex items-center gap-1 shrink-0">
                                                                            <button
                                                                                onClick={() => openEditProdiModal(p, f.name)}
                                                                                title="Edit Nama Prodi"
                                                                                className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                                            >
                                                                                <RiEdit2Line className="w-4 h-4" />
                                                                            </button>
                                                                            <button
                                                                                onClick={() => handleDeleteProdi(p.id)}
                                                                                title="Hapus Prodi"
                                                                                className="p-1 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                                            >
                                                                                <RiDeleteBin2Line className="w-4 h-4" />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                                                <p className="text-slate-500 text-sm">Belum ada program studi yang ditambahkan untuk fakultas ini.</p>
                                                                <button
                                                                    onClick={() => openAddProdiModal(f)}
                                                                    className="mt-2 text-primary font-bold text-xs hover:underline inline-flex items-center gap-1"
                                                                >
                                                                    <RiAddLine className="w-3.5 h-3.5" /> Klik di sini untuk menambah prodi
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-slate-500">
                                    Belum ada data fakultas.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Tambah Fakultas */}
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

            {/* Modal Edit Fakultas */}
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

            {/* Modal Tambah Prodi */}
            {addProdiFakultas && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <div>
                                <h3 className="font-bold text-lg flex items-center gap-2"><RiGraduationCapLine className="text-primary"/> Tambah Program Studi</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Fakultas: <strong className="text-slate-700">{addProdiFakultas.name}</strong></p>
                            </div>
                            <button onClick={() => setAddProdiFakultas(null)} className="text-slate-400 hover:text-red-500"><RiCloseLine/></button>
                        </div>
                        <form onSubmit={handleAddProdiSubmit} className="p-5">
                            <div className="mb-4">
                                <label className="block text-sm font-bold text-slate-700 mb-2">Nama Program Studi / Jurusan</label>
                                <input
                                    type="text"
                                    value={addProdiData.name}
                                    onChange={e => setAddProdiData('name', e.target.value)}
                                    className="w-full border-slate-200 rounded-xl focus:ring-primary focus:border-primary p-3 bg-slate-50 outline-none"
                                    placeholder="Contoh: S1 Psikologi"
                                    required
                                    autoFocus
                                />
                                {addProdiErrors.name && <p className="text-red-500 text-xs mt-1">{addProdiErrors.name}</p>}
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button type="button" onClick={() => setAddProdiFakultas(null)} className="px-4 py-2 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg">Batal</button>
                                <button type="submit" disabled={processingAddProdi} className="px-4 py-2 font-bold text-white bg-primary hover:bg-purple-900 rounded-lg disabled:opacity-50 flex items-center gap-1">
                                    <RiCheckLine className="w-5 h-5"/> Simpan Prodi
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Edit Prodi */}
            {editProdiItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <div>
                                <h3 className="font-bold text-lg flex items-center gap-2"><RiEdit2Line className="text-blue-600"/> Edit Program Studi</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Fakultas: <strong className="text-slate-700">{editProdiItem.fakultasName}</strong></p>
                            </div>
                            <button onClick={() => setEditProdiItem(null)} className="text-slate-400 hover:text-red-500"><RiCloseLine/></button>
                        </div>
                        <form onSubmit={handleEditProdiSubmit} className="p-5">
                            <div className="mb-4">
                                <label className="block text-sm font-bold text-slate-700 mb-2">Nama Program Studi / Jurusan</label>
                                <input
                                    type="text"
                                    value={editProdiData.name}
                                    onChange={e => setEditProdiData('name', e.target.value)}
                                    className="w-full border-slate-200 rounded-xl focus:ring-primary focus:border-primary p-3 bg-slate-50 outline-none"
                                    required
                                    autoFocus
                                />
                                {editProdiErrors.name && <p className="text-red-500 text-xs mt-1">{editProdiErrors.name}</p>}
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button type="button" onClick={() => setEditProdiItem(null)} className="px-4 py-2 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg">Batal</button>
                                <button type="submit" disabled={processingEditProdi} className="px-4 py-2 font-bold text-white bg-primary hover:bg-purple-900 rounded-lg disabled:opacity-50 flex items-center gap-1">
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
