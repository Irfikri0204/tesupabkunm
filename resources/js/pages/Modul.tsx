import AppLayout from '@/layouts/AppLayout';
import { RiFileDownloadLine, RiFileTextLine, RiBookOpenLine } from '@remixicon/react';

export default function Modul() {
    const modules = [
        {
            id: 1,
            title: 'Panduan Bimbingan Akademik Mahasiswa Baru',
            description: 'Modul ini berisi panduan lengkap untuk mahasiswa baru mengenai sistem akademik, cara KRS, dan bimbingan dengan PA.',
            size: '2.4 MB',
            format: 'PDF',
            category: 'Akademik'
        },
        {
            id: 2,
            title: 'Modul Pelatihan Konselor Sebaya 2024',
            description: 'Materi dasar dan lanjutan bagi mahasiswa yang tergabung dalam program Konselor Sebaya UNM tahun 2024.',
            size: '5.1 MB',
            format: 'PDF',
            category: 'Pelatihan'
        },
        {
            id: 3,
            title: 'Buku Saku Kesehatan Mental Kampus',
            description: 'Informasi praktis tentang cara menjaga kesehatan mental dan tanda-tanda kapan harus mencari bantuan profesional.',
            size: '1.8 MB',
            format: 'PDF',
            category: 'Kesehatan Mental'
        },
        {
            id: 4,
            title: 'Pedoman Layanan Disabilitas UNM',
            description: 'Buku panduan mengenai fasilitas dan hak-hak mahasiswa penyandang disabilitas di lingkungan Universitas Negeri Makassar.',
            size: '3.2 MB',
            format: 'PDF',
            category: 'Layanan'
        },
    ];

    return (
        <AppLayout>
            <section className="bg-white px-8 py-16 text-slate-900 md:px-16">
                <div className="mx-auto max-w-6xl text-center">
                    <h1 className="text-4xl font-bold text-primary md:text-5xl">Modul & Panduan</h1>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500">
                        Unduh berbagai dokumen, panduan, dan materi edukasi yang disediakan oleh UPA BK UNM untuk mendukung perkuliahan Anda.
                    </p>
                </div>

                <div className="mx-auto mt-16 grid max-w-6xl gap-6 md:grid-cols-2">
                    {modules.map((item) => (
                        <article key={item.id} className="flex items-start gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-primary/30 hover:shadow-md">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-purple-50 text-primary">
                                <RiBookOpenLine className="h-8 w-8" />
                            </div>
                            <div className="flex-1">
                                <span className="mb-2 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                    {item.category}
                                </span>
                                <h3 className="mb-2 text-xl font-bold text-slate-800">{item.title}</h3>
                                <p className="mb-4 text-sm leading-relaxed text-slate-500">
                                    {item.description}
                                </p>
                                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
                                        <span className="flex items-center gap-1"><RiFileTextLine className="h-4 w-4" /> {item.format}</span>
                                        <span>{item.size}</span>
                                    </div>
                                    <button className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary transition hover:bg-primary hover:text-white">
                                        Unduh <RiFileDownloadLine className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </AppLayout>
    );
}
