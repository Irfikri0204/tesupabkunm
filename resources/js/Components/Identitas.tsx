import { router } from '@inertiajs/react';
import { RiBookletLine, RiCalendarLine, RiErrorWarningLine, RiInformationLine, RiTeamLine, RiUserLine } from '@remixicon/react';
import React, { useState } from 'react';

interface IdentitasProps {
    testName: string; // contoh: "Gaya Belajar"
    nextUrl: string; // contoh: "/tes-gaya-belajar/soal"
    totalSoal: number;
}

export default function Identitas({ testName, nextUrl, totalSoal }: IdentitasProps) {
    const [nama, setNama] = useState('');
    const [tanggal, setTanggal] = useState('');
    const [jenisKelamin, setJenisKelamin] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        localStorage.setItem('userData', JSON.stringify({ nama, tanggal, jenisKelamin }));
        router.visit(nextUrl);
    };

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-50 p-4 py-12 sm:p-8">
            {/* Background Decorations */}
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-purple-200/50 blur-3xl"></div>
            <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-yellow-200/30 blur-3xl"></div>

            {/* Header */}
            <div className="relative z-10 mb-10 text-center">
                <div className="mb-4 flex justify-center">
                    <div className="inline-flex items-center justify-center rounded-2xl bg-primary p-4 text-white shadow-xl shadow-primary/20">
                        <RiBookletLine size={40} />
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-slate-800 md:text-4xl">Tes {testName}</h1>
                <p className="mt-3 text-slate-500">Lengkapi data dirimu sebelum memulai tes psikologi ini.</p>
            </div>

            {/* Kontainer utama */}
            <div className="relative z-10 flex w-full max-w-5xl flex-col gap-8 lg:flex-row lg:items-start">
                {/* Form Data Peserta */}
                <form onSubmit={handleSubmit} className="flex-1 rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-200/50 sm:p-10">
                    <h2 className="mb-6 text-xl font-bold text-slate-800">Data Peserta</h2>

                    {/* Nama */}
                    <div className="mb-5">
                        <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                            <RiUserLine size={18} className="text-primary" /> Nama Lengkap <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={nama}
                            onChange={(e) => setNama(e.target.value)}
                            placeholder="Ketik namamu di sini..."
                            required
                            className="w-full rounded-xl border-slate-200 bg-slate-50 p-3.5 text-slate-800 transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
                        />
                    </div>

                    {/* Tanggal Lahir */}
                    <div className="mb-5">
                        <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                            <RiCalendarLine size={18} className="text-primary" /> Tanggal Lahir <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            value={tanggal}
                            onChange={(e) => setTanggal(e.target.value)}
                            required
                            className="w-full rounded-xl border-slate-200 bg-slate-50 p-3.5 text-slate-800 transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
                        />
                    </div>

                    {/* Jenis Kelamin */}
                    <div className="mb-8">
                        <label className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-700">
                            <RiTeamLine size={18} className="text-primary" /> Jenis Kelamin
                        </label>
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => setJenisKelamin('Laki-laki')}
                                className={`flex-1 rounded-xl border-2 py-3 font-semibold transition ${
                                    jenisKelamin === 'Laki-laki'
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-primary/30 hover:bg-white'
                                }`}
                            >
                                Laki-laki
                            </button>
                            <button
                                type="button"
                                onClick={() => setJenisKelamin('Perempuan')}
                                className={`flex-1 rounded-xl border-2 py-3 font-semibold transition ${
                                    jenisKelamin === 'Perempuan'
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-primary/30 hover:bg-white'
                                }`}
                            >
                                Perempuan
                            </button>
                        </div>
                    </div>

                    {/* Tombol Submit */}
                    <button 
                        type="submit" 
                        className="w-full rounded-full bg-secondary py-4 text-lg font-bold text-slate-900 shadow-lg shadow-yellow-400/30 transition hover:-translate-y-0.5 hover:bg-yellow-400 hover:shadow-xl"
                    >
                        Mulai Mengerjakan Tes
                    </button>
                </form>

                {/* Keterangan */}
                <div className="flex flex-1 flex-col gap-6 lg:max-w-sm">
                    {/* Informasi Tes */}
                    <div className="overflow-hidden rounded-[2rem] bg-primary text-white shadow-xl shadow-primary/20">
                        <div className="flex items-center gap-3 border-b border-white/10 p-6 pb-4">
                            <div className="rounded-xl bg-white/20 p-2"><RiInformationLine size={24} /></div>
                            <h3 className="text-lg font-bold">Detail Tes</h3>
                        </div>
                        <div className="p-6 pt-4">
                            <p className="flex items-center justify-between text-white/80">
                                <span>Total Pertanyaan</span>
                                <span className="font-bold text-white">{totalSoal} Soal</span>
                            </p>
                        </div>
                    </div>

                    {/* Petunjuk Pengisian */}
                    <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-lg shadow-slate-200/40">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="rounded-xl bg-purple-50 p-2 text-primary"><RiBookletLine size={24} /></div>
                            <h3 className="text-lg font-bold text-slate-800">Petunjuk</h3>
                        </div>
                        <ul className="ml-2 space-y-2 text-sm leading-relaxed text-slate-600">
                            <li className="flex items-start gap-2"><span className="text-primary">•</span> Baca setiap pertanyaan dengan teliti</li>
                            <li className="flex items-start gap-2"><span className="text-primary">•</span> Tidak ada jawaban benar atau salah</li>
                            <li className="flex items-start gap-2"><span className="text-primary">•</span> Jawab semua pertanyaan untuk hasil akurat</li>
                            <li className="flex items-start gap-2"><span className="text-primary">•</span> Kerjakan di tempat yang tenang</li>
                        </ul>
                    </div>

                    {/* Tips */}
                    <div className="rounded-[2rem] bg-yellow-50 p-6 shadow-lg shadow-slate-200/40">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="rounded-xl bg-secondary p-2 text-slate-900"><RiErrorWarningLine size={24} /></div>
                            <h3 className="text-lg font-bold text-slate-800">Tips</h3>
                        </div>
                        <p className="text-sm leading-relaxed text-slate-700">
                            Jawablah secara spontan sesuai kebiasaanmu sehari-hari. Jangan terlalu lama berpikir karena respon pertama biasanya paling akurat.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
