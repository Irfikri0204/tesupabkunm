import { Link } from '@inertiajs/react';

interface ButtonPrimaryProps {
    text: string;
    link: string;
    isLebar?: boolean;
}

export default function ButtonPrimary({ text, link, isLebar = false }: ButtonPrimaryProps) {
    const lebarClass = isLebar ? 'w-full' : 'w-fit';

    return (
        <Link
            href={link}
            className={`${lebarClass} inline-block rounded-xl bg-[#FFD700] px-6 py-3 text-center font-bold text-black shadow-md transition-all hover:bg-[#cfb313] active:scale-95`}
        >
            {text}
        </Link>
    );
}

