import logo from '@/../img/logo-upalbkunm.png';
import { Link, usePage } from '@inertiajs/react';
import { RiArrowDownSLine, RiCloseLine, RiMenuLine } from '@remixicon/react';
import { useEffect, useRef, useState } from 'react';
import Login from './Login';

export default function Header() {
    const { global_test_settings } = usePage().props as any;
    
    // Config untuk built-in tes
    const BUILTIN_TESTS: Record<string, string> = {
        'gayabelajar': '/tes/gayabelajar',
        'panas': '/tes/panas',
        'swls': '/tes/swls',
        'srq20': '/tes/srq20',
        'kecerdasan-majemuk': '/tes/kecerdasan-majemuk',
        'identifikasi-masalah': '/tes/identifikasi-masalah/universitas-negeri-makassar',
    };

    // Menggabungkan tes built-in
    const allTests = [];
    
    if (global_test_settings) {
        global_test_settings.forEach((ts: any) => {
            if (BUILTIN_TESTS[ts.slug]) {
                allTests.push({
                    title: ts.name,
                    url: BUILTIN_TESTS[ts.slug]
                });
            }
        });
    }

    const [isOpen, setIsOpen] = useState(false); // hamburger menu
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // dropdown desktop
    const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false); // dropdown mobile
    const [isTentangDropdownOpen, setIsTentangDropdownOpen] = useState(false);
    const [isMobileTentangDropdownOpen, setIsMobileTentangDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const tentangDropdownRef = useRef<HTMLDivElement>(null);

    // Menutup dropdown saat klik di luar area
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
            if (tentangDropdownRef.current && !tentangDropdownRef.current.contains(event.target as Node)) {
                setIsTentangDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="sticky top-0 z-50 bg-primary text-white shadow">
            <div className="flex items-center justify-between p-4">
                {/* Logo dan Judul */}
                <div className="flex items-center gap-x-2">
                    <img src={logo} alt="logo upa lbk unm" className="h-10 w-10" />
                    <Link href="/" className="text-xl font-bold">
                        UPA BK UNM
                    </Link>
                </div>

                {/* Tombol Hamburger (mobile) */}
                <button className="text-2xl md:hidden" onClick={() => setIsOpen(!isOpen)}>
                    <RiMenuLine className={`${isOpen ? 'hidden' : 'block'}`} />
                    <RiCloseLine className={`${isOpen ? 'block' : 'hidden'}`} />
                </button>

                {/* Navigasi Desktop */}
                <nav className="hidden items-center space-x-6 md:flex">
                    <Link href="/" className="font-semibold hover:text-secondary transition-colors">
                        Home
                    </Link>
                    <Link href="/konseling" className="font-semibold hover:text-secondary transition-colors">
                        Konseling
                    </Link>
                    <Link href="/berita" className="font-semibold hover:text-secondary transition-colors">
                        Berita
                    </Link>
                    <Link href="/modul" className="font-semibold hover:text-secondary transition-colors">
                        Modul
                    </Link>
                    <div ref={tentangDropdownRef} className="relative">
                        <button
                            onClick={() => setIsTentangDropdownOpen(!isTentangDropdownOpen)}
                            className="flex items-center gap-1 font-semibold hover:text-secondary focus:outline-none transition-colors"
                        >
                            Tentang Kami
                            <RiArrowDownSLine className={`text-lg transition-transform ${isTentangDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isTentangDropdownOpen && (
                            <div className="absolute left-0 mt-2 w-60 flex-col overflow-hidden rounded-2xl bg-white text-slate-800 shadow-2xl border border-slate-100 py-2">
                                <Link href="/visi-misi" className="block px-5 py-2.5 text-sm font-medium hover:bg-purple-50 hover:text-primary transition-colors">Visi Misi UPA BK UNM</Link>
                                <Link href="/struktur-organisasi" className="block px-5 py-2.5 text-sm font-medium hover:bg-purple-50 hover:text-primary transition-colors">Struktur Organisasi</Link>
                                <Link href="/profil-tim" className="block px-5 py-2.5 text-sm font-medium hover:bg-purple-50 hover:text-primary transition-colors">Tim UPA BK UNM</Link>
                                <Link href="/konselor-sebaya" className="block px-5 py-2.5 text-sm font-medium hover:bg-purple-50 hover:text-primary transition-colors">Konselor Sebaya</Link>
                                <Link href="/kontak" className="block px-5 py-2.5 text-sm font-medium hover:bg-purple-50 hover:text-primary transition-colors">Kontak</Link>
                            </div>
                        )}
                    </div>                    {/* Dropdown Desktop */}
                    <div ref={dropdownRef} className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-1 font-semibold hover:text-secondary focus:outline-none transition-colors"
                        >
                            Pilihan Asesmen
                            <RiArrowDownSLine className={`text-lg transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-64 flex-col overflow-hidden rounded-2xl bg-white text-slate-800 shadow-2xl border border-slate-100 py-2">
                                {allTests.length > 0 ? (
                                    allTests.map((test: any, idx: number) => (
                                        <Link key={idx} href={test.url} className="block px-5 py-2.5 text-sm font-medium hover:bg-purple-50 hover:text-primary transition-colors">
                                            {test.title}
                                        </Link>
                                    ))
                                ) : (
                                    <div className="px-5 py-3 text-slate-400 italic text-sm">Belum ada tes</div>
                                )}
                            </div>
                        )}
                    </div>
                </nav>
            </div>

            {/* Navigasi Mobile (Hamburger Menu) */}
            <div className={`md:hidden absolute top-full left-0 w-full bg-primary/95 backdrop-blur-md shadow-xl transition-all duration-300 ease-in-out border-t border-white/10 overflow-y-auto ${isOpen ? 'max-h-[calc(100vh-4rem)] opacity-100' : 'max-h-0 opacity-0'}`}>
                <nav className="flex flex-col py-4 px-6 gap-2">
                    <Link href="/" className="font-semibold text-white/90 hover:text-secondary hover:bg-white/5 px-4 py-3 rounded-xl transition-all">
                        Home
                    </Link>
                    <Link href="/konseling" className="font-semibold text-white/90 hover:text-secondary hover:bg-white/5 px-4 py-3 rounded-xl transition-all">
                        Konseling
                    </Link>
                    <Link href="/berita" className="font-semibold text-white/90 hover:text-secondary hover:bg-white/5 px-4 py-3 rounded-xl transition-all">
                        Berita
                    </Link>
                    <Link href="/modul" className="font-semibold text-white/90 hover:text-secondary hover:bg-white/5 px-4 py-3 rounded-xl transition-all">
                        Modul
                    </Link>
                    <div className="w-full">
                        <button
                            onClick={() => setIsMobileTentangDropdownOpen(!isMobileTentangDropdownOpen)}
                            className="flex w-full items-center justify-between font-semibold text-white/90 hover:text-secondary hover:bg-white/5 px-4 py-3 rounded-xl transition-all"
                        >
                            Tentang Kami
                            <RiArrowDownSLine className={`transition-transform duration-300 ${isMobileTentangDropdownOpen ? 'rotate-180 text-secondary' : ''}`} />
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ${isMobileTentangDropdownOpen ? 'max-h-[1000px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                            <div className="flex flex-col space-y-1 rounded-xl bg-black/10 p-2 mx-2">
                                <Link href="/visi-misi" className="text-sm font-medium text-white/80 hover:text-secondary hover:bg-white/10 transition-colors w-full px-4 py-2.5 rounded-lg">Visi Misi UPA BK UNM</Link>
                                <Link href="/struktur-organisasi" className="text-sm font-medium text-white/80 hover:text-secondary hover:bg-white/10 transition-colors w-full px-4 py-2.5 rounded-lg">Struktur Organisasi</Link>
                                <Link href="/profil-tim" className="text-sm font-medium text-white/80 hover:text-secondary hover:bg-white/10 transition-colors w-full px-4 py-2.5 rounded-lg">Tim UPA BK UNM</Link>
                                <Link href="/konselor-sebaya" className="text-sm font-medium text-white/80 hover:text-secondary hover:bg-white/10 transition-colors w-full px-4 py-2.5 rounded-lg">Konselor Sebaya</Link>
                                <Link href="/kontak" className="text-sm font-medium text-white/80 hover:text-secondary hover:bg-white/10 transition-colors w-full px-4 py-2.5 rounded-lg">Kontak</Link>
                            </div>
                        </div>
                    </div>                    {/* Dropdown Mobile */}
                    <div className="w-full pb-6">
                        <button
                            onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                            className="flex w-full items-center justify-between font-semibold text-white/90 hover:text-secondary hover:bg-white/5 px-4 py-3 rounded-xl transition-all"
                        >
                            Pilihan Asesmen
                            <RiArrowDownSLine className={`transition-transform duration-300 ${isMobileDropdownOpen ? 'rotate-180 text-secondary' : ''}`} />
                        </button>

                        <div className={`overflow-hidden transition-all duration-300 ${isMobileDropdownOpen ? 'max-h-[1000px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                            <div className="flex flex-col space-y-1 rounded-xl bg-black/10 p-2 mx-2">
                                {allTests.length > 0 ? (
                                    allTests.map((test: any, idx: number) => (
                                        <Link key={idx} href={test.url} className="text-sm font-medium text-white/80 hover:text-secondary hover:bg-white/10 transition-colors w-full px-4 py-2.5 rounded-lg">
                                            {test.title}
                                        </Link>
                                    ))
                                ) : (
                                    <div className="text-white/50 italic text-sm py-2 px-4">Belum ada tes</div>
                                )}
                            </div>
                        </div>
                    </div>
                    
                </nav>
            </div>
        </header>
    );
}
