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
            <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-50 p-4 py-12 sm:p-8">
                {/* Background Decorations */}
                <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-purple-200/50 blur-3xl"></div>
                <div className="absolute -bottom-32 -right-32 h-[30rem] w-[30rem] rounded-full bg-yellow-200/30 blur-3xl"></div>

                <div className="relative z-10 w-full max-w-lg rounded-[2rem] bg-white p-8 text-center shadow-2xl shadow-slate-200/50 sm:p-12">
                    <h2 className="mb-2 text-sm font-bold tracking-widest text-slate-400 uppercase mt-4">Interpretasi Hasil Tes</h2>
                    <h1 className="mb-6 text-4xl font-black capitalize text-slate-800">{hasil.kategori}</h1>
                    
                    <div className="mb-8 rounded-2xl bg-purple-50 p-6 text-slate-600">
                        <p className="leading-relaxed">{deskripsi[hasil.kategori]}</p>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        {(hasil.kategori === 'Tidak Puas' || hasil.kategori === 'Sangat Tidak Puas') && (
                            <a
                                target="_blank"
                                rel="noopener noreferrer"
                                href="https://s.id/layanankonselinguptlbkunm"
                                className="inline-block w-full rounded-full bg-primary px-6 py-4 text-sm font-bold text-white shadow-lg shadow-primary/30 transition-all duration-200 hover:-translate-y-1 hover:bg-purple-800"
                            >
                                Ajukan Konseling Sekarang
                            </a>
                        )}
                        
                        <a
                            href="https://www.instagram.com/upa_bk_unm/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block w-full rounded-full bg-secondary px-6 py-4 text-sm font-bold text-slate-900 shadow-lg shadow-yellow-400/30 transition-all duration-200 hover:-translate-y-1 hover:bg-yellow-400"
                        >
                            Follow Instagram UPA BK UNM
                        </a>

                        <button
                            onClick={ulangiTes}
                            className="mt-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors underline underline-offset-4"
                        >
                            Ulangi Tes
                        </button>
                    </div>
                </div>
            </div>
        </IdentitasLayout>
    );
}
