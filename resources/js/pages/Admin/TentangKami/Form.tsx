import React, { useState, useRef } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { router, useForm } from '@inertiajs/react';
import { RiSaveLine, RiImageAddLine, RiDeleteBin6Line, RiMapPinLine, RiPhoneLine, RiMailSendLine, RiInstagramLine } from '@remixicon/react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

export default function Form({
    visi_text,
    misi_text,
    struktur_organisasi_image,
    contact_address,
    contact_phone,
    contact_email,
    contact_instagram,
    konselor_sebaya_title,
    konselor_sebaya_desc,
    konselor_sebaya_image,
}: any) {
    const [activeTab, setActiveTab] = useState<'visi' | 'struktur' | 'kontak' | 'konselor'>('visi');
    
    const { data, setData, post, processing, errors } = useForm({
        visi_text: visi_text || '',
        misi_text: misi_text || '',
        struktur_organisasi_image: null as File | null,
        contact_address: contact_address || '',
        contact_phone: contact_phone || '',
        contact_email: contact_email || '',
        contact_instagram: contact_instagram || '',
        konselor_sebaya_title: konselor_sebaya_title || '',
        konselor_sebaya_desc: konselor_sebaya_desc || '',
        konselor_sebaya_image: null as File | null,
    });

    const [photoPreview, setPhotoPreview] = useState<string | null>(struktur_organisasi_image || null);
    const [konselorImagePreview, setKonselorImagePreview] = useState<string | null>(konselor_sebaya_image || null);
    const [deletingImage, setDeletingImage] = useState(false);
    const [deletingKonselorImage, setDeletingKonselorImage] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);
    const konselorFileRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if (file) {
            setData('struktur_organisasi_image', file);
            const reader = new FileReader();
            reader.onload = () => setPhotoPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleKonselorFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if (file) {
            setData('konselor_sebaya_image', file);
            const reader = new FileReader();
            reader.onload = () => setKonselorImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleDeleteImage = () => {
        if (!confirm('Yakin ingin menghapus gambar struktur organisasi?')) return;
        setDeletingImage(true);
        router.post('/admin/tentang-kami/delete-image', { type: 'struktur_organisasi_image' }, {
            onSuccess: () => {
                setPhotoPreview(null);
                setData('struktur_organisasi_image', null);
            },
            onFinish: () => setDeletingImage(false),
        });
    };

    const handleDeleteKonselorImage = () => {
        if (!confirm('Yakin ingin menghapus gambar Konselor Sebaya?')) return;
        setDeletingKonselorImage(true);
        router.post('/admin/tentang-kami/delete-image', { type: 'konselor_sebaya_image' }, {
            onSuccess: () => {
                setKonselorImagePreview(null);
                setData('konselor_sebaya_image', null);
            },
            onFinish: () => setDeletingKonselorImage(false),
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/tentang-kami', {
            forceFormData: true,
            onSuccess: () => {
                if (fileRef.current) fileRef.current.value = '';
                if (konselorFileRef.current) konselorFileRef.current.value = '';
            }
        });
    };

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link', 'clean']
        ],
    };

    return (
        <AdminLayout title="Kelola Tentang Kami">
            <div className="max-w-4xl">
                <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    {/* Tabs Header */}
                    <div className="flex border-b border-slate-100 bg-slate-50/50 overflow-x-auto">
                        <button
                            type="button"
                            onClick={() => setActiveTab('visi')}
                            className={`px-8 py-5 text-sm font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
                                activeTab === 'visi' ? 'text-primary border-b-2 border-primary bg-white' : 'text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            Visi & Misi
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('struktur')}
                            className={`px-8 py-5 text-sm font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
                                activeTab === 'struktur' ? 'text-primary border-b-2 border-primary bg-white' : 'text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            Struktur Organisasi
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('kontak')}
                            className={`px-8 py-5 text-sm font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
                                activeTab === 'kontak' ? 'text-primary border-b-2 border-primary bg-white' : 'text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            Kontak & Alamat
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('konselor')}
                            className={`px-8 py-5 text-sm font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
                                activeTab === 'konselor' ? 'text-primary border-b-2 border-primary bg-white' : 'text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            Konselor Sebaya
                        </button>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* TAB: VISI MISI */}
                        {activeTab === 'visi' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <div>
                                    <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wide">Teks Visi</label>
                                    <textarea
                                        value={data.visi_text}
                                        onChange={e => setData('visi_text', e.target.value)}
                                        rows={4}
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all font-medium text-slate-700"
                                        placeholder="Tuliskan Visi di sini..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wide">Teks Misi</label>
                                    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200">
                                        <ReactQuill 
                                            theme="snow" 
                                            value={data.misi_text} 
                                            onChange={(val) => setData('misi_text', val)}
                                            modules={modules}
                                            className="h-64"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: STRUKTUR ORGANISASI */}
                        {activeTab === 'struktur' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <div>
                                    <label className="block text-sm font-black text-slate-700 mb-4 uppercase tracking-wide">Bagan / Struktur Organisasi</label>
                                    
                                    <div 
                                        onClick={() => fileRef.current?.click()}
                                        className="relative w-full max-w-2xl aspect-video rounded-[2rem] overflow-hidden border-4 border-dashed border-slate-200 bg-slate-50 cursor-pointer group hover:border-primary/50 transition-colors flex items-center justify-center"
                                    >
                                        {photoPreview ? (
                                            <img src={photoPreview} alt="Struktur Organisasi" className="w-full h-full object-contain" />
                                        ) : (
                                            <div className="text-center text-slate-400 group-hover:text-primary transition-colors flex flex-col items-center">
                                                <RiImageAddLine size={48} className="mb-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                                                <p className="font-bold">Klik untuk mengunggah gambar bagan</p>
                                                <p className="text-xs mt-2 opacity-70">Format: JPG, PNG (Maks 5MB)</p>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                                            <span className="text-white font-black tracking-widest uppercase">Ganti Gambar</span>
                                        </div>
                                    </div>
                                    <input 
                                        ref={fileRef} 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handleFileChange} 
                                        className="hidden" 
                                    />
                                    {errors.struktur_organisasi_image && <p className="mt-2 text-sm text-red-500 font-bold">{errors.struktur_organisasi_image}</p>}

                                    {/* Tombol hapus gambar */}
                                    {photoPreview && (
                                        <button
                                            type="button"
                                            onClick={handleDeleteImage}
                                            disabled={deletingImage}
                                            className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-5 py-3 text-red-600 font-bold text-sm hover:bg-red-500 hover:text-white hover:border-red-500 transition-all disabled:opacity-60 disabled:cursor-wait"
                                        >
                                            <RiDeleteBin6Line size={18} />
                                            {deletingImage ? 'Menghapus...' : 'Hapus Gambar Ini'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* TAB: KONTAK */}
                        {activeTab === 'kontak' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-black text-slate-700 mb-2 uppercase tracking-wide">
                                        <RiMapPinLine size={18} className="text-primary" /> Alamat Lengkap
                                    </label>
                                    <textarea
                                        value={data.contact_address}
                                        onChange={e => setData('contact_address', e.target.value)}
                                        rows={3}
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all font-medium text-slate-700"
                                        placeholder="Gedung Pinisi UNM..."
                                    />
                                </div>

                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-black text-slate-700 mb-2 uppercase tracking-wide">
                                            <RiPhoneLine size={18} className="text-primary" /> Telepon / WA
                                        </label>
                                        <input
                                            type="text"
                                            value={data.contact_phone}
                                            onChange={e => setData('contact_phone', e.target.value)}
                                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all font-medium text-slate-700"
                                            placeholder="+62 8..."
                                        />
                                    </div>

                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-black text-slate-700 mb-2 uppercase tracking-wide">
                                            <RiMailSendLine size={18} className="text-primary" /> Email
                                        </label>
                                        <input
                                            type="email"
                                            value={data.contact_email}
                                            onChange={e => setData('contact_email', e.target.value)}
                                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all font-medium text-slate-700"
                                            placeholder="upabk@unm.ac.id"
                                        />
                                    </div>
                                    
                                    <div className="sm:col-span-2">
                                        <label className="flex items-center gap-2 text-sm font-black text-slate-700 mb-2 uppercase tracking-wide">
                                            <RiInstagramLine size={18} className="text-primary" /> Akun Instagram
                                        </label>
                                        <input
                                            type="text"
                                            value={data.contact_instagram}
                                            onChange={e => setData('contact_instagram', e.target.value)}
                                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all font-medium text-slate-700"
                                            placeholder="@upa_bk_unm"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: KONSELOR SEBAYA */}
                        {activeTab === 'konselor' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <div>
                                    <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wide">Judul Bagian Konselor Sebaya</label>
                                    <input
                                        type="text"
                                        value={data.konselor_sebaya_title}
                                        onChange={e => setData('konselor_sebaya_title', e.target.value)}
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all font-medium text-slate-700"
                                        placeholder="Teman Cerita Terpercaya..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wide">Deskripsi</label>
                                    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200">
                                        <ReactQuill 
                                            theme="snow" 
                                            value={data.konselor_sebaya_desc} 
                                            onChange={(val) => setData('konselor_sebaya_desc', val)}
                                            modules={modules}
                                            className="h-64"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-black text-slate-700 mb-4 uppercase tracking-wide">Gambar Konselor Sebaya</label>
                                    
                                    <div 
                                        onClick={() => konselorFileRef.current?.click()}
                                        className="relative w-full max-w-md aspect-video rounded-[2rem] overflow-hidden border-4 border-dashed border-slate-200 bg-slate-50 cursor-pointer group hover:border-primary/50 transition-colors flex items-center justify-center"
                                    >
                                        {konselorImagePreview ? (
                                            <img src={konselorImagePreview} alt="Konselor Sebaya" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="text-center text-slate-400 group-hover:text-primary transition-colors flex flex-col items-center">
                                                <RiImageAddLine size={48} className="mb-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                                                <p className="font-bold">Klik untuk mengunggah gambar</p>
                                                <p className="text-xs mt-2 opacity-70">Format: JPG, PNG (Maks 5MB)</p>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                                            <span className="text-white font-black tracking-widest uppercase">Ganti Gambar</span>
                                        </div>
                                    </div>
                                    <input 
                                        ref={konselorFileRef} 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handleKonselorFileChange} 
                                        className="hidden" 
                                    />
                                    {errors.konselor_sebaya_image && <p className="mt-2 text-sm text-red-500 font-bold">{errors.konselor_sebaya_image}</p>}

                                    {/* Tombol hapus gambar */}
                                    {konselorImagePreview && (
                                        <button
                                            type="button"
                                            onClick={handleDeleteKonselorImage}
                                            disabled={deletingKonselorImage}
                                            className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-5 py-3 text-red-600 font-bold text-sm hover:bg-red-500 hover:text-white hover:border-red-500 transition-all disabled:opacity-60 disabled:cursor-wait"
                                        >
                                            <RiDeleteBin6Line size={18} />
                                            {deletingKonselorImage ? 'Menghapus...' : 'Hapus Gambar Ini'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-8 border-t border-slate-100 bg-slate-50 flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-10 py-4 rounded-2xl font-black hover:shadow-xl hover:shadow-purple-200 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-wait uppercase tracking-widest text-sm"
                        >
                            <RiSaveLine size={20} />
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
            
            <style>{`
                .quill {
                    display: flex;
                    flex-direction: column;
                }
                .ql-toolbar {
                    border: none !important;
                    border-bottom: 1px solid #e2e8f0 !important;
                    background: #f8fafc;
                    border-radius: 1rem 1rem 0 0;
                }
                .ql-container {
                    border: none !important;
                    border-radius: 0 0 1rem 1rem;
                    flex-grow: 1;
                    font-size: 1rem;
                    font-family: inherit;
                }
                .ql-editor {
                    min-height: 200px;
                }
            `}</style>
        </AdminLayout>
    );
}
