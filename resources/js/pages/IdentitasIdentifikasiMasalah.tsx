import Header from '@/Components/Header';
import LinkBack from '@/Components/LinkBack';
import { router } from '@inertiajs/react';
import { RiArrowRightLine, RiBookletLine, RiCheckboxCircleLine, RiInformationLine, RiUserLine, RiGraduationCapLine, RiFileList3Line } from '@remixicon/react';
import React, { useState } from 'react';

export default function IdentitasIdentifikasiMasalah({ groups = [], prefilledGroup, prefilledFaculty }: { groups: any[], prefilledGroup?: any, prefilledFaculty?: any }) {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form Data
    const [formData, setFormData] = useState({
        nama: '',
        nim: '',
        fakultas: prefilledFaculty ? prefilledFaculty.name : '',
        program_studi: '',
        semester: '',
        jenis_kelamin: '',
        tempat_tinggal: '',
        nomor_hp: '',
        email: '',
        status_bekerja: '',
        status_pernikahan: '',
        penyandang_disabilitas: '',
        disabilitas_jenis: '',
        penerima_beasiswa: '',
        ipk_terakhir: '',
        status_semester_lalu: '',
        imm_group_id: prefilledGroup ? prefilledGroup.id : '',
        imm_faculty_id: prefilledFaculty ? prefilledFaculty.id : '',
        imm_prodi_id: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const setRadioValue = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleNext = () => setStep((prev) => prev + 1);
    const handlePrev = () => setStep((prev) => prev - 1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        localStorage.setItem('userDataIdentifikasiMasalah', JSON.stringify(formData));
        router.visit('/tes/identifikasi-masalah/soal');
    };

    // Helper component for radio chips
    const RadioGroup = ({ name, label, options, required = true, columns = false }: { name: string, label: string, options: string[], required?: boolean, columns?: boolean }) => (
        <div className="mb-6">
            <span className="mb-3 block text-sm font-bold text-slate-700">{label} {required && <span className="text-red-500">*</span>}</span>
            <div className={`flex flex-wrap gap-3 ${columns ? 'grid grid-cols-2 md:grid-cols-4' : ''}`}>
                {options.map((opt) => (
                    <button
                        key={opt}
                        type="button"
                        onClick={() => setRadioValue(name, opt)}
                        className={`flex-1 rounded-xl border-2 py-3 px-4 font-semibold text-sm transition-all text-center ${
                            (formData as any)[name] === opt
                                ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm shadow-blue-100 ring-2 ring-blue-600/20'
                                : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-blue-300 hover:bg-white'
                        }`}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <>
            <Header />
            <main className="min-h-[100dvh] w-full overflow-x-hidden bg-slate-50 p-4 md:p-8 font-sans">
                <div className="mx-auto max-w-4xl">
                    <div className="mb-6">
                        <LinkBack />
                    </div>

                    <div className="rounded-[2.5rem] bg-white p-6 shadow-xl sm:p-12 border border-slate-100">
                        {/* Progress Indicator */}
                        <div className="mb-10 flex flex-wrap justify-center gap-2 sm:gap-4 text-sm font-bold">
                            <span className={`rounded-full px-5 py-2.5 transition-colors ${step >= 1 ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'bg-slate-100 text-slate-400'}`}>1. Pengantar</span>
                            <span className={`rounded-full px-5 py-2.5 transition-colors ${step >= 2 ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'bg-slate-100 text-slate-400'}`}>2. Identitas</span>
                            <span className={`rounded-full px-5 py-2.5 transition-colors ${step >= 3 ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'bg-slate-100 text-slate-400'}`}>3. Petunjuk</span>
                        </div>

                        {/* Step 1: Pengantar dan Persetujuan */}
                        {step === 1 && (
                            <div className="animate-fade-in max-w-2xl mx-auto">
                                <h1 className="mb-8 flex flex-col items-center gap-4 text-center text-3xl font-black text-slate-800">
                                    <div className="rounded-2xl bg-blue-50 p-4 text-blue-600">
                                        <RiInformationLine size={40} />
                                    </div>
                                    Pengantar untuk Mahasiswa
                                </h1>
                                <div className="space-y-4 rounded-2xl bg-blue-50/50 p-8 text-slate-700 leading-relaxed border border-blue-100 shadow-inner">
                                    <p>Mahasiswa yang baik, daftar ini membantu kami memahami masalah yang mungkin sedang Anda alami agar kampus dapat memberi dukungan yang tepat.</p>
                                    <p>Ini <strong className="text-blue-900">bukan tes</strong>. Tidak ada jawaban benar dan salah. Jawaban Anda <strong className="text-blue-900">dirahasiakan</strong> dan <strong className="text-blue-900">tidak memengaruhi</strong> nilai, beasiswa, maupun status studi Anda. Pengisian bersifat sukarela dan memerlukan waktu sekitar 15–20 menit.</p>
                                </div>
                                
                                <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                                    <button 
                                        onClick={() => router.visit('/')}
                                        className="flex-1 rounded-2xl border-2 border-slate-200 py-4 font-bold text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95"
                                    >
                                        Saya tidak bersedia
                                    </button>
                                    <button 
                                        onClick={handleNext}
                                        className="flex-1 rounded-2xl bg-blue-600 py-4 font-bold text-white shadow-xl hover:bg-blue-700 transition-all shadow-blue-500/30 flex items-center justify-center gap-2 active:scale-95"
                                    >
                                        Saya bersedia mengisi <RiArrowRightLine size={20} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Identitas Diri */}
                        {step === 2 && (
                            <div className="animate-fade-in">
                                <div className="mb-10 text-center">
                                    <h1 className="mb-3 flex items-center justify-center gap-3 text-3xl font-black text-slate-800">
                                        <RiUserLine className="text-blue-600" size={36} /> Identitas Diri
                                    </h1>
                                    <p className="text-slate-500">Lengkapi data di bawah ini sebelum melanjutkan.</p>
                                </div>
                                
                                <form className="space-y-10">
                                    {/* SEKSI 1: DATA AKADEMIK */}
                                    <section className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm">
                                        <h2 className="mb-6 flex items-center gap-2 text-xl font-extrabold text-blue-900 border-b border-blue-50 pb-4">
                                            <RiGraduationCapLine className="text-blue-500" /> Data Akademik
                                        </h2>
                                        <div className="grid gap-6 md:grid-cols-2">
                                            {prefilledFaculty && (
                                                <div className="md:col-span-2 p-4 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-center justify-between gap-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                                                            <RiGraduationCapLine size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">{prefilledGroup?.name || 'Universitas Negeri Makassar'}</p>
                                                            <p className="text-base font-black text-slate-800">{prefilledFaculty.name}</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs bg-blue-600 text-white font-bold px-3 py-1.5 rounded-xl shadow-xs shrink-0">
                                                        Formulir Khusus
                                                    </span>
                                                </div>
                                            )}

                                            {!prefilledFaculty && !prefilledGroup && groups.length > 0 && (
                                                <label className="block md:col-span-2">
                                                    <span className="mb-2 block text-sm font-bold text-slate-700">Asal Kampus / Kelompok Data <span className="text-red-500">*</span></span>
                                                    <select name="imm_group_id" value={formData.imm_group_id} onChange={handleInputChange} required className="w-full rounded-xl border-slate-200 bg-slate-50 p-3.5 text-slate-800 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all">
                                                        <option value="" disabled>-- Pilih Kampus / Kelompok --</option>
                                                        {groups.map((g) => (
                                                            <option key={g.id} value={g.id}>{g.name}</option>
                                                        ))}
                                                    </select>
                                                </label>
                                            )}

                                            <label className="block">
                                                <span className="mb-2 block text-sm font-bold text-slate-700">Nama Lengkap <span className="text-red-500">*</span></span>
                                                <input type="text" name="nama" value={formData.nama} onChange={handleInputChange} placeholder="Ketik nama lengkapmu" required className="w-full rounded-xl border-slate-200 bg-slate-50 p-3.5 text-slate-800 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all" />
                                            </label>
                                            <label className="block">
                                                <span className="mb-2 block text-sm font-bold text-slate-700">NIM <span className="text-red-500">*</span></span>
                                                <input type="text" name="nim" value={formData.nim} onChange={handleInputChange} placeholder="Contoh: 12345678" required className="w-full rounded-xl border-slate-200 bg-slate-50 p-3.5 text-slate-800 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all" />
                                            </label>
                                            <div className="block">
                                                <span className="mb-2 block text-sm font-bold text-slate-700">Fakultas <span className="text-red-500">*</span></span>
                                                {prefilledFaculty ? (
                                                    <div className="w-full rounded-xl border border-blue-200 bg-blue-50/60 p-3.5 text-slate-800 font-bold flex items-center justify-between">
                                                        <span className="flex items-center gap-2">
                                                            <RiGraduationCapLine className="text-blue-600 h-5 w-5 shrink-0" />
                                                            <span>{prefilledFaculty.name}</span>
                                                        </span>
                                                        <span className="text-[11px] bg-blue-200 text-blue-800 font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shrink-0">Terkunci</span>
                                                    </div>
                                                ) : prefilledGroup && prefilledGroup.faculties && prefilledGroup.faculties.length > 0 ? (
                                                    <select 
                                                        name="imm_faculty_id" 
                                                        value={formData.imm_faculty_id} 
                                                        onChange={(e) => {
                                                            const selectedFaculty = prefilledGroup.faculties.find((f: any) => f.id.toString() === e.target.value);
                                                            setFormData(prev => ({
                                                                ...prev, 
                                                                imm_faculty_id: e.target.value,
                                                                fakultas: selectedFaculty ? selectedFaculty.name : '',
                                                                imm_prodi_id: '',
                                                                program_studi: ''
                                                            }));
                                                        }} 
                                                        required 
                                                        className="w-full rounded-xl border-slate-200 bg-slate-50 p-3.5 text-slate-800 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all"
                                                    >
                                                        <option value="" disabled>-- Pilih Fakultas --</option>
                                                        {prefilledGroup.faculties.map((fac: any) => (
                                                            <option key={fac.id} value={fac.id}>{fac.name}</option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <input type="text" name="fakultas" value={formData.fakultas} onChange={handleInputChange} placeholder="Contoh: Fakultas Teknik" required className="w-full rounded-xl border-slate-200 bg-slate-50 p-3.5 text-slate-800 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all" />
                                                )}
                                            </div>
                                            <label className="block">
                                                <span className="mb-2 block text-sm font-bold text-slate-700">Program Studi <span className="text-red-500">*</span></span>
                                                {prefilledFaculty ? (
                                                    prefilledFaculty.prodis && prefilledFaculty.prodis.length > 0 ? (
                                                        <select 
                                                            name="imm_prodi_id" 
                                                            value={formData.imm_prodi_id} 
                                                            onChange={(e) => {
                                                                const selectedProdi = prefilledFaculty.prodis.find((p: any) => p.id.toString() === e.target.value);
                                                                setFormData(prev => ({
                                                                    ...prev, 
                                                                    imm_prodi_id: e.target.value,
                                                                    program_studi: selectedProdi ? selectedProdi.name : ''
                                                                }));
                                                            }} 
                                                            required 
                                                            className="w-full rounded-xl border-slate-200 bg-slate-50 p-3.5 text-slate-800 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all"
                                                        >
                                                            <option value="" disabled>-- Pilih Program Studi --</option>
                                                            {prefilledFaculty.prodis.map((prodi: any) => (
                                                                <option key={prodi.id} value={prodi.id}>{prodi.name}</option>
                                                            ))}
                                                        </select>
                                                    ) : (
                                                        <input type="text" name="program_studi" value={formData.program_studi} onChange={handleInputChange} placeholder="Ketik Program Studi" required className="w-full rounded-xl border-slate-200 bg-slate-50 p-3.5 text-slate-800 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all" />
                                                    )
                                                ) : prefilledGroup && prefilledGroup.faculties && prefilledGroup.faculties.length > 0 ? (
                                                    <select 
                                                        name="imm_prodi_id" 
                                                        value={formData.imm_prodi_id} 
                                                        onChange={(e) => {
                                                            const currentFaculty = prefilledGroup.faculties.find((f: any) => f.id.toString() === formData.imm_faculty_id);
                                                            const selectedProdi = currentFaculty?.prodis?.find((p: any) => p.id.toString() === e.target.value);
                                                            setFormData(prev => ({
                                                                ...prev, 
                                                                imm_prodi_id: e.target.value,
                                                                program_studi: selectedProdi ? selectedProdi.name : ''
                                                            }));
                                                        }} 
                                                        required 
                                                        disabled={!formData.imm_faculty_id}
                                                        className="w-full rounded-xl border-slate-200 bg-slate-50 p-3.5 text-slate-800 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all disabled:opacity-50"
                                                    >
                                                        <option value="" disabled>-- Pilih Program Studi --</option>
                                                        {formData.imm_faculty_id && prefilledGroup.faculties
                                                            .find((f: any) => f.id.toString() === formData.imm_faculty_id)
                                                            ?.prodis?.map((prodi: any) => (
                                                                <option key={prodi.id} value={prodi.id}>{prodi.name}</option>
                                                            ))}
                                                    </select>
                                                ) : (
                                                    <input type="text" name="program_studi" value={formData.program_studi} onChange={handleInputChange} placeholder="Contoh: Teknik Informatika" required className="w-full rounded-xl border-slate-200 bg-slate-50 p-3.5 text-slate-800 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all" />
                                                )}
                                            </label>
                                            <label className="block">
                                                <span className="mb-2 block text-sm font-bold text-slate-700">Semester <span className="text-red-500">*</span></span>
                                                <input type="number" name="semester" value={formData.semester} onChange={handleInputChange} placeholder="Contoh: 3" required min="1" className="w-full rounded-xl border-slate-200 bg-slate-50 p-3.5 text-slate-800 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all" />
                                            </label>
                                            <label className="block">
                                                <span className="mb-2 block text-sm font-bold text-slate-700">IPK Terakhir</span>
                                                <input type="text" name="ipk_terakhir" value={formData.ipk_terakhir} onChange={handleInputChange} placeholder="(kosongkan bila semester 1)" className="w-full rounded-xl border-slate-200 bg-slate-50 p-3.5 text-slate-800 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all" />
                                            </label>
                                        </div>

                                        <div className="mt-8">
                                            <RadioGroup name="status_semester_lalu" label="Status Semester Lalu" options={['Aktif', 'Cuti', 'Tidak aktif']} />
                                        </div>
                                    </section>

                                    {/* SEKSI 2: DATA PRIBADI */}
                                    <section className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm">
                                        <h2 className="mb-6 flex items-center gap-2 text-xl font-extrabold text-blue-900 border-b border-blue-50 pb-4">
                                            <RiUserLine className="text-blue-500" /> Data Pribadi
                                        </h2>
                                        
                                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                                            <label className="block">
                                                <span className="mb-2 block text-sm font-bold text-slate-700">Nomor HP / WhatsApp <span className="text-red-500">*</span></span>
                                                <input type="text" name="nomor_hp" value={formData.nomor_hp} onChange={handleInputChange} placeholder="628xxxxxxxxxx" required className="w-full rounded-xl border-slate-200 bg-slate-50 p-3.5 text-slate-800 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all" />
                                            </label>
                                            <label className="block">
                                                <span className="mb-2 block text-sm font-bold text-slate-700">Email <span className="text-red-500">*</span></span>
                                                <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="nama@email.com" required className="w-full rounded-xl border-slate-200 bg-slate-50 p-3.5 text-slate-800 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all" />
                                            </label>
                                        </div>

                                        <RadioGroup name="jenis_kelamin" label="Jenis Kelamin" options={['Laki-laki', 'Perempuan']} />
                                        
                                        <RadioGroup name="tempat_tinggal" label="Tempat Tinggal" options={['Bersama orang tua', 'Kos', 'Asrama', 'Lainnya']} />
                                        
                                        <div className="grid md:grid-cols-2 gap-x-6">
                                            <RadioGroup name="status_pernikahan" label="Status Pernikahan" options={['Belum menikah', 'Menikah']} />
                                            <RadioGroup name="status_bekerja" label="Status Bekerja" options={['Tidak bekerja', 'Paruh waktu', 'Penuh waktu']} />
                                        </div>
                                    </section>

                                    {/* SEKSI 3: INFORMASI TAMBAHAN */}
                                    <section className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm">
                                        <h2 className="mb-6 flex items-center gap-2 text-xl font-extrabold text-blue-900 border-b border-blue-50 pb-4">
                                            <RiFileList3Line className="text-blue-500" /> Informasi Tambahan
                                        </h2>
                                        
                                        <RadioGroup name="penerima_beasiswa" label="Apakah Anda Penerima Beasiswa?" options={['Tidak', 'Ya']} />
                                        
                                        <div className="mb-6">
                                            <span className="mb-3 block text-sm font-bold text-slate-700">Penyandang Disabilitas? <span className="text-red-500">*</span></span>
                                            <div className="flex flex-col gap-4 sm:flex-row">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setRadioValue('penyandang_disabilitas', 'Tidak');
                                                        setFormData(prev => ({ ...prev, disabilitas_jenis: '' }));
                                                    }}
                                                    className={`sm:flex-1 rounded-xl border-2 py-3 px-4 font-semibold text-sm transition-all text-center ${
                                                        formData.penyandang_disabilitas === 'Tidak'
                                                            ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm ring-2 ring-blue-600/20'
                                                            : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-blue-300 hover:bg-white'
                                                    }`}
                                                >
                                                    Tidak
                                                </button>
                                                
                                                <div className={`sm:flex-[2] flex flex-col sm:flex-row sm:items-center rounded-xl border-2 transition-all p-2 ${
                                                    formData.penyandang_disabilitas === 'Ya' 
                                                        ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-600/20' 
                                                        : 'border-slate-100 bg-slate-50 hover:border-blue-300'
                                                }`}>
                                                    <button
                                                        type="button"
                                                        onClick={() => setRadioValue('penyandang_disabilitas', 'Ya')}
                                                        className={`py-2 px-4 font-semibold text-sm text-center sm:w-auto ${
                                                            formData.penyandang_disabilitas === 'Ya' ? 'text-blue-700' : 'text-slate-500'
                                                        }`}
                                                    >
                                                        Ya, jenisnya:
                                                    </button>
                                                    <input 
                                                        type="text" 
                                                        name="disabilitas_jenis" 
                                                        value={formData.disabilitas_jenis} 
                                                        onChange={handleInputChange} 
                                                        disabled={formData.penyandang_disabilitas !== 'Ya'}
                                                        placeholder="Sebutkan..."
                                                        className="mt-2 sm:mt-0 flex-1 rounded-lg border-slate-200 bg-white p-2.5 text-sm disabled:opacity-50 disabled:bg-slate-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" 
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </form>

                                <div className="mt-10 flex flex-col-reverse sm:flex-row justify-between gap-4 pt-6 border-t border-slate-100">
                                    <button onClick={handlePrev} className="rounded-2xl border-2 border-slate-200 px-8 py-4 font-bold text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95">Kembali</button>
                                    <button 
                                        onClick={handleNext}
                                        disabled={!formData.nama || !formData.nim || !formData.fakultas || !formData.program_studi || !formData.semester || !formData.jenis_kelamin || !formData.tempat_tinggal || !formData.nomor_hp || !formData.email || !formData.status_bekerja || !formData.status_pernikahan || !formData.penyandang_disabilitas || !formData.penerima_beasiswa || !formData.status_semester_lalu || (formData.penyandang_disabilitas === 'Ya' && !formData.disabilitas_jenis)}
                                        className="rounded-2xl bg-blue-600 px-10 py-4 font-bold text-white shadow-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-blue-500/30 flex items-center justify-center gap-2 active:scale-95 disabled:active:scale-100"
                                    >
                                        Lanjut ke Petunjuk <RiArrowRightLine size={20} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Petunjuk Pengisian */}
                        {step === 3 && (
                            <div className="animate-fade-in max-w-3xl mx-auto">
                                <h1 className="mb-8 flex items-center justify-center gap-3 text-3xl font-black text-slate-800 text-center">
                                    <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
                                        <RiBookletLine size={32} />
                                    </div>
                                    Petunjuk Pengisian
                                </h1>
                                
                                <div className="rounded-3xl border border-blue-100 bg-blue-50/30 p-6 sm:p-10 shadow-sm mb-8">
                                    <ol className="list-decimal pl-5 space-y-4 text-slate-700 font-medium leading-relaxed">
                                        <li>Bacalah setiap pernyataan dengan teliti.</li>
                                        <li>Ingat keadaan Anda <strong className="text-blue-900 bg-blue-100 px-2 py-0.5 rounded">selama tiga bulan terakhir</strong>.</li>
                                        <li>Pilih salah satu pilihan yang menunjukkan <strong className="text-blue-900">seberapa sering</strong> Anda mengalaminya.</li>
                                        <li>Jika Anda <strong>belum pernah</strong> mengalami keadaan itu (misalnya karena masih mahasiswa baru), pilih <strong>"Tidak pernah"</strong>.</li>
                                        <li>Isilah semua pernyataan dengan jujur. Tidak ada jawaban yang salah.</li>
                                    </ol>
                                    
                                    <div className="mt-8 rounded-2xl bg-white p-5 text-sm text-slate-600 border border-slate-100 shadow-sm flex gap-4 items-start">
                                        <div className="mt-1 text-yellow-500"><RiInformationLine size={20} /></div>
                                        <p className="leading-relaxed">
                                            <em><strong>Catatan:</strong> "dirundung" (butir 25) berarti diejek, dihina, dikucilkan, termasuk melalui media sosial. "Kekerasan fisik" (butir 27) termasuk yang dilakukan pacar, keluarga, maupun senior.</em>
                                        </p>
                                    </div>
                                </div>

                                <div className="mb-10 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md">
                                    <div className="p-6 bg-slate-50 border-b border-slate-200">
                                        <h3 className="font-extrabold text-slate-800 mb-1">Pilihan Jawaban</h3>
                                        <p className="text-sm text-slate-500">Untuk setiap pernyataan, pilih salah satu dari empat pilihan berikut:</p>
                                    </div>
                                    <div className="divide-y divide-slate-100">
                                        <div className="flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors">
                                            <span className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 font-black text-sm flex items-center justify-center shrink-0">TP</span>
                                            <p className="font-medium text-slate-700"><strong>Tidak pernah</strong> – saya tidak pernah mengalami hal ini.</p>
                                        </div>
                                        <div className="flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors">
                                            <span className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-black text-sm flex items-center justify-center shrink-0">JR</span>
                                            <p className="font-medium text-slate-700"><strong>Jarang</strong> – saya sesekali mengalaminya.</p>
                                        </div>
                                        <div className="flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors">
                                            <span className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 font-black text-sm flex items-center justify-center shrink-0">SR</span>
                                            <p className="font-medium text-slate-700"><strong>Sering</strong> – saya cukup sering mengalaminya.</p>
                                        </div>
                                        <div className="flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors">
                                            <span className="w-10 h-10 rounded-xl bg-red-100 text-red-700 font-black text-sm flex items-center justify-center shrink-0">HS</span>
                                            <p className="font-medium text-slate-700"><strong>Hampir selalu</strong> – saya mengalaminya hampir setiap waktu.</p>
                                        </div>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="flex flex-col-reverse sm:flex-row justify-between gap-4 pt-6 border-t border-slate-100">
                                    <button type="button" onClick={handlePrev} disabled={isSubmitting} className="rounded-2xl border-2 border-slate-200 px-8 py-4 font-bold text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 disabled:opacity-50">Kembali</button>
                                    <button 
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="rounded-2xl bg-blue-600 px-10 py-4 font-bold text-white shadow-xl hover:bg-blue-700 transition-all shadow-blue-500/30 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70 disabled:cursor-wait"
                                    >
                                        {isSubmitting ? (
                                            <><svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Memuat Soal...</>
                                        ) : (
                                            <>Mulai Tes <RiCheckboxCircleLine size={20} /></>
                                        )}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}
