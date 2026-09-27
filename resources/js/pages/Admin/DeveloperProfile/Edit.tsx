import AdminLayout from '@/layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { RiSave3Line, RiImageAddLine, RiUser3Line } from '@remixicon/react';
import React, { useRef, useState } from 'react';
import ImageCropper from '@/Components/ImageCropper';

interface Props {
    content: string;
    photo: string | null;
}

export default function Edit({ content, photo }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imageToCrop, setImageToCrop] = useState<string | null>(null);
    
    const { data, setData, post, processing, errors } = useForm({
        content: content || '',
        photo: null as File | null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setImageToCrop(reader.result?.toString() || null);
            });
            reader.readAsDataURL(e.target.files[0]);
            
            // Reset input so the same file can be selected again
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleCropComplete = (croppedBlob: Blob) => {
        const file = new File([croppedBlob], 'profile.jpg', { type: 'image/jpeg' });
        setData('photo', file);
        setImageToCrop(null);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/developer-profile', {
            forceFormData: true,
        });
    };

    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
            ['clean'],
        ],
    };

    return (
        <AdminLayout title="Kelola Profil Developer">
            <Head title="Kelola Profil Developer" />

            <div className="p-6 md:p-10 max-w-5xl mx-auto">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-slate-800">Kelola Profil Developer</h1>
                        <p className="mt-2 text-slate-500 font-medium">Kelola foto dan deskripsi untuk halaman profil khusus developer.</p>
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <form onSubmit={submit} className="p-8 space-y-8">
                        
                        {/* Photo Upload Section */}
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Foto Profil</h3>
                            <div className="flex flex-col sm:flex-row items-start gap-6">
                                <div className="w-40 h-40 rounded-3xl border-2 border-dashed border-slate-300 overflow-hidden flex-shrink-0 bg-slate-50 flex items-center justify-center relative group">
                                    {data.photo ? (
                                        <img src={URL.createObjectURL(data.photo)} alt="Preview" className="w-full h-full object-cover" />
                                    ) : photo ? (
                                        <img src={photo} alt="Current Photo" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center text-slate-400">
                                            <RiUser3Line className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                                            <p className="text-xs font-medium">Belum ada foto</p>
                                        </div>
                                    )}
                                    
                                    <button 
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <RiImageAddLine className="w-8 h-8" />
                                    </button>
                                </div>
                                
                                <div className="flex-1">
                                    <input 
                                        type="file" 
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-colors mb-3"
                                    >
                                        Pilih Foto Baru
                                    </button>
                                    <p className="text-xs text-slate-500 font-medium">Format yang didukung: JPG, PNG, WEBP. Ukuran maksimal 2MB. Rasio terbaik 1:1 (Persegi).</p>
                                    {errors.photo && <p className="text-red-500 text-xs mt-2 font-bold">{errors.photo}</p>}
                                </div>
                            </div>
                        </div>

                        <hr className="border-slate-100" />

                        {/* Description Section */}
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Deskripsi Profil</h3>
                            <p className="text-sm text-slate-500 mb-3 font-medium">Tuliskan cerita, pengalaman, atau pengantar singkat tentang Anda.</p>
                            <div className="bg-white rounded-xl overflow-hidden border border-slate-200">
                                <ReactQuill
                                    theme="snow"
                                    value={data.content}
                                    onChange={(value) => setData('content', value)}
                                    modules={modules}
                                    className="h-64 mb-12 border-none"
                                />
                            </div>
                            {errors.content && <p className="mt-2 text-sm text-red-600 font-bold">{errors.content}</p>}
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/30 transition hover:-translate-y-0.5 hover:bg-purple-900 hover:shadow-xl disabled:opacity-50 disabled:hover:translate-y-0"
                            >
                                <RiSave3Line size={18} />
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {imageToCrop && (
                <ImageCropper
                    image={imageToCrop}
                    onCropComplete={handleCropComplete}
                    onCancel={() => setImageToCrop(null)}
                    aspectRatio={1} // Square aspect ratio
                />
            )}
        </AdminLayout>
    );
}
