import AppLayout from '@/Layouts/AppLayout';
import { RiCalendarCheckLine, RiSendPlaneFill, RiCheckLine, RiInformationLine, RiTimeLine, RiMapPinLine, RiComputerLine, RiShieldCheckLine, RiPhoneLine, RiMailLine } from '@remixicon/react';
import { useForm, Head, usePage } from '@inertiajs/react';
import { useCallback } from 'react';

interface Info {
    konseling_info_jam?: string;
    konseling_info_lokasi?: string;
    konseling_info_daring?: string;
    konseling_info_syarat?: string;
    konseling_info_kontak?: string;
    konseling_info_email?: string;
}

export default function Konseling({ fakultas, info = {} }: { fakultas: { id: number, name: string }[], info?: Info }) {
    const { flash } = usePage<{ flash: { success?: boolean } }>().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        age: '',
        domicile: '',
        applicant_status: '',
        fakultas: '',
        prodi: '',
        semester: '',
        phone: '',
        whatsapp: '',
        problem_description: '',
        problem_duration: '',
        action_taken: '',
        preferred_date: '',
    });

    // Auto-grow textarea handler
    const autoGrow = useCallback((el: HTMLTextAreaElement | null) => {
        if (!el) return;
        el.style.height = 'auto';
        el.style.height = el.scrollHeight + 'px';
    }, []);

    const today = new Date().toISOString().split('T')[0];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/konseling', {
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout>
            <Head title="Daftar Konseling" />
            
            <section className="relative bg-primary pt-24 pb-32 md:pt-32 md:pb-40 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-indigo-900 to-purple-900"></div>
                <div className="relative mx-auto max-w-7xl px-8 md:px-16 text-center text-white z-10">
                    <span className="inline-block rounded-full bg-secondary px-4 py-1.5 text-sm font-bold text-slate-900 shadow-md mb-4">
                        Layanan Kami
                    </span>
                    <h1 className="text-4xl font-black leading-tight md:text-5xl lg:text-6xl">
                        Daftar Konseling
                    </h1>
                    <p className="mt-6 text-lg text-white/80 max-w-2xl mx-auto">
                        Jangan ragu untuk bercerita. Kami siap mendengarkan dan membantu Anda mencari jalan keluar. Silakan isi formulir di bawah ini.
                    </p>
                </div>
            </section>

            <section className="bg-slate-50 px-8 pb-24 relative -mt-20 z-20">
                <div className="mx-auto max-w-4xl">
                    <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                        {flash?.success ? (
                            <div className="p-12 text-center animate-in zoom-in duration-500">
                                <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <RiCheckLine className="w-12 h-12" />
                                </div>
                                <h2 className="text-3xl font-black text-slate-800 mb-4">Pendaftaran Berhasil!</h2>
                                <p className="text-slate-600 text-lg max-w-lg mx-auto leading-relaxed">
                                    Terima kasih telah mendaftar. Tim UPA BK akan segera menghubungi Anda untuk mengatur jadwal pertemuan.
                                </p>
                                <button 
                                    onClick={() => window.location.reload()}
                                    className="mt-8 px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-bold transition-colors"
                                >
                                    Daftar Lagi
                                </button>
                            </div>
                        ) : (
                            <div className="p-8 md:p-12">

                                {/* Info Cards Section */}
                                <div className="mb-10">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                            <RiInformationLine className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-slate-800">Informasi Layanan Konseling</h2>
                                            <p className="text-slate-500 text-sm">Baca informasi berikut sebelum mengisi formulir.</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {/* Jam Operasional */}
                                        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 rounded-2xl p-5 flex flex-col gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary">
                                                <RiTimeLine className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-sm mb-1">Jam Operasional</h4>
                                                <p className="text-slate-600 text-sm leading-relaxed">{info.konseling_info_jam || 'Senin - Jumat, 09.00 - 16.00 WITA'}</p>
                                            </div>
                                        </div>
                                        {/* Lokasi */}
                                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 rounded-2xl p-5 flex flex-col gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center text-blue-600">
                                                <RiMapPinLine className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-sm mb-1">Lokasi (Luring)</h4>
                                                <p className="text-slate-600 text-sm leading-relaxed">{info.konseling_info_lokasi || 'Gedung Phinisi Lantai 12, UNM'}</p>
                                            </div>
                                        </div>
                                        {/* Daring */}
                                        <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-100 rounded-2xl p-5 flex flex-col gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-teal-500/15 flex items-center justify-center text-teal-600">
                                                <RiComputerLine className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-sm mb-1">Konseling Daring</h4>
                                                <p className="text-slate-600 text-sm leading-relaxed">{info.konseling_info_daring || 'Zoom, Telegram, atau seluler.'}</p>
                                            </div>
                                        </div>
                                        {/* Syarat */}
                                        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100 rounded-2xl p-5 flex flex-col gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-600">
                                                <RiShieldCheckLine className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-sm mb-1">Ketentuan</h4>
                                                <p className="text-slate-600 text-sm leading-relaxed">{info.konseling_info_syarat || 'Terbuka untuk mahasiswa UNM dan masyarakat umum.'}</p>
                                            </div>
                                        </div>
                                        {/* Kontak WA */}
                                        {info.konseling_info_kontak && (
                                            <div className="bg-gradient-to-br from-green-50 to-lime-50 border border-green-100 rounded-2xl p-5 flex flex-col gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center text-green-600">
                                                    <RiPhoneLine className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-800 text-sm mb-1">Nomor WhatsApp</h4>
                                                    <a href={`https://wa.me/${info.konseling_info_kontak}`} target="_blank" rel="noreferrer" className="text-green-700 text-sm font-semibold hover:underline">+{info.konseling_info_kontak}</a>
                                                </div>
                                            </div>
                                        )}
                                        {/* Email */}
                                        {info.konseling_info_email && (
                                            <div className="bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100 rounded-2xl p-5 flex flex-col gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-rose-500/15 flex items-center justify-center text-rose-600">
                                                    <RiMailLine className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-800 text-sm mb-1">Email</h4>
                                                    <a href={`mailto:${info.konseling_info_email}`} className="text-rose-700 text-sm font-semibold hover:underline">{info.konseling_info_email}</a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="flex-1 h-px bg-slate-100"></div>
                                    <div className="flex items-center gap-2 bg-primary/5 px-4 py-1.5 rounded-full">
                                        <RiCalendarCheckLine className="w-4 h-4 text-primary" />
                                        <span className="text-sm font-bold text-primary">Formulir Pendaftaran</span>
                                    </div>
                                    <div className="flex-1 h-px bg-slate-100"></div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="space-y-6">
                                        <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Informasi Diri</h3>
                                        
                                        {/* Nama */}
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Nama <span className="text-red-500">*</span></label>
                                            <input 
                                                type="text" 
                                                value={data.name}
                                                onChange={e => setData('name', e.target.value)}
                                                className={`w-full rounded-xl border ${errors.name ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:border-primary focus:ring-primary/20'} bg-slate-50 p-3.5 transition-all outline-none focus:ring-4`}
                                                placeholder="Jawaban Anda"
                                            />
                                            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                                        </div>

                                        {/* Usia */}
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Usia (Tulis Angka) <span className="text-red-500">*</span></label>
                                            <input 
                                                type="number" 
                                                min={1}
                                                value={data.age}
                                                onChange={e => setData('age', e.target.value)}
                                                onKeyDown={e => ['-', '+', 'e', 'E'].includes(e.key) && e.preventDefault()}
                                                className={`w-full rounded-xl border ${errors.age ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:border-primary focus:ring-primary/20'} bg-slate-50 p-3.5 transition-all outline-none focus:ring-4`}
                                                placeholder="Jawaban Anda"
                                            />
                                            {errors.age && <p className="mt-1 text-sm text-red-500">{errors.age}</p>}
                                        </div>

                                        {/* Alamat Domisili */}
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Alamat Domisili <span className="text-red-500">*</span></label>
                                            <input 
                                                type="text" 
                                                value={data.domicile}
                                                onChange={e => setData('domicile', e.target.value)}
                                                className={`w-full rounded-xl border ${errors.domicile ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:border-primary focus:ring-primary/20'} bg-slate-50 p-3.5 transition-all outline-none focus:ring-4`}
                                                placeholder="Jawaban Anda"
                                            />
                                            {errors.domicile && <p className="mt-1 text-sm text-red-500">{errors.domicile}</p>}
                                        </div>

                                        {/* Status */}
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-3">Status <span className="text-red-500">*</span></label>
                                            <div className="space-y-3">
                                                {['Mahasiswa', 'Dosen', 'Pegawai', 'Masyarakat Umum'].map(status => (
                                                    <label key={status} className="flex items-center gap-3 cursor-pointer group">
                                                        <div className="relative flex items-center justify-center">
                                                            <input 
                                                                type="radio" 
                                                                name="status"
                                                                value={status}
                                                                checked={data.applicant_status === status}
                                                                onChange={e => setData('applicant_status', e.target.value)}
                                                                className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-full checked:border-primary transition-colors cursor-pointer"
                                                            />
                                                            <div className="absolute w-2.5 h-2.5 bg-primary rounded-full opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"></div>
                                                        </div>
                                                        <span className="text-slate-700 group-hover:text-primary transition-colors">{status}</span>
                                                    </label>
                                                ))}
                                            </div>
                                            {errors.applicant_status && <p className="mt-1 text-sm text-red-500">{errors.applicant_status}</p>}
                                        </div>

                                        {/* Semester */}
                                        {data.applicant_status === 'Mahasiswa' && (
                                            <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 mb-2">Fakultas <span className="text-red-500">*</span></label>
                                                    <select 
                                                        value={data.fakultas}
                                                        onChange={e => setData('fakultas', e.target.value)}
                                                        className={`w-full rounded-xl border ${errors.fakultas ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:border-primary focus:ring-primary/20'} bg-slate-50 p-3.5 transition-all outline-none focus:ring-4`}
                                                    >
                                                        <option value="">Pilih Fakultas...</option>
                                                        {fakultas.map(f => (
                                                            <option key={f.id} value={f.name}>{f.name}</option>
                                                        ))}
                                                    </select>
                                                    {errors.fakultas && <p className="mt-1 text-sm text-red-500">{errors.fakultas}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 mb-2">Program Studi <span className="text-red-500">*</span></label>
                                                    <input 
                                                        type="text" 
                                                        value={data.prodi}
                                                        onChange={e => setData('prodi', e.target.value)}
                                                        className={`w-full rounded-xl border ${errors.prodi ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:border-primary focus:ring-primary/20'} bg-slate-50 p-3.5 transition-all outline-none focus:ring-4`}
                                                        placeholder="Misal: Psikologi"
                                                    />
                                                    {errors.prodi && <p className="mt-1 text-sm text-red-500">{errors.prodi}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 mb-2">Semester <span className="text-red-500">*</span></label>
                                                    <input 
                                                        type="text" 
                                                        value={data.semester}
                                                        onChange={e => setData('semester', e.target.value)}
                                                        className={`w-full rounded-xl border ${errors.semester ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:border-primary focus:ring-primary/20'} bg-slate-50 p-3.5 transition-all outline-none focus:ring-4`}
                                                        placeholder="Jawaban Anda"
                                                    />
                                                    {errors.semester && <p className="mt-1 text-sm text-red-500">{errors.semester}</p>}
                                                </div>
                                            </div>
                                        )}

                                        {/* No Telepon */}
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2">No. Telepon <span className="text-red-500">*</span></label>
                                                <input 
                                                    type="text" 
                                                    value={data.phone}
                                                    onChange={e => setData('phone', e.target.value)}
                                                    className={`w-full rounded-xl border ${errors.phone ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:border-primary focus:ring-primary/20'} bg-slate-50 p-3.5 transition-all outline-none focus:ring-4`}
                                                    placeholder="Contoh: 628123456789"
                                                />
                                                <p className="mt-1.5 text-xs text-slate-400">⚠️ Diawali dengan <strong>62</strong>, tanpa tanda + atau spasi. Contoh: <strong>62811234567</strong></p>
                                                {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                                            </div>

                                            {/* WhatsApp */}
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2">No. WhatsApp/Telegram <span className="text-red-500">*</span></label>
                                                <input 
                                                    type="text" 
                                                    value={data.whatsapp}
                                                    onChange={e => setData('whatsapp', e.target.value)}
                                                    className={`w-full rounded-xl border ${errors.whatsapp ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:border-primary focus:ring-primary/20'} bg-slate-50 p-3.5 transition-all outline-none focus:ring-4`}
                                                    placeholder="Contoh: 628123456789"
                                                />
                                                <p className="mt-1.5 text-xs text-slate-400">⚠️ Diawali dengan <strong>62</strong>, tanpa tanda + atau spasi. Contoh: <strong>62811234567</strong></p>
                                                {errors.whatsapp && <p className="mt-1 text-sm text-red-500">{errors.whatsapp}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Detail Permasalahan</h3>

                                        {/* Deskripsi Masalah */}
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Silahkan deskripsikan masalah/keluhan yang dirasakan selama ini <span className="text-red-500">*</span></label>
                                            <textarea 
                                                rows={4}
                                                value={data.problem_description}
                                                onChange={e => { setData('problem_description', e.target.value); autoGrow(e.target); }}
                                                className={`w-full rounded-xl border ${errors.problem_description ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:border-primary focus:ring-primary/20'} bg-slate-50 p-3.5 transition-all outline-none focus:ring-4 resize-none overflow-hidden`}
                                                placeholder="Jawaban Anda"
                                            ></textarea>
                                            {errors.problem_description && <p className="mt-1 text-sm text-red-500">{errors.problem_description}</p>}
                                        </div>

                                        {/* Sudah berapa lama */}
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Sudah berapa lama Anda merasakan masalah/keluhan selama ini <span className="text-red-500">*</span></label>
                                            <textarea 
                                                rows={2}
                                                value={data.problem_duration}
                                                onChange={e => { setData('problem_duration', e.target.value); autoGrow(e.target); }}
                                                className={`w-full rounded-xl border ${errors.problem_duration ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:border-primary focus:ring-primary/20'} bg-slate-50 p-3.5 transition-all outline-none focus:ring-4 resize-none overflow-hidden`}
                                                placeholder="Jawaban Anda"
                                            ></textarea>
                                            {errors.problem_duration && <p className="mt-1 text-sm text-red-500">{errors.problem_duration}</p>}
                                        </div>

                                        {/* Apa yang dilakukan */}
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Apa yang Anda lakukan ketika perasaan itu muncul? <span className="text-red-500">*</span></label>
                                            <textarea 
                                                rows={2}
                                                value={data.action_taken}
                                                onChange={e => { setData('action_taken', e.target.value); autoGrow(e.target); }}
                                                className={`w-full rounded-xl border ${errors.action_taken ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:border-primary focus:ring-primary/20'} bg-slate-50 p-3.5 transition-all outline-none focus:ring-4 resize-none overflow-hidden`}
                                                placeholder="Jawaban Anda"
                                            ></textarea>
                                            {errors.action_taken && <p className="mt-1 text-sm text-red-500">{errors.action_taken}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-6 bg-purple-50/50 p-6 rounded-2xl border border-purple-100">
                                        <h3 className="text-lg font-bold text-primary">Jadwal Konsultasi</h3>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Yuk, pilih waktu yang ingin Anda konsultasikan! (Tanggal) <span className="text-red-500">*</span></label>
                                            <input 
                                                type="date" 
                                                min={today}
                                                value={data.preferred_date}
                                                onChange={e => setData('preferred_date', e.target.value)}
                                                className={`w-full md:w-1/2 rounded-xl border ${errors.preferred_date ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:border-primary focus:ring-primary/20'} bg-white p-3.5 transition-all outline-none focus:ring-4`}
                                            />
                                            {errors.preferred_date && <p className="mt-1 text-sm text-red-500">{errors.preferred_date}</p>}
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-slate-100 flex flex-col items-center">
                                        {Object.keys(errors).length > 0 && (
                                            <div className="w-full mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center justify-center gap-2 animate-in fade-in">
                                                <RiInformationLine className="w-5 h-5 shrink-0" />
                                                <span className="font-medium text-sm">Ada isian yang belum lengkap atau tidak valid. Silakan periksa kembali form di atas.</span>
                                            </div>
                                        )}
                                        <button 
                                            type="submit" 
                                            disabled={processing}
                                            className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-purple-900 text-white px-10 py-4 rounded-xl font-bold transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/30 disabled:opacity-70 disabled:pointer-events-none"
                                        >
                                            {processing ? (
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            ) : (
                                                <RiSendPlaneFill className="w-5 h-5" />
                                            )}
                                            {processing ? 'Memproses...' : 'Kirim Formulir Pendaftaran'}
                                        </button>
                                        <p className="mt-4 text-xs text-slate-500 text-center">*Data dan cerita Anda akan dijaga kerahasiaannya oleh tim kami.</p>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
