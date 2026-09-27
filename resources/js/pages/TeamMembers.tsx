import AppLayout from '@/layouts/AppLayout';
import { RiUserSmileLine, RiCodeBoxLine, RiHeartPulseLine, RiTeamLine, RiAwardLine, RiArrowDownSLine } from '@remixicon/react';
import { useState } from 'react';

type TeamMember = {
    id: number;
    name: string;
    role: string;
    division: string | null;
    faculty: string | null;
    type: 'dosen' | 'konselor-sebaya' | 'relawan-disabilitas';
    photo: string | null;
    photo_url: string | null;
};

const MemberCard = ({ member }: { member: TeamMember }) => {
    return (
        <article className="group bg-white rounded-[2rem] overflow-hidden shadow-md shadow-slate-200/50 border border-slate-100 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
            <div className="aspect-[3/4] overflow-hidden bg-gradient-to-br from-primary/10 to-indigo-100">
                {member.photo_url ? (
                    <img
                        src={member.photo_url}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=a855f7&color=fff&size=256`}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                )}
            </div>
            <div className="p-5 text-center">
                <p className="font-bold text-slate-800 text-sm leading-snug">{member.name}</p>
                {member.role && <p className="text-primary text-xs font-semibold mt-1.5">{member.role}</p>}
                {member.faculty && <p className="text-slate-400 text-xs mt-1">{member.faculty}</p>}
            </div>
        </article>
    );
};

const AccordionSection = ({ title, icon, members, defaultOpen = false }: { title: string, icon?: React.ReactNode, members: TeamMember[], defaultOpen?: boolean }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="mb-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between bg-white px-6 py-5 md:px-8 md:py-6 text-left transition hover:bg-slate-50"
            >
                <div className="flex items-center gap-4">
                    {icon && <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-100 text-primary">{icon}</div>}
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-slate-800">{title}</h2>
                        <p className="text-sm text-slate-500 mt-1 font-medium">{members.length} Anggota</p>
                    </div>
                </div>
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-purple-100 text-primary' : ''}`}>
                    <RiArrowDownSLine className="h-6 w-6" />
                </div>
            </button>
            
            <div 
                className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="border-t border-slate-100 bg-slate-50 p-6 md:p-8">
                    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                        {members.map(member => (
                            <MemberCard key={member.id} member={member} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const StaticSection = ({ title, icon, members }: { title: string, icon?: React.ReactNode, members: TeamMember[] }) => {
    return (
        <div className="mb-10 rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center gap-4 bg-slate-50 px-6 py-5 md:px-8 border-b border-slate-100">
                {icon && <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-100 text-primary">{icon}</div>}
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-800">{title}</h2>
                    <p className="text-sm text-slate-500 mt-1 font-medium">{members.length} Anggota</p>
                </div>
            </div>
            <div className="p-6 md:p-8">
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                    {members.map(member => (
                        <MemberCard key={member.id} member={member} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default function TeamMembers({ teamMembers = [] }: { teamMembers: TeamMember[] }) {
    // Pisahkan berdasarkan tipe
    const dosenMembers = teamMembers.filter(m => m.type === 'dosen');
    const konselorMembers = teamMembers.filter(m => m.type === 'konselor-sebaya');
    const relawanMembers = teamMembers.filter(m => m.type === 'relawan-disabilitas');

    // Group dosen by division (preserve insertion order of divisions as they appear in sorted teamMembers)
    const dosenGroupsObj = dosenMembers.reduce((acc, m) => {
        const div = m.division || 'Tim UPA BK UNM';
        if (!acc[div]) acc[div] = [];
        acc[div].push(m);
        return acc;
    }, {} as Record<string, TeamMember[]>);
    
    // Maintain array for ordered mapping based on first appearance
    const dosenDivisions = Array.from(new Set(dosenMembers.map(m => m.division || 'Tim UPA BK UNM')));

    // Group konselor sebaya by division (yang dipakai admin untuk 'Angkatan')
    const konselorGroups = konselorMembers.reduce((acc, m) => {
        const div = m.division || 'Angkatan Lainnya'; 
        if (!acc[div]) acc[div] = [];
        acc[div].push(m);
        return acc;
    }, {} as Record<string, TeamMember[]>);

    // Sort konselor keys descending (terbaru ke terlama)
    const sortedKonselorKeys = Object.keys(konselorGroups).sort((a, b) => b.localeCompare(a));

    // Group relawan by division (yang dipakai admin untuk 'Angkatan')
    const relawanGroups = relawanMembers.reduce((acc, m) => {
        const div = m.division || 'Angkatan Lainnya'; 
        if (!acc[div]) acc[div] = [];
        acc[div].push(m);
        return acc;
    }, {} as Record<string, TeamMember[]>);

    // Sort relawan keys descending
    const sortedRelawanKeys = Object.keys(relawanGroups).sort((a, b) => b.localeCompare(a));

    return (
        <AppLayout>
            <section className="bg-primary px-8 py-20 text-white md:px-16">
                <div className="mx-auto max-w-4xl text-center">
                    <h1 className="text-4xl font-bold md:text-5xl">Tim UPA BK UNM</h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
                        Kami bangga memiliki tim yang berdedikasi tinggi untuk memastikan kesejahteraan mental dan kesuksesan akademik seluruh mahasiswa Universitas Negeri Makassar.
                    </p>
                </div>
            </section>

            <div className="bg-slate-50 px-8 py-16 md:px-16">
                <div className="mx-auto max-w-6xl">
                    {teamMembers.length > 0 ? (
                        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                            {teamMembers.map(member => (
                                <MemberCard key={member.id} member={member} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <RiTeamLine className="mx-auto h-16 w-16 text-slate-300 mb-4" />
                            <h3 className="text-xl font-bold text-slate-500">Belum ada data anggota tim</h3>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
