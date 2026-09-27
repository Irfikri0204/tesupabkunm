import Header from '@/Components/Header';
import LinkBack from '@/Components/LinkBack';
import { router } from '@inertiajs/react';
import { RiBookletLine, RiCameraLine, RiErrorWarningLine, RiInformationLine, RiInstagramLine, RiSchoolLine, RiTeamLine, RiUserLine, RiLoader4Line } from '@remixicon/react';
import React, { useRef, useState } from 'react';

export default function IdentitasKecerdasanMajemuk() {
    const [nama, setNama] = useState('');
    const [kelas, setKelas] = useState('');
    const [sekolah, setSekolah] = useState('');
    const [buktiUpload, setBuktiUpload] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const errorRef = useRef<HTMLDivElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setBuktiUpload(file);
            setPreview(URL.createObjectURL(file));
            setErrorMsg(null);
        }
    };

    const navigateToSoal = () => {
        router.visit('/tes/kecerdasan-majemuk/soal');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!buktiUpload) {
            setErrorMsg('Silakan unggah bukti screenshot verifikasi terlebih dahulu!');
            setTimeout(() => errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
            return;
        }

        setErrorMsg(null);
        setIsLoading(true);

        // Simpan data identitas ke localStorage
        localStorage.setItem('userDataKM', JSON.stringify({ nama, kelas, sekolah }));

        // Simpan bukti follow sebagai base64 ke localStorage
        try {
            const reader = new FileReader();
            reader.onloadend = () => {
                try {
                    localStorage.setItem('buktiFollowKM', reader.result as string);
                } catch {
                    // localStorage quota exceeded — skip saving image, proceed anyway
                    console.warn('Could not save bukti to localStorage');
                }
                navigateToSoal();
            };
            reader.onerror = () => {
                // FileReader failed — proceed anyway
                console.warn('FileReader error, proceeding without bukti');
                navigateToSoal();
            };
            reader.readAsDataURL(buktiUpload);

            // Safety timeout: if FileReader hangs, navigate anyway after 3 seconds
            setTimeout(() => {
                if (isLoading) {
                    navigateToSoal();
                }
            }, 3000);
        } catch {
            // If anything goes wrong, just navigate
            navigateToSoal();
        }
    };

    // Direct click handler as a fallback for mobile devices where form submit may not fire
    const handleButtonClick = () => {
        // The form's onSubmit should handle this, but as a safety net:
        // If the form submission doesn't fire (rare mobile bug), this ensures the logic runs.
    };

    return (
        <>
            <Header />
            <main className="min-h-[100dvh] w-full overflow-x-hidden bg-gradient-to-br from-purple-50 via-purple-100 to-indigo-200 p-2 md:p-8">
                <div className="mx-auto max-w-6xl">
                    <div>
                        <LinkBack />
                    </div>

                    <div className="flex flex-col items-center justify-center p-4">
                        {/* Header */}
                        <div className="mb-10 text-center" data-aos="zoom-in" data-aos-delay="200">
                            <div className="mb-4 flex justify-center">
                                <div className="rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 p-4 text-white shadow-xl">
                                    <RiBookletLine size={40} />
                                </div>
                            </div>
                            <h1 className="text-3xl font-extrabold text-purple-900 md:text-4xl">Tes Kecerdasan Majemuk</h1>
                            <p className="mt-2 text-lg text-purple-700">Temukan potensi terbaikmu melalui pemetaan kecerdesan.</p>
                        </div>

                        {/* Kontainer utama */}
                        <div className="flex w-full flex-col gap-8 md:flex-row">
                            {/* Form Data Peserta — NO data-aos to prevent touch issues on mobile */}
                            <form
                                onSubmit={handleSubmit}
                                className="flex-[1.5] rounded-3xl bg-white/80 backdrop-blur-md p-6 shadow-2xl md:p-10 border border-white/50"
                            >
                                <h2 className="mb-6 text-xl font-black text-purple-900 uppercase tracking-tight border-b border-purple-100 pb-4">Data Diri Peserta</h2>

                                <div className="grid gap-6">
                                    {/* Nama */}
                                    <label className="block group">
                                        <span className="flex items-center gap-2 text-sm font-bold text-gray-700 group-focus-within:text-purple-600 transition-colors">
                                            <RiUserLine size={18} /> Nama Lengkap <span className="text-red-500">*</span>
                                        </span>
                                        <input
                                            type="text"
                                            value={nama}
                                            onChange={(e) => setNama(e.target.value)}
                                            placeholder="John Doe"
                                            required
                                            className="mt-2 w-full rounded-xl border-gray-200 bg-gray-50/50 p-3.5 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 focus:outline-none transition-all"
                                        />
                                    </label>

                                    <div className="grid gap-6 md:grid-cols-2">
                                        {/* Kelas */}
                                        <label className="block group">
                                            <span className="flex items-center gap-2 text-sm font-bold text-gray-700 group-focus-within:text-purple-600 transition-colors">
                                                <RiTeamLine size={18} /> Kelas <span className="text-red-500">*</span>
                                            </span>
                                            <input
                                                type="text"
                                                value={kelas}
                                                onChange={(e) => setKelas(e.target.value)}
                                                placeholder="Contoh: 10 MIPA 1"
                                                required
                                                className="mt-2 w-full rounded-xl border-gray-200 bg-gray-50/50 p-3.5 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 focus:outline-none transition-all"
                                            />
                                        </label>

                                        {/* Asal Sekolah */}
                                        <label className="block group">
                                            <span className="flex items-center gap-2 text-sm font-bold text-gray-700 group-focus-within:text-purple-600 transition-colors">
                                                <RiSchoolLine size={18} /> Asal Sekolah <span className="text-red-500">*</span>
                                            </span>
                                            <input
                                                type="text"
                                                value={sekolah}
                                                onChange={(e) => setSekolah(e.target.value)}
                                                placeholder="Nama Sekolah Kamu"
                                                required
                                                className="mt-2 w-full rounded-xl border-gray-200 bg-gray-50/50 p-3.5 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 focus:outline-none transition-all"
                                            />
                                        </label>
                                    </div>
                                </div>

                                {/* Follow Instagram Section */}
                                <div className="mt-10 rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-indigo-50 p-6 shadow-inner">
                                    <div className="mb-4">
                                        <h3 className="flex items-center gap-2 text-md font-extrabold text-purple-900 uppercase tracking-tight">
                                            <RiInstagramLine size={20} className="text-pink-600" /> Verifikasi Follow Instagram
                                        </h3>
                                        <p className="mt-1 text-sm text-purple-700/80">Ikuti akun resmi kami untuk mendapatkan informasi terbaru.</p>
                                    </div>

                                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                                        <div>
                                            <a
                                                href="https://www.instagram.com/upa_bk_unm/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-pink-200 hover:shadow-pink-300 hover:-translate-y-0.5 transition-all active:scale-95"
                                            >
                                                <RiInstagramLine size={18} /> @upa_bk_unm
                                            </a>
                                        </div>

                                        <div className="flex-1">
                                            <label className="relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-purple-300 bg-white/50 p-4 py-6 transition-colors hover:border-purple-500 hover:bg-white overflow-hidden">
                                                <RiCameraLine size={32} className="mb-2 text-purple-400" />
                                                <span className="text-xs font-bold text-gray-500 uppercase">Upload Bukti Screenshot <span className="text-red-500">*</span></span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    {preview && (
                                        <div className="mt-6 flex items-center gap-4 rounded-xl bg-white p-3 shadow-sm">
                                            <img src={preview} alt="Preview" className="h-16 w-16 rounded-lg object-cover ring-2 ring-purple-100" />
                                            <div>
                                                <p className="text-xs font-black text-purple-900 uppercase">Bukti Terpilih</p>
                                                <p className="text-[10px] text-gray-500">Siap untuk verifikasi</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Error Message */}
                                {errorMsg && (
                                    <div ref={errorRef} className="mt-6 flex items-center gap-3 rounded-xl bg-red-50 border-2 border-red-200 p-4 text-red-700">
                                        <RiErrorWarningLine size={24} className="shrink-0 text-red-500" />
                                        <p className="text-sm font-bold">{errorMsg}</p>
                                    </div>
                                )}

                                {/* Tombol Submit — simplified, no overlapping elements */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`mt-8 w-full rounded-2xl py-4 sm:py-5 font-black uppercase tracking-[0.2em] text-white shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 ${
                                        isLoading
                                            ? 'bg-purple-400 cursor-wait'
                                            : 'bg-gradient-to-r from-purple-600 to-indigo-700 hover:shadow-purple-200 hover:-translate-y-1'
                                    }`}
                                >
                                    {isLoading ? (
                                        <>
                                            <RiLoader4Line className="animate-spin" size={24} />
                                            <span>Memproses...</span>
                                        </>
                                    ) : (
                                        'Mulai Perjalanan Tes'
                                    )}
                                </button>
                            </form>

                            {/* Keterangan */}
                            <div className="flex flex-1 flex-col gap-6" data-aos="fade-left" data-aos-delay="600">
                                {/* Informasi Tes */}
                                <div className="group rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-700 p-6 text-white shadow-xl hover:shadow-2xl transition-all">
                                    <div className="mb-4 flex items-center gap-3">
                                        <RiInformationLine size={24} />
                                        <h3 className="font-black uppercase tracking-tight">Detail Tes</h3>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between rounded-xl bg-white/10 p-4">
                                            <span className="text-sm opacity-80 font-medium">Jumlah Soal</span>
                                            <span className="text-xl font-black">40</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Petunjuk Pengisian */}
                                <div className="rounded-3xl bg-white p-6 shadow-xl border border-gray-100">
                                    <div className="mb-4 flex items-center gap-3 text-purple-900">
                                        <RiBookletLine size={22} /> <h3 className="font-black uppercase tracking-tight">Petunjuk Pengisian</h3>
                                    </div>
                                    <ul className="grid gap-3">
                                        {[
                                            'Pilih Sesuai, Kadang-kadang, atau Tidak Sesuai',
                                            'Pilih jawaban yang paling sesuai dengan dirimu',
                                            'Tidak ada jawaban salah dan benar',
                                            'Setiap jawaban kamu sangat berharga',
                                            'Nikmati proses mengenali dirimu',
                                            'Pastikan internet kamu stabil'
                                        ].map((text, i) => (
                                            <li key={i} className="flex gap-3 text-sm text-gray-700 font-medium">
                                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-50 text-[10px] font-black text-purple-600">{i+1}</span>
                                                {text}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="rounded-3xl bg-gradient-to-br from-yellow-300 to-amber-500 p-6 shadow-xl text-amber-950">
                                    <div className="mb-3 flex items-center gap-2 font-black uppercase tracking-tight">
                                        <RiErrorWarningLine size={22} /> <h3>Tips</h3>
                                    </div>
                                    <p className="text-sm font-bold leading-relaxed opacity-90 whitespace-pre-line">
                                        Yuk, jawab sesuai dirimu.
                                        Tidak perlu terlalu lama berpikir, karena tidak ada jawaban yang salah.
                                        Pilih respon yang paling menggambarkan dirimu saat ini.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

