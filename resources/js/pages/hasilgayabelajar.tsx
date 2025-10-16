import IdentitasLayout from '@/layouts/IdentitasLayout';
import { useEffect, useState } from 'react';

export default function HasilGayaBelajar() {
    const [hasil, setHasil] = useState<{ kategori?: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const data = localStorage.getItem('hasilGayaBelajar');
            if (data) {
                setHasil(JSON.parse(data));
            } else {
                alert('Hasil tes tidak ditemukan. Silakan isi tes terlebih dahulu.');
                window.location.href = '/tes/gayabelajar';
            }
        } catch (e) {
            console.error('Error membaca localStorage:', e);
            alert('Terjadi kesalahan dalam membaca hasil tes.');
        } finally {
            setLoading(false);
        }
    }, []);

    if (loading) return <p className="mt-10 text-center">Memuat hasil...</p>;
    if (!hasil?.kategori) return null;

    const deskripsi: Record<string, string> = {
        visual: 'Orang dengan gaya belajar ini biasanya senang dan lebih mudah belajar dengan sesuatu yang bergambar atau warna-warna.',
        auditory: 'Orang dengan gaya belajar ini benar-benar menempatkan pendengaran sebagai alat utama untuk menyerap informasi atau pengetahuan.',
        kinesthetic:
            'Orang dengan gaya belajar ini menggunakan tangan sebagai alat penerima informasi agar bisa terus mengingatnya & dia merasa bisa belajar lebih baik kalau disertai kegiatan fisik.',
    };

    const ulangiTes = () => {
        if (confirm('Yakin ingin mengulangi tes?')) {
            localStorage.removeItem('hasilGayaBelajar');
            window.location.href = '/tes/gayabelajar';
        }
    };

    return (
        <IdentitasLayout>
            <div className="flex min-h-screen items-center justify-center">
                <div className="w-[90%] max-w-md rounded-2xl bg-primary p-8 text-center text-white shadow-lg">
                    <h2 className="mb-2 text-lg font-medium">Gaya Belajar Anda</h2>
                    <h1 className="mb-4 text-3xl font-bold capitalize">{hasil.kategori}</h1>
                    <p className="mb-6 text-sm">{deskripsi[hasil.kategori]}</p>

                    <div className="flex flex-col items-center gap-3">
                        <a
                            href="https://www.instagram.com/upa_bk_unm/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full rounded-lg bg-yellow-400 px-6 py-3 font-semibold text-black shadow-md transition-all duration-200 hover:bg-yellow-500"
                        >
                            Follow Instagram UPA BK UNM
                        </a>

                        <button
                            onClick={ulangiTes}
                            className="w-full rounded-lg bg-white/80 px-6 py-3 font-semibold text-black shadow-md transition-all duration-200 hover:bg-white/60"
                        >
                            Ulangi Tes
                        </button>
                    </div>
                </div>
            </div>
        </IdentitasLayout>
    );
}
