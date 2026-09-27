import IdentitasLayout from '@/layouts/IdentitasLayout';
import { useEffect, useState } from 'react';

export default function HasilPanas() {
    const [hasil, setHasil] = useState<{ kategori?: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const data = localStorage.getItem('hasilPanas');
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
        Seimbang:
            'Hasil ini menunjukkan bahwa emosi positif dan negatif Anda seimbang, sehingga Anda cenderung merasa stabil dalam menghadapi situasi sehari-hari, dengan keseimbangan antara perasaan bahagia dan perasaan cemas',
        Positif:
            'Anda cenderung lebih sering merasakan emosi positif, yang membantu Anda merasa lebih energik dan optimis, serta lebih mampu mengatasi stres dengan lebih baik',
        Negatif:
            'Anda cenderung lebih sering merasa terpengaruh oleh emosi negatif, yang dapat membuat Anda lebih rentan terhadap stres atau kesulitan dalam mengelola tekanan dalam kehidupan sehari-hari',
    };

    const ulangiTes = () => {
        if (confirm('Yakin ingin mengulangi tes?')) {
            localStorage.removeItem('hasilPanas');
            window.location.href = '/tes/panas';
        }
    };

    return (
        <IdentitasLayout>
            <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-50 p-4 py-12 sm:p-8">
                {/* Background Decorations */}
                <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-purple-200/50 blur-3xl"></div>
                <div className="absolute -bottom-32 -right-32 h-[30rem] w-[30rem] rounded-full bg-yellow-200/30 blur-3xl"></div>

                <div className="relative z-10 w-full max-w-lg rounded-[2rem] bg-white p-8 text-center shadow-2xl shadow-slate-200/50 sm:p-12">
                    
                    <h2 className="mb-2 text-sm font-bold tracking-widest text-slate-400 uppercase mt-4">Kecenderungan Emosi Hasil Tes</h2>
                    <h1 className="mb-6 text-4xl font-black capitalize text-slate-800">{hasil.kategori}</h1>
                    
                    <div className="mb-8 rounded-2xl bg-purple-50 p-6 text-slate-600">
                        <p className="leading-relaxed">{deskripsi[hasil.kategori]}</p>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        {hasil.kategori === 'Negatif' && (
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
