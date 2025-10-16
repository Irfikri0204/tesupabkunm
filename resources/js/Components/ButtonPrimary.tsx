import { Link } from '@inertiajs/react';

interface ButtonPrimaryProps {
    text: string;
    link: string;
    isLebar?: boolean;
}

export default function ButtonPrimary({ text, link, isLebar = false }: ButtonPrimaryProps) {
    const lebarClass = isLebar ? 'w-full' : 'w-fit';

    return (
        <Link href={link} className={`${lebarClass} rounded-xl bg-[#FFD700] px-4 py-2 text-center font-semibold text-black hover:bg-[#cfb313]`}>
            {text}
        </Link>
    );
}
