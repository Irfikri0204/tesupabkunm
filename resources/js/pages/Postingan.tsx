import AppLayout from '@/layouts/AppLayout';
import { RiCalendarLine, RiUserLine, RiArrowRightLine } from '@remixicon/react';

export default function Postingan() {
    const posts = [
        {
            id: 1,
            title: 'Pentingnya Kesehatan Mental di Kalangan Mahasiswa',
            excerpt: 'Menjaga kesehatan mental sama pentingnya dengan menjaga kesehatan fisik. Kenali tanda-tanda kelelahan mental dan cara mengatasinya agar tetap produktif selama kuliah.',
            date: '12 Okt 2024',
            author: 'Tim UPA BK',
            category: 'Kesehatan Mental',
            image: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        },
        {
            id: 2,
            title: 'Tips Lulus Tepat Waktu dengan Manajemen Waktu yang Baik',
            excerpt: 'Banyak mahasiswa merasa kewalahan dengan tugas dan organisasi. Berikut adalah beberapa tips manajemen waktu yang bisa membantu Anda menyeimbangkan keduanya.',
            date: '05 Okt 2024',
            author: 'Konselor Sebaya',
            category: 'Akademik',
            image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        },
        {
            id: 3,
            title: 'Mengenal Layanan Disabilitas di Kampus UNM',
            excerpt: 'Kampus yang inklusif adalah hak semua mahasiswa. Pelajari layanan dan fasilitas apa saja yang disediakan UPA BK untuk mendukung teman-teman penyandang disabilitas.',
            date: '28 Sep 2024',
            author: 'Admin',
            category: 'Informasi',
            image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        },
        {
            id: 4,
            title: 'Bagaimana Mengenali Potensi Karir Sejak Dini?',
            excerpt: 'Jangan tunggu sampai lulus untuk merencanakan karir. Kenali minat, bakat, dan potensi Anda melalui bimbingan karir bersama profesional.',
            date: '15 Sep 2024',
            author: 'Tim UPA BK',
            category: 'Karir',
            image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        },
    ];

    return (
        <AppLayout>
            <section className="bg-slate-50 px-8 py-16 text-slate-900 md:px-16">
                <div className="mx-auto max-w-6xl text-center">
                    <h1 className="text-4xl font-bold text-primary md:text-5xl">Berita Terbaru</h1>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500">
                        Baca artikel, tips, dan informasi terbaru seputar bimbingan, konseling, akademik, dan kesehatan mental.
                    </p>
                </div>
                
                <div className="mx-auto mt-16 grid max-w-6xl gap-8 md:grid-cols-2">
                    {posts.map((post) => (
                        <article key={post.id} className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-lg shadow-slate-200/50 transition hover:shadow-xl">
                            <div className="relative h-64 w-full overflow-hidden">
                                <img 
                                    src={post.image} 
                                    alt={post.title} 
                                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105" 
                                />
                                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-primary backdrop-blur-sm">
                                    {post.category}
                                </span>
                            </div>
                            <div className="flex flex-1 flex-col p-8">
                                <div className="mb-4 flex items-center gap-4 text-xs font-medium text-slate-500">
                                    <div className="flex items-center gap-1.5">
                                        <RiCalendarLine className="h-4 w-4" />
                                        {post.date}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <RiUserLine className="h-4 w-4" />
                                        {post.author}
                                    </div>
                                </div>
                                <h2 className="mb-3 text-2xl font-bold text-slate-800 transition group-hover:text-primary">
                                    {post.title}
                                </h2>
                                <p className="mb-6 flex-1 leading-relaxed text-slate-600 line-clamp-3">
                                    {post.excerpt}
                                </p>
                                <div>
                                    <button className="inline-flex items-center gap-2 font-bold text-primary transition hover:text-purple-800">
                                        Baca Selengkapnya <RiArrowRightLine className="h-5 w-5" />
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
