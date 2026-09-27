type LoginProps = {
    text: string;
    link: string;
    isLebar?: boolean;
};

export default function Login({ text, link, isLebar = false }: LoginProps) {
    return (
        <a
            href={link}
            target="_blank"
            className={`${isLebar ? 'w-full' : 'w-fit'} rounded-xl bg-secondary px-4 py-2 text-center font-bold text-slate-900 transition hover:bg-yellow-400`}
        >
            {text}
        </a>
    );
}
