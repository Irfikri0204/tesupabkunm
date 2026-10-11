import React from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import logo from '@/../img/logo-upalbkunm.png';
import {
    RiBrainLine,
    RiChat1Line,
    RiTeamLine,
    RiShieldStarLine,
    RiStarLine,
    RiMacbookLine,
    RiInstagramLine,
    RiEarthLine,
    RiCheckboxCircleFill,
    RiEmotionLine,
    RiHeartPulseLine,
    RiBookOpenLine,
    RiMindMap,
    RiTimeLine,
    RiClipboardLine,
    RiArrowRightLine,
    RiGlobalLine,
    RiSurveyLine
} from '@remixicon/react';

type TeamMember = {
    id: number;
    name: string;
    role: string;
    division?: string | null;
    faculty?: string | null;
    photo?: string | null;
    type: 'dosen' | 'konselor-sebaya';
};

type LinkedWebsite = {
    id: number;
    name: string;
    description: string | null;
    url: string;
    color: string;
    is_active: boolean;
};

type TestSetting = {
    id: number;
    slug: string;
    name: string;
    is_open: boolean;
};

// Built-in tests config: maps TestSetting slug to display info & route
const BUILTIN_TESTS: Record<string, { title: string; description: string; href: string; icon: React.ReactNode }> = {
    'gayabelajar': {
        title: 'Kenali Gaya Belajarmu',
        description: 'Temukan gaya belajar yang paling cocok untukmu: visual, auditori, atau kinestetik.',
        href: '/tes/gayabelajar',
        icon: <RiBookOpenLine className="h-8 w-8" />,
    },
    'panas': {
        title: 'Tes Pola Emosimu',
        description: 'Ukur keseimbangan emosi positif dan negatifmu saat ini menggunakan skala PANAS.',
        href: '/tes/panas',
        icon: <RiEmotionLine className="h-8 w-8" />,
    },
    'swls': {
        title: 'Dimensi Kepuasan Hidup',
        description: 'Evaluasi tingkat kepuasan hidupmu secara keseluruhan melalui skala SWLS.',
        href: '/tes/swls',
        icon: <RiHeartPulseLine className="h-8 w-8" />,
    },
    'srq20': {
        title: 'Kenali Kesehatan Mentalmu',
        description: 'Identifikasi gejala gangguan kesehatan mental dengan alat skrining SRQ-20.',
        href: '/tes/srq20',
        icon: <RiBrainLine className="h-8 w-8" />,
    },
    'kecerdasan-majemuk': {
        title: 'Tes Kecerdasan Majemuk',
        description: 'Kenali jenis kecerdasan dominanmu berdasarkan teori Multiple Intelligences.',
        href: '/tes/kecerdasan-majemuk',
        icon: <RiMindMap className="h-8 w-8" />,
    },
    'identifikasi-masalah': {
        title: 'Sistem Identifikasi Kondisi - Mahasiswa (SIK-M)',
        description: 'Identifikasi potensi kendala akademik, pribadi, sosial, dan risiko perkuliahan untuk pendampingan tepat sasaran.',
        href: '/tes/identifikasi-masalah/universitas-negeri-makassar',
        icon: <RiSurveyLine className="h-8 w-8" />,
    },
};

interface HomeProps {
    teamMembers: TeamMember[];
    siteSettings: Record<string, string>;
    linkedWebsites: LinkedWebsite[];
    testSettings?: TestSetting[];
    latestPosts?: any[];
}

