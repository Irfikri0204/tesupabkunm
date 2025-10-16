import logo from '@/../img/logo-upalbkunm.png';
import ButtonPrimary from '@/Components/ButtonPrimary';
import { Link } from '@inertiajs/react';
import { RiArrowDownSLine, RiCloseLine, RiMenuLine } from '@remixicon/react';
import { useEffect, useRef, useState } from 'react';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false); // hamburger menu
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // dropdown desktop
    const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false); // dropdown mobile
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Menutup dropdown saat klik di luar area
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="sticky top-0 z-10 bg-[#A67CBA] text-white shadow">
            <div className="flex items-center justify-between p-4">
                {/* Logo dan Judul */}
                <div className="flex items-center gap-x-2">
                    <img src={logo} alt="logo upa lbk unm" className="h-10 w-10" />
                    <Link href="/" className="text-xl font-bold">
                        Tes UPA BK UNM
                    </Link>
                </div>

                {/* Tombol Hamburger (mobile) */}
                <button className="text-2xl md:hidden" onClick={() => setIsOpen(!isOpen)}>
                    <RiMenuLine className={`${isOpen ? 'hidden' : 'block'}`} />
                    <RiCloseLine className={`${isOpen ? 'block' : 'hidden'}`} />
                </button>

                {/* Navigasi Desktop */}
                <nav className="hidden items-center space-x-4 md:flex">
                    <Link href="/" className="font-semibold hover:text-yellow-300">
                        Home
                    </Link>

                    {/* Dropdown Desktop */}
                    <div ref={dropdownRef} className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-1 font-semibold hover:text-yellow-300 focus:outline-none"
                        >
                            Pilihan Tes
                            <RiArrowDownSLine className={`text-lg transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute left-0 mt-2 w-48 flex-col overflow-hidden rounded-md bg-white text-black shadow-lg">
                                <Link href="/tes/panas" className="block px-4 py-2 hover:bg-gray-100">
                                    Tes PANAS
                                </Link>
                                <Link href="/tes/swls" className="block px-4 py-2 hover:bg-gray-100">
                                    Tes SLWS
                                </Link>
                                <Link href="/tes/gayabelajar" className="block px-4 py-2 hover:bg-gray-100">
                                    Tes Gaya Belajar
                                </Link>
                                <Link href="/tes/srq20" className="block px-4 py-2 hover:bg-gray-100">
                                    Tes SRQ-20
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* <Link href="/about" className="hover:text-yellow-300">
                        Tentang Kami
                    </Link> */}
                    <ButtonPrimary text="Login" link="/admin" />
                </nav>
            </div>

            {/* Navigasi Mobile */}
            {isOpen && (
                <nav className="flex flex-col items-center space-y-4 bg-[#A67CBA] px-4 pb-4 md:hidden">
                    <Link href="/" className="hover:text-yellow-300">
                        Home
                    </Link>

                    {/* Dropdown Mobile */}
                    <div className="w-full">
                        <button
                            onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                            className="flex w-full items-center justify-center gap-1 hover:text-yellow-300"
                        >
                            Pilihan Tes
                            <RiArrowDownSLine className={`transition-transform ${isMobileDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isMobileDropdownOpen && (
                            <div className="mt-2 flex flex-col items-center space-y-4">
                                <Link href="/tes/panas" className="hover:text-yellow-300">
                                    Tes PANAS
                                </Link>
                                <Link href="/tes/swls" className="hover:text-yellow-300">
                                    Tes SLWS
                                </Link>
                                <Link href="/tes/gayabelajar" className="hover:text-yellow-300">
                                    Tes Gaya Belajar
                                </Link>
                                <Link href="/tes/srq20" className="hover:text-yellow-300">
                                    Tes SRQ-20
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* <Link href="/about" className="hover:text-yellow-300">
                        Tentang Kami
                    </Link> */}
                    <ButtonPrimary text="Login" link="/admin" isLebar />
                </nav>
            )}
        </header>
    );
}
