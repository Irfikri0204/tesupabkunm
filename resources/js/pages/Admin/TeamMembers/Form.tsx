import AdminLayout from '@/layouts/AdminLayout';
import { router, useForm } from '@inertiajs/react';
import { RiSaveLine, RiArrowLeftLine, RiUploadCloud2Line } from '@remixicon/react';
import React, { useRef, useState } from 'react';
import ImageCropper from '@/Components/ImageCropper';

export default function Form({ model }: any) {
    const isEdit = !!model;
    const { data, setData, post, processing, errors } = useForm({
        name: model?.name ?? '',
        role: model?.role ?? '',
        division: model?.division ?? '',
        faculty: model?.faculty ?? '',
        type: model?.type ?? 'dosen',
        order: model?.order ?? 0,
        photo: null as File | null,
    });

    const [photoPreview, setPhotoPreview] = useState<string | null>(model?.photo_url ?? null);
    const [cropSource, setCropSource] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setCropSource(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const onCropComplete = (blob: Blob) => {
        const file = new File([blob], 'cropped_image.jpg', { type: 'image/jpeg' });
        setData('photo', file);
        setPhotoPreview(URL.createObjectURL(blob));
        setCropSource(null);
        if (fileRef.current) fileRef.current.value = ''; // Reset input
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            router.post(`/admin/team-members/${model.id}?_method=PUT`, data as any, {
                forceFormData: true,
            });
        } else {
            post('/admin/team-members', { forceFormData: true } as any);
        }
    };

    return (
        <AdminLayout title={isEdit ? `Edit: ${model.name}` : 'Tambah Anggota Tim'}>
            <div className="max-w-2xl">
                <button onClick={() => router.visit('/admin/team-members')} className="mb-6 flex items-center gap-2 text-slate-500 hover:text-purple-600 font-bold transition-colors">
                    <RiArrowLeftLine size={18} /> Kembali ke Daftar
                </button>

                {cropSource && (
                    <ImageCropper
                        image={cropSource}
                        onCropComplete={onCropComplete}
                        onCancel={() => { setCropSource(null); if (fileRef.current) fileRef.current.value = ''; }}
                        aspectRatio={3/4}
                    />
                )}

                <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 space-y-6">
                    <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight border-b border-slate-100 pb-4">
                        {isEdit ? 'Edit Anggota Tim' : 'Tambah Anggota Tim Baru'}
                    </h2>

                    {/* Photo Upload with Clickable Preview */}
                    <div className="flex flex-col items-center gap-4">
                        <div
                            className="relative h-44 w-32 rounded-[2rem] overflow-hidden ring-4 ring-purple-100 cursor-pointer group shadow-lg shadow-purple-100/50 transition-all hover:scale-105 active:scale-95"
                            onClick={() => fileRef.current?.click()}
                        >
                            {photoPreview ? (
                                <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
                            ) : (
                                <div className="h-full w-full bg-gradient-to-br from-purple-100 to-indigo-200 flex items-center justify-center">
                                    <RiUploadCloud2Line size={32} className="text-purple-500" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-purple-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                                <RiUploadCloud2Line size={24} />
                                <span className="text-[10px] font-black uppercase tracking-widest mt-1">Ubah Foto</span>
                            </div>
                        </div>
                        <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                        {errors.photo && <p className="text-xs text-red-500 font-bold">{errors.photo}</p>}
                    </div>

                    <div className="grid gap-5">
                        {/* Nama */}
                        <div>
                            <label className="block text-sm font-black text-slate-700 mb-1.5 uppercase tracking-wide">Nama Lengkap *</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                required
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all font-medium"
                                placeholder="Nama lengkap anggota"
                            />
                            {errors.name && <p className="mt-1 text-xs text-red-500 font-bold">{errors.name}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Role */}
                            <div>
                                <label className="block text-sm font-black text-slate-700 mb-1.5 uppercase tracking-wide">Jabatan / Role *</label>
                                <input
                                    type="text"
                                    value={data.role}
                                    onChange={e => setData('role', e.target.value)}
                                    required
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all font-medium"
                                    placeholder="Mis: Koordinator Divisi"
                                />
                            </div>

                            {/* Tipe */}
                            <div>
                                <label className="block text-sm font-black text-slate-700 mb-1.5 uppercase tracking-wide">Kategori Anggota *</label>
                                <select
                                    value={data.type}
                                    onChange={e => setData('type', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all font-black text-slate-700"
                                >
                                    <option value="dosen">UPA BK UNM (Dosen/Staff)</option>
                                    <option value="konselor-sebaya">KONSELOR SEBAYA</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Divisi */}
                            <div>
                                <label className="block text-sm font-black text-slate-700 mb-1.5 uppercase tracking-wide">Divisi / Program</label>
                                <input
                                    type="text"
                                    value={data.division}
                                    onChange={e => setData('division', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all font-medium"
                                    placeholder="Mis: Layanan Konseling"
                                />
                            </div>

                            {/* Fakultas */}
                            <div>
                                <label className="block text-sm font-black text-slate-700 mb-1.5 uppercase tracking-wide">Instansi / Fakultas</label>
                                <input
                                    type="text"
                                    value={data.faculty}
                                    onChange={e => setData('faculty', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all font-medium"
                                    placeholder="Mis: FIP"
                                />
                            </div>
                        </div>

                        {/* Order */}
                        <div className="hidden">
                            <label className="block text-sm font-black text-slate-700 mb-1.5 uppercase tracking-wide">Urutan Tampil</label>
                            <input
                                type="number"
                                value={data.order}
                                onChange={e => setData('order', parseInt(e.target.value))}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all"
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-10 py-4 rounded-2xl font-black hover:shadow-xl hover:shadow-purple-200 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-wait uppercase tracking-widest text-sm"
                        >
                            <RiSaveLine size={20} />
                            {processing ? 'Proses...' : 'SIMPAN DATA TIM'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
