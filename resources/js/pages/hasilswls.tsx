import IdentitasLayout from '@/layouts/IdentitasLayout';
import { useEffect, useState } from 'react';

export default function HasilSwls() {
    const [hasil, setHasil] = useState<{ kategori?: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const data = localStorage.getItem('hasilSwls');
            if (data) {
                setHasil(JSON.parse(data));
            } else {
                alert('Hasil tes tidak ditemukan. Silakan isi tes terlebih dahulu.');
                window.location.href = '/tes/swls';
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
        'Sangat Puas': 'Anda merasa sangat puas dengan kehidupan Anda, merasa terpenuhi dan bahagia di sebagian besar aspek kehidupan Anda',
        Puas: 'Secara umum, Anda merasa puas dengan hidup Anda, meskipun ada beberapa area yang masih ingin Anda tingkatkan atau perbaiki',
        Netral: 'Anda merasa kehidupan Anda cukup baik, namun ada beberapa bagian yang mungkin membuat Anda merasa biasa saja atau ragu-ragu tentangnya',
        'Tidak Puas':
            'Anda merasa kurang puas dengan beberapa aspek hidup Anda, dan mungkin merasa ada beberapa hal yang perlu diperbaiki untuk merasa lebih puas',
        'Sangat Tidak Puas': 'Anda merasa sangat tidak puas dengan hidup Anda dan mungkin merasa kecewa atau tidak bahagia dengan kondisi saat ini',
    };

    const ulangiTes = () => {
        if (confirm('Yakin ingin mengulangi tes?')) {
            localStorage.removeItem('hasilSwls');
            window.location.href = '/tes/swls';
        }
    };

    return (
        <IdentitasLayout>
            <div className="flex min-h-screen items-center justify-center">
                <div className="w-[90%] max-w-md rounded-2xl bg-primary p-8 text-center text-white shadow-lg">
                    <h2 className="mb-2 text-lg font-medium">Interpretasi Anda</h2>
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
                        {(hasil.kategori === 'Tidak Puas' || hasil.kategori === 'Sangat Tidak Puas') && (
                            <a
                                target="_blank"
                                rel="noopener noreferrer"
                                href="https://s.id/layanankonselinguptlbkunm?fbclid=PAZXh0bgNhZW0CMTEAAafES8cR_g6N6cTCIbYYoUHzJIgLKW6nyON44Tne28468srLcvNT8G7qgsojVw_aem_-Cr23sz4obp5yDYr-dqgaA"
                                className="inline-block w-full rounded-lg bg-purple-700 px-5 py-3 font-semibold text-white shadow-md hover:bg-purple-800"
                            >
                                Ajukan Konseling Sekarang
                            </a>
                        )}

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
