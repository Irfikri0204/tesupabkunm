import React from 'react';
import { Head, router } from '@inertiajs/react';
import { RiPrinterLine, RiArrowLeftLine, RiInformationLine } from '@remixicon/react';

interface Props {
    group: any;
    headerInfo: {
        institusiKlien: string;
        periodeAsesmen: string;
        totalPartisipan: number;
    };
    distribusiFakultas: Array<{
        id: number;
        nama: string;
        total_partisipan: number;
        persentase: string;
        pct_raw: number;
    }>;
    totalSkorPartisipan: number;
    petaMasalahDominan: Array<{
        id: number;
        nama: string;
        masalah_dominan: string;
        skor_rata_rata: string;
    }>;
    rincianFakultas: Array<{
        id: number;
        nama: string;
        prodis: Array<{
            id: number;
            nama: string;
            total_partisipan: number;
            masalah_dominan: string;
            prioritas: 'High' | 'Medium' | 'Low';
        }>;
    }>;
    rekapitulasiIndividu: Array<{
        prodi_id: number | null;
        prodi_nama: string;
        fakultas_nama: string;
        total_mahasiswa: number;
        students: Array<{
            no: number;
            nim: string;
            nama: string;
            jk: string;
            angkatan: string;
            skor_pribadi: number;
            skor_sosial: number;
            skor_belajar: number;
            skor_karier: number;
            skor_lainnya: number;
            status_risiko: 'Tinggi' | 'Sedang' | 'Rendah';
        }>;
    }>;
    analisisTerbidang: Record<string, {
        bidang: string;
        items: Array<{
            nama: string;
            nim: string;
            prodi: string;
            skor: number;
            raw_skor: number;
            keterangan: string;
        }>;
    }>;
}

