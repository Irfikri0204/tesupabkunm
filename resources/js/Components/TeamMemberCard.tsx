interface TeamMemberCardProps {
    name: string;
    role: string;
    division?: string | null;
    faculty?: string | null;
    photo?: string | null;
    photo_url?: string | null;
    type: string;
}

export default function TeamMemberCard({ name, role, division, faculty, photo, photo_url, type }: TeamMemberCardProps) {
    const initials = name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('');

    return (
        <article className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <div className="mb-5 flex h-[28rem] items-center justify-center overflow-hidden rounded-[1.75rem] bg-slate-200 text-slate-700">
                {photo_url || photo ? (
                    <img
                        src={photo_url || photo!}
                        alt={`Foto ${name}`}
                        loading="lazy"
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-5xl font-black tracking-wide text-slate-700">
                        {initials || 'UP'}
                    </div>
                )}
            </div>

            <div className="space-y-3 text-left">
                <h3 className="text-lg font-semibold text-slate-900">{name}</h3>
                <p className="text-base font-semibold text-slate-900">{role}</p>
                {division ? (
                    <p className="text-sm font-semibold text-slate-900">{division}</p>
                ) : null}
                {faculty ? (
                    <p className="text-sm font-semibold text-slate-700">{faculty}</p>
                ) : null}
            </div>
        </article>
    );
}
