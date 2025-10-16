import IdentitasLayout from '@/layouts/IdentitasLayout';
import { useEffect, useState } from 'react';

type HasilSrq20 = {
    kategori: string;
    totalSkor: number;
};

export default function HasilSwls() {
    const [hasil, setHasil] = useState<HasilSrq20 | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const data = localStorage.getItem('hasilSrq20');
            if (data) {
                setHasil(JSON.parse(data));
            } else {
                alert('Hasil tes tidak ditemukan. Silakan isi tes terlebih dahulu.');
                window.location.href = '/tes/srq20';
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
        Normal: 'Kemungkinan kecil adanya gangguan Kesehatan mental. Namun, hal ini tidak menutup kemungkinan adanya masalah kesehatan mental lain yang tidak terdeteksi oleh SRQ-20.',
        'Perlu Perhatian':
            'Ada indikasi gejala psikologis yang perlu dievaluasi lebih lanjut. Dianjurkan untuk melakukan pemeriksaan lebih mendalam dengan tenaga kesehatan profesional seperti konselor, psikolog, atau psikiater.',
        'Kemungkinan Gangguan Mental':
            'Menunjukkan kemungkinan adanya gangguan kesehatan mental yang signifikan. Perlu segera dirujuk ke tenaga kesehatan mental untuk penilaian dan intervensi lebih lanjut.',
    };

    const ulangiTes = () => {
        if (confirm('Yakin ingin mengulangi tes?')) {
            localStorage.removeItem('hasilSrq20');
            window.location.href = '/tes/srq20';
        }
    };

    return (
        <IdentitasLayout>
            <div className="flex min-h-screen items-center justify-center">
                <div className="w-[90%] max-w-md rounded-2xl bg-primary p-8 text-center text-white shadow-lg">
                    <h2 className="mb-2 text-lg font-medium">Skor Anda</h2>
                    <h1 className="mb-4 text-3xl font-bold capitalize">{hasil.totalSkor}</h1>
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

                        {(hasil.kategori === 'Perlu Perhatian' || hasil.kategori === 'Kemungkinan Gangguan Mental') && (
                            <a
                                target="_blank"
                                rel="noopener noreferrer"
                                href="https://s.id/layanankonselinguptlbkunm"
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
