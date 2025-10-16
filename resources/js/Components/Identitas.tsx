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
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            {/* Header */}
            <div className="mb-6 text-center">
                <div className="mb-2 flex justify-center">
                    <div className="rounded-xl bg-primary p-3">
                        <RiBookletLine size={32} className="text-white" />
                    </div>
                </div>
                <h1 className="text-2xl font-semibold">Tes {testName}</h1>
                <p className="text-gray-700">Isi data diri kamu dulu, ya!</p>
            </div>

            {/* Kontainer utama */}
            <div className="flex w-full max-w-5xl flex-col gap-6 md:flex-row">
                {/* Form Data Peserta */}
                <form onSubmit={handleSubmit} className="flex-1 rounded-2xl bg-white p-6 shadow-md md:p-8">
                    <h2 className="mb-4 text-center text-lg font-semibold">Data Peserta</h2>

                    {/* Nama */}
                    <label className="mb-3 block">
                        <span className="flex items-center gap-2 text-sm font-medium text-gray-800">
                            <RiUserLine size={18} /> Nama Lengkap <span className="text-red-500">*</span>
                        </span>
                        <input
                            type="text"
                            value={nama}
                            onChange={(e) => setNama(e.target.value)}
                            placeholder="Masukkan nama lengkapmu"
                            required
                            className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-purple-400"
                        />
                    </label>

                    {/* Tanggal Lahir */}
                    <label className="mb-3 block">
                        <span className="flex items-center gap-2 text-sm font-medium text-gray-800">
                            <RiCalendarLine size={18} /> Tanggal Lahir <span className="text-red-500">*</span>
                        </span>
                        <input
                            type="date"
                            value={tanggal}
                            onChange={(e) => setTanggal(e.target.value)}
                            required
                            className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-purple-400"
                        />
                    </label>

                    {/* Jenis Kelamin */}
                    <label className="mb-4 block">
                        <span className="flex items-center gap-2 text-sm font-medium text-gray-800">
                            <RiTeamLine size={18} /> Jenis Kelamin
                        </span>
                        <div className="mt-2 flex gap-2">
                            <button
                                type="button"
                                onClick={() => setJenisKelamin('Laki-laki')}
                                className={`flex-1 rounded-lg border p-2 transition ${
                                    jenisKelamin === 'Laki-laki'
                                        ? 'border-purple-600 bg-purple-500 text-white'
                                        : 'border-gray-300 bg-gray-100 hover:bg-gray-200'
                                }`}
                            >
                                Laki-laki
                            </button>
                            <button
                                type="button"
                                onClick={() => setJenisKelamin('Perempuan')}
                                className={`flex-1 rounded-lg border p-2 transition ${
                                    jenisKelamin === 'Perempuan'
                                        ? 'border-purple-600 bg-purple-500 text-white'
                                        : 'border-gray-300 bg-gray-100 hover:bg-gray-200'
                                }`}
                            >
                                Perempuan
                            </button>
                        </div>
                    </label>

                    {/* Tombol Submit */}
                    <button type="submit" className="w-full rounded-xl bg-primary py-2 font-semibold text-white transition hover:bg-purple-500">
                        Selanjutnya
                    </button>
                </form>

                {/* Keterangan */}
                <div className="flex flex-1 flex-col gap-4">
                    {/* Informasi Tes */}
                    <div className="rounded-2xl bg-primary p-4 text-white shadow-md">
                        <div className="mb-2 flex items-center gap-2">
                            <RiInformationLine /> <h3 className="font-semibold">Informasi Tes</h3>
                        </div>
                        <p>Jumlah Soal: {totalSoal} Pertanyaan</p>
                    </div>

                    {/* Petunjuk Pengisian */}
                    <div className="rounded-2xl bg-white p-4 shadow-md">
                        <div className="mb-2 flex items-center gap-2">
                            <RiBookletLine /> <h3 className="font-semibold">Petunjuk Pengisian</h3>
                        </div>
                        <ul className="ml-6 list-disc text-sm text-gray-700">
                            <li>Baca setiap pertanyaan dengan teliti</li>
                            <li>Tidak ada jawaban benar atau salah</li>
                            <li>Jawab semua pertanyaan untuk hasil akurat</li>
                            <li>Pastikan koneksi internet stabil</li>
                            <li>Kerjakan di tempat yang tenang</li>
                        </ul>
                    </div>

                    {/* Tips */}
                    <div className="rounded-2xl bg-secondary p-4 shadow-md">
                        <div className="mb-2 flex items-center gap-2">
                            <RiErrorWarningLine /> <h3 className="font-semibold">Tips</h3>
                        </div>
                        <p className="text-sm text-gray-800">
                            Jawablah secara spontan sesuai kebiasaanmu sehari-hari. Jangan terlalu lama berpikir karena respon pertama biasanya paling
                            akurat.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