export default function ProfilingReport({
    group,
    headerInfo,
    distribusiFakultas,
    totalSkorPartisipan,
    petaMasalahDominan,
    rincianFakultas,
    rekapitulasiIndividu,
    analisisTerbidang,
}: Props) {
    const handlePrint = () => {
        window.print();
    };

    const getPrioritasBadge = (prioritas: string) => {
        if (prioritas === 'High') {
            return <span className="font-bold text-red-600 bg-red-50 px-2.5 py-0.5 rounded text-xs border border-red-200/60">High</span>;
        }
        if (prioritas === 'Medium') {
            return <span className="font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded text-xs border border-amber-200/60">Medium</span>;
        }
        return <span className="font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded text-xs border border-emerald-200/60">Low</span>;
    };

    const getRisikoBadge = (status: string) => {
        if (status === 'Tinggi') {
            return <span className="font-bold text-red-600">Tinggi</span>;
        }
        if (status === 'Sedang') {
            return <span className="font-bold text-amber-600">Sedang</span>;
        }
        return <span className="font-bold text-emerald-600">Rendah</span>;
    };

    const bidangOrder = ['pribadi', 'sosial', 'belajar', 'karier', 'lainnya'];

    return (
        <div className="min-h-screen bg-slate-100 font-sans print:bg-white text-slate-800">
            <Head title={`Laporan Profiling Asesmen - ${group.name}`} />

            {/* Top Toolbar (Hidden on Print) */}
            <div className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 px-4 py-3 shadow-sm print:hidden">
                <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => router.visit(`/admin/imm-groups/${group.id}`)}
                            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5 text-sm font-bold"
                            title="Kembali ke Kelompok SIKOM"
                        >
                            <RiArrowLeftLine size={18} /> Kembali
                        </button>
                        <div className="h-5 w-px bg-slate-200" />
                        <div>
                            <h2 className="font-black text-slate-800 text-sm md:text-base leading-tight">
                                Cetak Laporan Profiling Kelompok Asesmen
                            </h2>
                            <p className="text-xs text-slate-500 font-medium">{group.name}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={handlePrint}
                            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 active:scale-95 transition-all"
                        >
                            <RiPrinterLine size={18} /> Cetak / Simpan PDF
                        </button>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto mt-2 text-[12px] text-slate-500 flex items-center gap-1.5">
                    <RiInformationLine size={14} className="text-blue-500 flex-shrink-0" />
                    <span>
                        Tips Cetak: Pada menu cetak browser, pilih <strong>"Save as PDF" / "Simpan sebagai PDF"</strong> dengan ukuran kertas <strong>A4</strong>
                    </span>
                </div>
            </div>

            {/* Document Container */}
            <main className="max-w-5xl mx-auto my-8 p-8 md:p-12 bg-white rounded-2xl shadow-xl border border-slate-200/80 print:my-0 print:p-0 print:shadow-none print:border-none print:max-w-none print:rounded-none">

                {/* ────────────── HEADER BLOCK ────────────── */}
                <header className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight uppercase leading-snug">
                        LAPORAN REKAPITULASI HASIL ASESMEN PSIKOLOGIS
                    </h1>
                    <p className="text-blue-600 font-bold text-base md:text-lg mt-1 mb-4">
                        5 Bidang Layanan Bimbingan dan Konseling
                    </p>

                    <div className="space-y-1.5 text-sm text-slate-700 font-medium">
                        <p>
                            <span className="font-bold text-slate-900 inline-block w-40">Institusi Klien:</span>
                            <span>{headerInfo.institusiKlien}</span>
                        </p>
                        <p>
                            <span className="font-bold text-slate-900 inline-block w-40">Periode Asesmen:</span>
                            <span>{headerInfo.periodeAsesmen}</span>
                        </p>
                        <p>
                            <span className="font-bold text-slate-900 inline-block w-40">Total Partisipan:</span>
                            <span>{headerInfo.totalPartisipan.toLocaleString('id-ID')} Mahasiswa</span>
                        </p>
                    </div>

                    <hr className="mt-4 mb-5 border-slate-300" />
                </header>

                {/* ────────────── BAGIAN 1: PROFIL TINGKAT FAKULTAS ────────────── */}
                <section className="mb-8 section-block">
                    <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight mb-5">
                        BAGIAN 1: PROFIL TINGKAT FAKULTAS
                    </h2>

                    {/* 1.1 Distribusi Pengguna per Fakultas */}
                    <div className="mb-6 page-break-avoid">
                        <h3 className="text-base font-bold text-blue-600 mb-2.5">
                            1.1. Distribusi Pengguna per Fakultas
                        </h3>
                        <div className="overflow-x-auto border border-slate-300 rounded-lg shadow-2xs">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-800 font-bold border-b border-slate-300">
                                    <tr>
                                        <th className="py-2.5 px-4">Nama Fakultas</th>
                                        <th className="py-2.5 px-4">Total Skor</th>
                                        <th className="py-2.5 px-4">Persentase dari Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {distribusiFakultas.map((fac) => (
                                        <tr key={fac.id} className="hover:bg-slate-50/50">
                                            <td className="py-2 px-4 font-medium text-slate-800">{fac.nama}</td>
                                            <td className="py-2 px-4 text-slate-700">{fac.total_partisipan.toLocaleString('id-ID')}</td>
                                            <td className="py-2 px-4 text-slate-700">{fac.persentase}</td>
                                        </tr>
                                    ))}
                                    {distribusiFakultas.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="py-3 px-4 text-center text-slate-400">Belum ada data fakultas.</td>
                                        </tr>
                                    )}
                                </tbody>
                                <tfoot className="border-t-2 border-slate-300 bg-slate-50 font-bold text-slate-900">
                                    <tr>
                                        <td className="py-2.5 px-4">Total</td>
                                        <td className="py-2.5 px-4">{totalSkorPartisipan.toLocaleString('id-ID')}</td>
                                        <td className="py-2.5 px-4">100,0%</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/* 1.2 Peta Masalah Dominan per Fakultas */}
                    <div className="mb-6 page-break-avoid">
                        <h3 className="text-base font-bold text-blue-600 mb-2.5">
                            1.2. Peta Masalah Dominan per Fakultas
                        </h3>
                        <div className="overflow-x-auto border border-slate-300 rounded-lg shadow-2xs">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-800 font-bold border-b border-slate-300">
                                    <tr>
                                        <th className="py-2.5 px-4">Nama Fakultas</th>
                                        <th className="py-2.5 px-4">Masalah Dominan (Rata-rata Tertinggi)</th>
                                        <th className="py-2.5 px-4">Skor Rata-rata Bidang (0-100)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {petaMasalahDominan.map((fac) => (
                                        <tr key={fac.id} className="hover:bg-slate-50/50">
                                            <td className="py-2 px-4 font-medium text-slate-800">{fac.nama}</td>
                                            <td className="py-2 px-4 text-slate-700 font-medium">{fac.masalah_dominan}</td>
                                            <td className="py-2 px-4 text-slate-700">{fac.skor_rata_rata}</td>
                                        </tr>
                                    ))}
                                    {petaMasalahDominan.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="py-3 px-4 text-center text-slate-400">Belum ada data peta masalah.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>


                {/* ────────────── BAGIAN 2: PROFIL TINGKAT PROGRAM STUDI ────────────── */}
                <section className="mb-12 section-block page-break">
                    <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight mb-6">
                        BAGIAN 2: PROFIL TINGKAT PROGRAM STUDI
                    </h2>

                    {rincianFakultas.map((fac, idx) => (
                        <div key={fac.id} className="mb-10 page-break-avoid">
                            <h3 className="text-base font-black text-slate-900 mb-3.5">
                                2.{idx + 1}. Rincian Fakultas {fac.nama}
                            </h3>
                            <div className="overflow-x-auto border border-slate-300 rounded-lg shadow-2xs">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 text-slate-800 font-bold border-b border-slate-300">
                                        <tr>
                                            <th className="py-2.5 px-4">Program Studi</th>
                                            <th className="py-2.5 px-4">Total Partisipan</th>
                                            <th className="py-2.5 px-4">Masalah Dominan di Prodi Ini</th>
                                            <th className="py-2.5 px-4 text-center">Prioritas Penanganan</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {fac.prodis.map((prodi) => (
                                            <tr key={prodi.id} className="hover:bg-slate-50/50">
                                                <td className="py-2 px-4 font-medium text-slate-800">{prodi.nama}</td>
                                                <td className="py-2 px-4 text-slate-700">{prodi.total_partisipan.toLocaleString('id-ID')}</td>
                                                <td className="py-2 px-4 text-slate-700">{prodi.masalah_dominan}</td>
                                                <td className="py-2 px-4 text-center">{getPrioritasBadge(prodi.prioritas)}</td>
                                            </tr>
                                        ))}
                                        {fac.prodis.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="py-3 px-4 text-center text-slate-400">Belum ada program studi yang terdaftar.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                    {rincianFakultas.length === 0 && (
                        <p className="text-sm text-slate-400 italic">Belum ada data fakultas / program studi.</p>
                    )}
                </section>

                {/* ────────────── BAGIAN 3: IDENTITAS DAN SKOR INDIVIDU (LANDSCAPE) ────────────── */}
                <section className="mb-12 section-block page-break page-landscape">
                    <div className="mb-6">
                        <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight">
                            BAGIAN 3: IDENTITAS DAN SKOR INDIVIDU
                        </h2>
                    </div>

                    {rekapitulasiIndividu.map((item, idx) => (
                        <div key={item.prodi_id || idx} className="mb-10 page-break-avoid">
                            <h3 className="text-sm font-bold text-blue-600 mb-3.5">
                                3.{idx + 1}. Rekapitulasi Data Individu ({item.prodi_nama} — {item.fakultas_nama})
                            </h3>
                            <div className="overflow-x-auto border border-slate-300 rounded-lg shadow-2xs">
                                <table className="w-full text-left text-xs whitespace-nowrap">
                                    <thead className="bg-slate-50 text-slate-800 font-bold border-b border-slate-300">
                                        <tr>
                                            <th className="py-3 px-3 text-center w-12">No</th>
                                            <th className="py-3 px-4">NIM</th>
                                            <th className="py-3 px-4">Nama Lengkap</th>
                                            <th className="py-3 px-3 text-center w-12">JK</th>
                                            <th className="py-3 px-3 text-center w-20">Angkatan</th>
                                            <th className="py-3 px-3 text-center">Pribadi</th>
                                            <th className="py-3 px-3 text-center">Sosial</th>
                                            <th className="py-3 px-3 text-center">Belajar</th>
                                            <th className="py-3 px-3 text-center">Karir</th>
                                            <th className="py-3 px-3 text-center">Lainnya</th>
                                            <th className="py-3 px-4 text-center">Status Risiko</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {item.students.map((s) => (
                                            <tr key={s.nim + s.no} className="hover:bg-slate-50/50">
                                                <td className="py-2.5 px-3 text-center text-slate-500">{s.no}</td>
                                                <td className="py-2.5 px-4 font-mono text-xs text-slate-600">{s.nim}</td>
                                                <td className="py-2.5 px-4 font-medium text-slate-800">{s.nama}</td>
                                                <td className="py-2.5 px-3 text-center font-bold text-slate-600">{s.jk}</td>
                                                <td className="py-2.5 px-3 text-center text-slate-600">{s.angkatan}</td>
                                                <td className="py-2.5 px-3 text-center font-bold text-slate-700">{s.skor_pribadi}</td>
                                                <td className="py-2.5 px-3 text-center font-bold text-slate-700">{s.skor_sosial}</td>
                                                <td className="py-2.5 px-3 text-center font-bold text-slate-700">{s.skor_belajar}</td>
                                                <td className="py-2.5 px-3 text-center font-bold text-slate-700">{s.skor_karier}</td>
                                                <td className="py-2.5 px-3 text-center font-bold text-slate-700">{s.skor_lainnya}</td>
                                                <td className="py-2.5 px-4 text-center">{getRisikoBadge(s.status_risiko)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                    {rekapitulasiIndividu.length === 0 && (
                        <p className="text-sm text-slate-400 italic">Belum ada data mahasiswa untuk ditampilkan.</p>
                    )}
                </section>

                {/* ────────────── BAGIAN 4: ANALISIS ASPEK TERBIDANG TERTINGGI ────────────── */}
                <section className="mb-10 section-block page-break">
                    <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight mb-6">
                        BAGIAN 4: ANALISIS ASPEK TERBIDANG TERTINGGI
                    </h2>

                    {bidangOrder.map((key, bIdx) => {
                        const data = analisisTerbidang[key];
                        if (!data) return null;

                        const displayItems = data.items;

                        return (
                            <div key={key} className="mb-10 page-break-avoid">
                                <h3 className="text-base font-bold text-blue-600 mb-3.5">
                                    4.{bIdx + 1}. Daftar Mahasiswa dengan Masalah Tertinggi - Bidang {data.bidang.toUpperCase()}
                                </h3>
                                <div className="overflow-x-auto border border-slate-300 rounded-lg shadow-2xs">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-slate-50 text-slate-800 font-bold border-b border-slate-300">
                                            <tr>
                                                <th className="py-2.5 px-4 w-48">Nama</th>
                                                <th className="py-2.5 px-3 w-32">NIM</th>
                                                <th className="py-2.5 px-4 w-44">Prodi</th>
                                                <th className="py-2.5 px-3 text-center w-32">Skor {data.bidang}</th>
                                                <th className="py-2.5 px-4">Keterangan / Saran Intervensi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200 text-xs md:text-sm">
                                            {displayItems.map((item, idx) => (
                                                <tr key={item.nim + idx} className="hover:bg-slate-50/50">
                                                    <td className="py-2 px-4 font-bold text-slate-800">{item.nama}</td>
                                                    <td className="py-2 px-3 font-mono text-xs text-slate-500">{item.nim}</td>
                                                    <td className="py-2 px-4 text-slate-600">{item.prodi}</td>
                                                    <td className="py-2 px-3 text-center font-black text-blue-700">
                                                        {item.skor}
                                                    </td>
                                                    <td className="py-2 px-4 text-slate-700 leading-relaxed text-xs">
                                                        {item.keterangan}
                                                    </td>
                                                </tr>
                                            ))}
                                            {displayItems.length === 0 && (
                                                <tr>
                                                    <td colSpan={5} className="py-4 px-5 text-center text-slate-400">
                                                        Tidak ada data mahasiswa untuk kriteria ini.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        );
                    })}
                </section>
            </main>

            {/* Print Stylesheet: @page MUST be at the top level outside @media */}
            <style>{`
                @page {
                    size: A4 portrait;
                    margin-top: 2.5cm;
                    margin-left: 2.5cm;
                    margin-bottom: 2cm;
                    margin-right: 2cm;
                }
                @page landscape-page {
                    size: A4 landscape;
                    margin-top: 2cm;
                    margin-left: 2.5cm;
                    margin-bottom: 2cm;
                    margin-right: 2cm;
                }
                @media print {
                    html, body {
                        background-color: white !important;
                        color: #0f172a !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    main {
                        max-width: 100% !important;
                        width: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        border: none !important;
                        box-shadow: none !important;
                        box-sizing: border-box !important;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                    .page-break {
                        page-break-before: always !important;
                        break-before: page !important;
                    }
                    .page-break-avoid {
                        page-break-inside: avoid !important;
                        break-inside: avoid !important;
                    }
                    tr {
                        page-break-inside: avoid !important;
                        break-inside: avoid !important;
                    }
                    .page-landscape {
                        page: landscape-page;
                        page-break-before: always !important;
                        break-before: page !important;
                    }
                    table {
                        width: 100% !important;
                        border-collapse: collapse !important;
                    }
                    th, td {
                        border-color: #cbd5e1 !important;
                    }
                }
            `}</style>
        </div>
    );
}
