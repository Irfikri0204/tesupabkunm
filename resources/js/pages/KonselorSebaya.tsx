import AppLayout from '@/Layouts/AppLayout';
import { RiTeamLine, RiHeartPulseLine, RiUserHeartLine, RiCalendarLine } from '@remixicon/react';

interface Member {
    id: number;
    name: string;
    role: string;
    division: string;
    faculty: string;
    photo_url: string | null;
}

export default function KonselorSebaya({ members, title, desc, image }: { members?: Member[], title?: string, desc?: string, image?: string | null }) {
    // Group members by division (year/angkatan), sorted descending (newest first)
    const groups: Record<string, Member[]> = {};
    (members ?? []).forEach(m => {
        const key = m.division?.trim() || 'Lainnya';
        if (!groups[key]) groups[key] = [];
        groups[key].push(m);
    });

    // Sort keys: numeric/year strings descending, non-numeric at end
    const sortedKeys = Object.keys(groups).sort((a, b) => {
        const aNum = parseInt(a);
        const bNum = parseInt(b);
        if (!isNaN(aNum) && !isNaN(bNum)) return bNum - aNum;
        if (!isNaN(aNum)) return -1;
        if (!isNaN(bNum)) return 1;
        return a.localeCompare(b);
    });

    return (
        <AppLayout>
            <section className="relative bg-primary pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-indigo-900 to-purple-900"></div>
                <div className="relative mx-auto max-w-7xl px-8 md:px-16 text-center text-white z-10">
                    <span className="inline-block rounded-full bg-secondary px-4 py-1.5 text-sm font-bold text-slate-900 shadow-md mb-4">
                        Tentang Kami
                    </span>
                    <h1 className="text-4xl font-black leading-tight md:text-5xl lg:text-6xl">
                        Konselor Sebaya
                    </h1>
                </div>
            </section>

            <section className="bg-slate-50 px-8 py-20 md:px-16">
                <div className="mx-auto max-w-6xl">
                    {/* Deskripsi */}
                    <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
                        <div className="space-y-6">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                <RiHeartPulseLine className="w-8 h-8" />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900">{title || 'Teman Cerita Terpercaya'}</h2>
                            {desc ? (
                                <div className="text-slate-600 leading-relaxed text-lg space-y-4 quill-content" dangerouslySetInnerHTML={{ __html: desc }} />
                            ) : (
                                <>
                                    <p className="text-slate-600 leading-relaxed text-lg">
                                        Konselor Sebaya (Peer Counselor) adalah mahasiswa terlatih yang siap mendengarkan, memahami, dan membantu rekan sesama mahasiswa dalam menghadapi berbagai tantangan perkuliahan maupun masalah pribadi.
                                    </p>
                                    <p className="text-slate-600 leading-relaxed text-lg">
                                        Pendekatan sebaya menjadikan proses konseling terasa lebih hangat, nyaman, dan sejalan dengan realita dunia mahasiswa.
                                    </p>
                                </>
                            )}
                        </div>
                        <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center justify-center aspect-square md:aspect-[4/3] w-full relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            {image ? (
                                <img src={image} alt={title || 'Konselor Sebaya'} className="w-full h-full object-cover rounded-[1.5rem] relative z-10 shadow-sm" />
                            ) : (
                                <RiTeamLine className="w-40 h-40 text-slate-200 group-hover:scale-110 group-hover:text-primary transition-all duration-500 relative z-10" />
                            )}
                        </div>
                    </div>

                    {/* Section Heading */}
                    <div className="mb-14 text-center">
                        <h2 className="text-3xl font-bold text-slate-900 mb-3">Tim Konselor Sebaya Kami</h2>
                        <p className="text-slate-500 max-w-xl mx-auto">
                            Kenali para konselor sebaya kami yang siap mendengarkan dan mendukung perjalanan akademis Anda, dikelompokkan berdasarkan angkatan.
                        </p>
                    </div>

                    {members && members.length > 0 ? (
                        <div className="space-y-16">
                            {sortedKeys.map((groupKey) => (
                                <div key={groupKey}>
                                    {/* Year / Division heading */}
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="flex items-center gap-3 bg-gradient-to-r from-primary to-indigo-600 text-white px-6 py-2.5 rounded-2xl shadow-lg shadow-primary/30">
                                            <RiCalendarLine className="w-5 h-5 flex-shrink-0" />
                                            <span className="font-black text-lg tracking-wide">
                                                {/^\d{4}$/.test(groupKey) ? `Angkatan ${groupKey}` : groupKey}
                                            </span>
                                        </div>
                                        <div className="flex-1 h-px bg-gradient-to-r from-primary/20 to-transparent"></div>
                                        <span className="text-slate-400 text-sm font-bold whitespace-nowrap">{groups[groupKey].length} konselor</span>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                        {groups[groupKey].map((member) => (
                                            <div key={member.id} className="group bg-white rounded-[2rem] overflow-hidden shadow-md shadow-slate-200/50 border border-slate-100 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
                                                <div className="aspect-[3/4] overflow-hidden bg-gradient-to-br from-primary/10 to-indigo-100">
                                                    {member.photo_url ? (
                                                        <img
                                                            src={member.photo_url}
                                                            alt={member.name}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-primary/30">
                                                            <RiUserHeartLine className="w-16 h-16" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-5 text-center">
                                                    <p className="font-bold text-slate-800 text-sm leading-snug">{member.name}</p>
                                                    {member.role && <p className="text-primary text-xs font-semibold mt-1.5">{member.role}</p>}
                                                    {member.faculty && <p className="text-slate-400 text-xs mt-1">{member.faculty}</p>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center bg-white rounded-[3rem] p-12 shadow-lg shadow-slate-200/30 border border-slate-100 max-w-4xl mx-auto">
                            <RiTeamLine className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                            <p className="text-slate-500 italic text-lg max-w-2xl mx-auto">
                                Data profil Konselor Sebaya saat ini sedang dalam proses pembaruan. Mohon kunjungi kembali halaman ini nanti.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </AppLayout>
    );
}
