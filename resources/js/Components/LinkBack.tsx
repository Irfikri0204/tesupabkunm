import { Link } from '@inertiajs/react';
import { RiArrowLeftLine } from '@remixicon/react';

export default function LinkBack() {
    return (
        <Link href="/" className="mx-4 my-4 flex items-center gap-y-2 font-semibold text-[#A67CBA] hover:text-gray-600">
            <RiArrowLeftLine /> Kembali ke Beranda
        </Link>
    );
}