export default function Home({ teamMembers, siteSettings, linkedWebsites, testSettings = [], latestPosts = [] }: HomeProps) {
    const [currentSlide, setCurrentSlide] = React.useState(0);

    React.useEffect(() => {
        if (!latestPosts || latestPosts.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % latestPosts.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [latestPosts]);
    const registrationUrl = siteSettings.registration_url || 'https://s.id/layanankonselinguptlbkunm';
    const instagramUrl = siteSettings.instagram_url || 'https://instagram.com/upa_bk_unm';
    const websiteUrl = siteSettings.website_url || 'https://uptlbk.unm.ac.id';

    return (
        <AppLayout>
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-primary px-8 py-16 text-white md:px-16 lg:py-24">
                {/* Gradients */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-indigo-900 to-purple-900"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>

                <div className="relative mx-auto grid max-w-7xl gap-16 lg:grid-cols-2 lg:items-center">
                    <div className="space-y-6">
                        {/* <span className="inline-block rounded-full bg-secondary px-4 py-1.5 text-sm font-bold text-slate-900 shadow-md">
                            Universitas Negeri Makassar
                        </span> */}
                        <h1 className="text-4xl font-black leading-tight md:text-5xl lg:text-6xl">
                            Unit Penunjang Akademik Bimbingan dan Konseling
                        </h1>
                        <p className="max-w-xl text-lg text-white/90">
                            Layanan bimbingan, konseling, dan tes psikologi terlengkap untuk mendukung kesehatan mental dan pengembangan diri mahasiswa UNM.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <Link
                                href="/tes/panas"
                                className="inline-flex items-center justify-center rounded-full bg-secondary px-8 py-3.5 font-bold text-slate-900 shadow-lg shadow-secondary/30 transition hover:bg-yellow-400 hover:-translate-y-1"
                            >
                                Mulai Tes Sekarang
                            </Link>
                            <Link
                                href="/profil-tim"
                                className="inline-flex items-center justify-center rounded-full border-2 border-white/30 bg-transparent px-8 py-3.5 font-bold text-white transition hover:bg-white/10 hover:border-white/50 hover:-translate-y-1"
                            >
                                Profil Tim
                            </Link>
                        </div>
                    </div>

                    <div className="relative flex items-center justify-center lg:justify-end">
                        <div className="relative flex aspect-square w-full max-w-sm items-center justify-center rounded-full bg-purple-900/30 backdrop-blur-sm border border-white/10 shadow-2xl">
                            {/* Concentric rings */}
                            <div className="absolute inset-4 rounded-full border border-white/20"></div>
                            <div className="absolute inset-12 rounded-full border border-white/10"></div>
                            
                            <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
                                <img src="/logoupabk.png" alt="Logo UPA BK UNM" className="h-32 w-32 object-contain brightness-0 invert opacity-90" />
                                <div className="text-center leading-tight">
                                    <h3 className="text-3xl font-bold text-white">Warnai Hidupmu</h3>
                                    <h3 className="text-3xl font-bold text-white/90">Raih Suksesmu</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Berita Terbaru (Carousel) */}
            {latestPosts && latestPosts.length > 0 && (
                <section className="bg-slate-50 px-8 py-20 md:px-16">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-12 text-center">
                            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Berita Terbaru</h2>
                            {/* <p className="mt-4 text-slate-500 max-w-2xl mx-auto">Informasi dan update terkini seputar layanan dan kegiatan UPA BK UNM.</p> */}
                        </div>
                        
                        <div className="relative overflow-hidden w-full max-w-6xl mx-auto rounded-3xl pb-4">
                            <div 
                                className="flex transition-transform duration-700 ease-in-out"
                                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                            >
                                {latestPosts.map((post: any) => (
                                    <div key={post.id} className="w-full flex-none">
                                        <Link href={`/berita/${post.slug}`} className="block group bg-slate-100 overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 rounded-[2rem]">
                                            <div className="flex flex-col md:flex-row min-h-[380px]">
                                                {/* Left Content */}
                                                <div className="w-full md:w-5/12 p-8 sm:p-10 lg:p-14 flex flex-col justify-center relative z-10 bg-slate-100 order-2 md:order-1">
                                                    <h3 className="font-black text-slate-800 text-2xl sm:text-3xl leading-tight mb-4 group-hover:text-primary transition-colors line-clamp-3">
                                                        {post.title}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-slate-500 text-sm font-bold mb-6">
                                                        <RiTimeLine size={16} />
                                                        {new Date(post.created_at).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </div>
                                                    

                                                    <div className="flex-1 mb-8">
                                                        <p className="text-slate-600 leading-relaxed line-clamp-4">
                                                            Mari simak informasi selengkapnya mengenai topik ini. Temukan wawasan menarik dan bermanfaat yang telah disiapkan khusus untuk Anda pada artikel ini.
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <span className="inline-flex items-center justify-center rounded-full bg-primary text-white font-bold px-8 py-3.5 hover:bg-purple-900 transition-colors shadow-lg shadow-primary/30">
                                                            Baca Selengkapnya
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Right Image */}
                                                <div className="w-full md:w-7/12 h-64 md:h-auto relative order-1 md:order-2 overflow-hidden rounded-r-[2rem] rounded-l-none">
                                                    <div className="absolute inset-0 bg-gradient-to-r from-slate-100 via-slate-100/20 to-transparent z-10 w-24 hidden md:block" />
                                                    
                                                    {post.cover_url ? (
                                                        <img src={post.cover_url} alt={post.title} className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                                    ) : (
                                                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-900">
                                                            <span className="text-7xl">📰</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Navigation Dots */}
                            {latestPosts.length > 1 && (
                                <div className="absolute top-4 right-4 md:top-8 md:right-8 flex gap-2 z-20">
                                    {latestPosts.map((_, idx) => (
                                        <button 
                                            key={idx}
                                            onClick={(e) => { e.preventDefault(); setCurrentSlide(idx); }}
                                            className="w-10 h-10 bg-white flex items-center justify-center shadow-md transition-transform hover:scale-110 rounded-xl"
                                            aria-label={`Go to slide ${idx + 1}`}
                                        >
                                            <div className={`w-4 h-4 transition-colors rounded-full ${currentSlide === idx ? 'bg-primary' : 'bg-slate-200'}`}></div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        <div className="text-center mt-8">
                            <Link href="/berita" className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-primary text-primary px-8 py-3.5 font-bold transition hover:bg-primary hover:text-white shadow-md shadow-primary/10">
                                Lihat Semua Berita
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Apa itu UPA BK UNM */}
            <section className="bg-slate-50 px-8 py-24 md:px-16">
                <div className="mx-auto max-w-7xl">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="relative order-2 lg:order-1 flex justify-center">
                            <div className="absolute inset-0 bg-primary/5 rounded-[3rem] transform -rotate-6 scale-105"></div>
                            <div className="absolute inset-0 bg-secondary/10 rounded-[3rem] transform rotate-3 scale-105"></div>
                            <img src={siteSettings.apa_itu_image ? '/storage/' + siteSettings.apa_itu_image : '/logoupabk.png'} alt="Tentang UPA BK UNM" className="relative z-10 w-full max-w-sm mx-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="space-y-6 order-1 lg:order-2">
                            {/* <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary">
                                Tentang Kami
                            </span> */}
                            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
                                {siteSettings.apa_itu_title || 'Apa itu UPA BK UNM?'}
                            </h2>
                            {siteSettings.apa_itu_desc ? (
                                <div 
                                    className="text-slate-600 leading-relaxed text-lg prose prose-slate max-w-none" 
                                    dangerouslySetInnerHTML={{ __html: siteSettings.apa_itu_desc }} 
                                />
                            ) : (
                                <>
                                    <p className="text-slate-600 leading-relaxed text-lg">
                                        Unit Penunjang Akademik Bimbingan dan Konseling (UPA BK) Universitas Negeri Makassar hadir sebagai wujud nyata kepedulian universitas terhadap kesejahteraan psikologis dan pengembangan potensi setiap mahasiswa.
                                    </p>
                                    <p className="text-slate-600 leading-relaxed">
                                        Kami menyediakan ruang yang aman, nyaman, dan rahasia bagi Anda untuk berbagi, mengeksplorasi diri, dan menemukan solusi atas berbagai tantangan akademik maupun pribadi. Bersama tenaga profesional dan konselor sebaya yang terlatih, kami siap mendampingi perjalanan Anda meraih kesuksesan di kampus.
                                    </p>
                                </>
                            )}
                            <div className="pt-4">
                                <Link href="/profil-tim" className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-primary text-primary px-8 py-3.5 font-bold transition hover:bg-primary hover:text-white shadow-md shadow-primary/10">
                                    Kenali Tim Kami <RiArrowRightLine className="h-5 w-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Layanan UPA BK UNM */}
            <section className="bg-white px-8 py-24 md:px-16">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-16 text-center">
                        <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Layanan UPA BK UNM</h2>
                        {/* <p className="mt-4 text-slate-500 max-w-xl mx-auto">Pilih layanan yang paling sesuai dengan kebutuhan dan kondisi Anda saat ini.</p> */}
                    </div>
                    <div className="flex flex-wrap gap-4 md:gap-6 justify-center">

                        {/* Konseling */}
                        <Link href="/konseling" className="group relative overflow-hidden rounded-3xl bg-primary border border-primary/20 p-6 flex flex-col items-center justify-center hover:bg-purple-900 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 flex-1 basis-36 min-w-[150px] max-w-[220px] min-h-[160px]">
                            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                                <RiChat1Line className="h-7 w-7" />
                            </div>
                            <h3 className="font-bold text-white text-lg text-center leading-snug">Konseling</h3>
                        </Link>

                        {/* Pengembangan Diri */}
                        <Link href="/konseling" className="group relative overflow-hidden rounded-3xl bg-primary border border-primary/20 p-6 flex flex-col items-center justify-center hover:bg-purple-900 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 flex-1 basis-36 min-w-[150px] max-w-[220px] min-h-[160px]">
                            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                                <RiStarLine className="h-7 w-7" />
                            </div>
                            <h3 className="font-bold text-white text-lg text-center leading-snug">Pengembangan Diri</h3>
                        </Link>

                        {/* Asesmen */}
                        <Link href="/konseling" className="group relative overflow-hidden rounded-3xl bg-primary border border-primary/20 p-6 flex flex-col items-center justify-center hover:bg-purple-900 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 flex-1 basis-36 min-w-[150px] max-w-[220px] min-h-[160px]">
                            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                                <RiClipboardLine className="h-7 w-7" />
                            </div>
                            <h3 className="font-bold text-white text-lg text-center leading-snug">Asesmen</h3>
                        </Link>

                        {/* TIK */}
                        {/* <Link href="/konseling" className="group relative overflow-hidden rounded-3xl bg-primary border border-primary/20 p-6 flex flex-col items-center justify-center hover:bg-purple-900 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 flex-1 basis-36 min-w-[150px] max-w-[220px] min-h-[160px]">
                            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                                <RiMacbookLine className="h-7 w-7" />
                            </div>
                            <h3 className="font-bold text-white text-lg text-center leading-snug">TIK</h3>
                        </Link> */}

                        {/* Konselor Sebaya */}
                        <Link href="/konseling" className="group relative overflow-hidden rounded-3xl bg-primary border border-primary/20 p-6 flex flex-col items-center justify-center hover:bg-purple-900 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 flex-1 basis-36 min-w-[150px] max-w-[220px] min-h-[160px]">
                            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                                <RiTeamLine className="h-7 w-7" />
                            </div>
                            <h3 className="font-bold text-white text-lg text-center leading-snug">Konselor Sebaya</h3>
                        </Link>

                    </div>
                </div>
            </section>

            {/* Panduan Akses Layanan */}
            <section className="bg-slate-50 px-8 py-24 md:px-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/[0.02]"></div>
                <div className="mx-auto max-w-7xl text-center relative z-10">
                    <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary mb-4">
                        Langkah Mudah
                    </span>
                    <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Panduan Akses Layanan</h2>
                    <p className="mt-4 text-slate-600 leading-relaxed max-w-2xl mx-auto">
                        Ikuti langkah-langkah sederhana ini untuk mendaftar dan mendapatkan jadwal konseling Anda.
                    </p>
                    
                    <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 text-left relative">
                        {/* Connecting Line for XL screens */}
                        <div className="hidden xl:block absolute top-12 left-[10%] right-[10%] h-1 bg-slate-200/60 rounded-full"></div>

                        {/* Step 1 */}
                        <div className="relative group bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:-translate-y-2 hover:border-primary/20 hover:shadow-primary/10 transition-all duration-300">
                            <div className="relative z-10 w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-slate-50 border-2 border-slate-100 flex items-center justify-center text-xl md:text-2xl font-black text-slate-400 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300 mb-5 md:mb-6 shadow-sm mx-auto xl:mx-0">1</div>
                            <h3 className="font-bold text-slate-800 text-lg md:text-xl mb-3 group-hover:text-primary transition-colors text-center xl:text-left">Pendaftaran</h3>
                            <p className="text-slate-500 text-xs md:text-sm leading-relaxed text-center xl:text-left">Mahasiswa atau masyarakat mendaftar daring/langsung. Tautan pendaftaran tersedia di sosmed resmi.</p>
                        </div>

                        {/* Step 2 */}
                        <div className="relative group bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:-translate-y-2 hover:border-primary/20 hover:shadow-primary/10 transition-all duration-300 xl:mt-8">
                            <div className="relative z-10 w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-slate-50 border-2 border-slate-100 flex items-center justify-center text-xl md:text-2xl font-black text-slate-400 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300 mb-5 md:mb-6 shadow-sm mx-auto xl:mx-0">2</div>
                            <h3 className="font-bold text-slate-800 text-lg md:text-xl mb-3 group-hover:text-primary transition-colors text-center xl:text-left">Pencatatan</h3>
                            <p className="text-slate-500 text-xs md:text-sm leading-relaxed text-center xl:text-left">Admin mencatat pendaftaran dan menginformasikan kepada konselor sesuai jadwal.</p>
                        </div>

                        {/* Step 3 */}
                        <div className="relative group bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:-translate-y-2 hover:border-primary/20 hover:shadow-primary/10 transition-all duration-300">
                            <div className="relative z-10 w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-slate-50 border-2 border-slate-100 flex items-center justify-center text-xl md:text-2xl font-black text-slate-400 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300 mb-5 md:mb-6 shadow-sm mx-auto xl:mx-0">3</div>
                            <h3 className="font-bold text-slate-800 text-lg md:text-xl mb-3 group-hover:text-primary transition-colors text-center xl:text-left">Pengaturan Jadwal</h3>
                            <p className="text-slate-500 text-xs md:text-sm leading-relaxed text-center xl:text-left">Admin mengatur kesepakatan jadwal bersama calon konseli dan menyampaikan konfirmasi.</p>
                        </div>

                        {/* Step 4 */}
                        <div className="relative group bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:-translate-y-2 hover:border-primary/20 hover:shadow-primary/10 transition-all duration-300 xl:mt-8">
                            <div className="relative z-10 w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-slate-50 border-2 border-slate-100 flex items-center justify-center text-xl md:text-2xl font-black text-slate-400 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300 mb-5 md:mb-6 shadow-sm mx-auto xl:mx-0">4</div>
                            <h3 className="font-bold text-slate-800 text-lg md:text-xl mb-3 group-hover:text-primary transition-colors text-center xl:text-left">Pelaksanaan</h3>
                            <p className="text-slate-500 text-xs md:text-sm leading-relaxed text-center xl:text-left">Layanan dilaksanakan oleh konselor/psikolog sesuai jadwal, berulang hingga tertangani.</p>
                        </div>

                        {/* Step 5 */}
                        <div className="relative group bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:-translate-y-2 hover:border-primary/20 hover:shadow-primary/10 transition-all duration-300">
                            <div className="relative z-10 w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-slate-50 border-2 border-slate-100 flex items-center justify-center text-xl md:text-2xl font-black text-slate-400 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300 mb-5 md:mb-6 shadow-sm mx-auto xl:mx-0">5</div>
                            <h3 className="font-bold text-slate-800 text-lg md:text-xl mb-3 group-hover:text-primary transition-colors text-center xl:text-left">Evaluasi</h3>
                            <p className="text-slate-500 text-xs md:text-sm leading-relaxed text-center xl:text-left">Tindak lanjut dilakukan terhadap hasil layanan, termasuk rujukan lanjutan apabila diperlukan.</p>
                        </div>
                    </div>
                    
                    <div className="mt-16">
                        <a href={registrationUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-10 py-4 font-bold text-white transition hover:bg-purple-900 shadow-xl shadow-primary/20 hover:-translate-y-1">
                            Mulai Pendaftaran
                            <RiArrowRightLine className="h-5 w-5" />
                        </a>
                    </div>
                </div>
            </section>

            {/* Asesmen Yang Tersedia */}
            <section className="bg-slate-50 px-8 py-24 md:px-16" id="tes">
                <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
                    <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary">
                        Layanan Psikologi
                    </span>
                    <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Asesmen Yang Tersedia</h2>
                    <p className="mt-4 max-w-2xl text-slate-500">
                        Pilih asesmen yang sesuai dengan kebutuhan psikologismu kamu. Semua asesmen dirancang oleh para ahli konseling UNM.
                    </p>
                </div>
                <div className="mx-auto mt-16 grid max-w-7xl gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {/* Built-in Tests */}
                    {testSettings
                        .filter(ts => BUILTIN_TESTS[ts.slug] && ts.is_open)
                        .map((ts) => {
                            const config = BUILTIN_TESTS[ts.slug];
                            return (
                                <article key={ts.slug} className="group flex flex-col overflow-hidden rounded-[2rem] bg-white shadow-lg shadow-slate-200/50 border border-slate-100 transition-all hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10">
                                    <div className="flex flex-col p-8 h-full">
                                        <div className="mb-6">
                                            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/5 text-primary transition-transform group-hover:scale-110">
                                                {config.icon}
                                            </div>
                                        </div>
                                        <h3 className="mb-3 text-xl font-bold text-slate-800">{ts.name}</h3>
                                        <p className="flex-1 text-sm leading-relaxed text-slate-500 line-clamp-3">
                                            {config.description}
                                        </p>
                                    </div>
                                    <div className="mt-auto flex items-center justify-end border-t border-slate-100 bg-slate-50/50 px-8 py-5">
                                        <Link href={config.href} className="flex items-center gap-1.5 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white transition hover:bg-purple-900 shadow-md shadow-primary/20 hover:-translate-y-0.5 whitespace-nowrap">
                                            Mulai Tes <RiArrowRightLine className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </article>
                            );
                        })}

                    {/* Empty State */}
                    {testSettings.filter(ts => BUILTIN_TESTS[ts.slug] && ts.is_open).length === 0 && (
                        <div className="col-span-full py-10 text-center text-slate-500 font-medium italic">
                            Belum ada tes yang tersedia saat ini.
                        </div>
                    )}
                </div>
            </section>

            {/* Statistics (Hidden for now)
            <section className="bg-white py-12 md:py-16">
                <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-8 px-8 md:justify-between md:px-16">
                    <div className="text-center">
                        <p className="text-4xl font-bold text-primary md:text-5xl">2.400+</p>
                        <p className="mt-2 text-sm text-slate-500">Mahasiswa Terlayani</p>
                    </div>
                    <div className="text-center">
                        <p className="text-4xl font-bold text-primary md:text-5xl">12</p>
                        <p className="mt-2 text-sm text-slate-500">Konselor Profesional</p>
                    </div>
                    <div className="text-center">
                        <p className="text-4xl font-bold text-primary md:text-5xl">5</p>
                        <p className="mt-2 text-sm text-slate-500">Jenis Tes Psikologi</p>
                    </div>
                    <div className="text-center">
                        <p className="text-4xl font-bold text-primary md:text-5xl">98%</p>
                        <p className="mt-2 text-sm text-slate-500">Tingkat Kepuasan</p>
                    </div>
                </div>
            </section>
            */}

            {/* Platform Terhubung */}
            {linkedWebsites.length > 0 && (
                <section className="bg-white px-8 py-24 md:px-16">
                    <div className="mx-auto max-w-6xl">
                        <div className="text-center mb-16">
                            <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary mb-4">
                                Ekosistem Digital UPA BK UNM
                            </span>
                            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Platform Lainnya</h2>
                            <p className="mx-auto mt-4 max-w-2xl text-slate-500">
                                UPA BK UNM menghadirkan berbagai platform digital yang saling terhubung untuk mendukung pengembangan diri mahasiswa secara menyeluruh.
                            </p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {linkedWebsites.map((site) => (
                                <a
                                    key={site.id}
                                    href={site.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group flex flex-col rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 overflow-hidden hover:-translate-y-2 hover:shadow-xl transition-all duration-300"
                                >
                                    {/* Top color bar */}
                                    <div className="h-1.5 bg-primary" />

                                    <div className="flex flex-col flex-1 p-7">
                                        {/* Icon + name */}
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md flex-shrink-0 transition-transform group-hover:scale-110 duration-300 bg-primary">
                                                <RiGlobalLine className="w-6 h-6 text-white" />
                                            </div>
                                            <h3 className="font-bold text-slate-800 text-base leading-tight">{site.name}</h3>
                                        </div>

                                        {/* Description */}
                                        {site.description && (
                                            <p className="text-sm text-slate-500 leading-relaxed flex-1 mb-5">
                                                {site.description}
                                            </p>
                                        )}

                                        {/* CTA */}
                                        <div className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors">
                                            Kunjungi Platform
                                            <RiArrowRightLine className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>
            )}


        </AppLayout>
    );
}
