import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import {
    RiCalendarCheckLine,
    RiCheckLine,
    RiCloseLine,
    RiWhatsappLine,
    RiDeleteBin2Line,
    RiFileExcel2Line,
    RiMapPinLine,
    RiTimeLine,
    RiUserHeartLine,
    RiEyeLine,
    RiSearchLine,
} from '@remixicon/react';
import { useState, useEffect } from 'react';

interface Appointment {
    id: number;
    name: string;
    age: number;
    domicile: string;
    applicant_status: string;
    semester: string | null;
    phone: string;
    whatsapp: string;
    problem_description: string;
    problem_duration: string;
    action_taken: string;
    preferred_date: string | null;
    status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
    scheduled_at: string | null;
    admin_notes: string | null;
    assigned_counselor: string | null;
    location: string | null;
    created_at: string;
}

interface Counselor {
    id: number;
    name: string;
    type: string;
}

interface Props {
    appointments: { data: Appointment[]; links: any[] };
    counselors: Counselor[];
    currentTab: 'pengajuan' | 'terjadwal' | 'selesai' | 'batal';
    search?: string;
}

export default function Index({ appointments, counselors, currentTab, search = '' }: Props) {
    const [detailItem, setDetailItem] = useState<Appointment | null>(null);
    const [approveItem, setApproveItem] = useState<Appointment | null>(null);
    const [cancelItem, setCancelItem] = useState<Appointment | null>(null);
    const [isDeleting, setIsDeleting] = useState<number | null>(null);
    const [cancelReason, setCancelReason] = useState('');
    
    const [searchQuery, setSearchQuery] = useState(search);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [exportModal, setExportModal] = useState(false);
    const [exportStatus, setExportStatus] = useState({
        pending: true,
        scheduled: true,
        completed: true,
        cancelled: true,
    });

    useEffect(() => {
        setSelectedIds([]);
    }, [appointments]);

    const { data, setData, post, processing, reset, errors } = useForm({
        scheduled_at: '',
        location: '',
        assigned_counselor: '',
        admin_notes: '',
    });

    const openApproveModal = (item: Appointment) => {
        setApproveItem(item);
        setData({
            scheduled_at: item.scheduled_at
                ? new Date(item.scheduled_at).toISOString().slice(0, 16)
                : '',
            location: item.location ?? '',
            assigned_counselor: item.assigned_counselor ?? '',
            admin_notes: item.admin_notes ?? '',
        });
    };

    const closeApproveModal = () => {
        setApproveItem(null);
        reset();
    };

    const handleApprove = (e: React.FormEvent) => {
        e.preventDefault();
        if (!approveItem) return;
        
        const isReschedule = approveItem.status === 'scheduled';
        
        post(`/admin/konseling/${approveItem.id}/approve`, {
            onSuccess: () => {
                // Build WhatsApp message
                const dateStr = data.scheduled_at
                    ? new Date(data.scheduled_at).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })
                    : '-';
                    
                const actionText = isReschedule ? '*DIUBAH JADWALNYA (RESCHEDULE)* 🔄' : '*DISETUJUI* ✅';
                
                const msg = encodeURIComponent(
                    `Halo ${approveItem.name} 👋\n\nPermohonan konseling Anda telah ${actionText}\n\n` +
                    `📅 *Jadwal*: ${dateStr}\n` +
                    `📍 *Tempat*: ${data.location}\n` +
                    `👤 *Konselor*: ${data.assigned_counselor}\n\n` +
                    `Mohon hadir tepat waktu. Hubungi kami jika ada perubahan.\n\n` +
                    `— Tim UPA BK UNM`
                );
                const waNumber = approveItem.whatsapp.replace(/^0/, '62').replace(/\D/g, '');
                window.open(`https://wa.me/${waNumber}?text=${msg}`, '_blank');
                closeApproveModal();
            },
        });
    };

    const handleCancel = (e: React.FormEvent) => {
        e.preventDefault();
        if (!cancelItem) return;
        
        router.put(`/admin/konseling/${cancelItem.id}`, {
            status: 'cancelled',
            admin_notes: cancelReason
        }, {
            onSuccess: () => {
                // Build WhatsApp message for cancellation
                const msg = encodeURIComponent(
                    `Halo ${cancelItem.name} 👋\n\nMohon maaf, jadwal konseling Anda terpaksa kami *BATALKAN* ❌\n\n` +
                    (cancelReason ? `📝 *Alasan*: ${cancelReason}\n\n` : '') +
                    `Silakan hubungi kami untuk informasi lebih lanjut atau mengajukan ulang permohonan.\n\n` +
                    `— Tim UPA BK UNM`
                );
                const waNumber = cancelItem.whatsapp.replace(/^0/, '62').replace(/\D/g, '');
                window.open(`https://wa.me/${waNumber}?text=${msg}`, '_blank');
                setCancelItem(null);
                setCancelReason('');
            }
        });
    };

    const handleDelete = (item: Appointment) => {
        if (!confirm(`Yakin ingin menghapus data konseling dari "${item.name}"? Tindakan ini tidak dapat dibatalkan.`)) return;
        setIsDeleting(item.id);
        router.delete(`/admin/konseling/${item.id}`, {
            onFinish: () => setIsDeleting(null),
        });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/konseling', { tab: currentTab, search: searchQuery }, { preserveState: true });
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === appointments.data.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(appointments.data.map(i => i.id));
        }
    };

    const toggleSelect = (id: number) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleBulkDelete = () => {
        if (!confirm(`Yakin ingin menghapus ${selectedIds.length} data konseling terpilih?`)) return;
        router.post(`/admin/konseling/bulk-delete`, { ids: selectedIds }, {
            onFinish: () => setSelectedIds([]),
        });
    };

    const handleExport = () => {
        const statuses = Object.keys(exportStatus).filter(k => exportStatus[k as keyof typeof exportStatus]);
        const query = statuses.map(s => `status[]=${s}`).join('&');
        window.open(`/admin/konseling/export/excel?${query}`, '_blank');
        setExportModal(false);
    };

    const buildWaLink = (item: Appointment) => {
        const waNumber = item.whatsapp.replace(/^0/, '62').replace(/\D/g, '');
        return `https://wa.me/${waNumber}`;
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase tracking-wider">Menunggu</span>;
            case 'scheduled':
                return <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">Terjadwal</span>;
            case 'completed':
                return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider">Selesai</span>;
            case 'cancelled':
                return <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold uppercase tracking-wider">Batal</span>;
            default:
                return null;
        }
    };

    return (
        <AdminLayout>
            <Head title="Kelola Daftar Konseling" />

            {/* Page Header */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Daftar Konseling</h1>
                    <p className="text-slate-500 mt-1">Kelola permohonan konseling dari mahasiswa dan umum.</p>
                </div>
                <div className="flex items-center gap-3">
                    {selectedIds.length > 0 && (
                        <button
                            onClick={handleBulkDelete}
                            className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 px-5 py-2.5 rounded-xl font-bold text-sm transition-all"
                        >
                            <RiDeleteBin2Line className="w-5 h-5" /> Hapus ({selectedIds.length})
                        </button>
                    )}
                    <button
                        onClick={() => setExportModal(true)}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-200 hover:shadow-emerald-300"
                    >
                        <RiFileExcel2Line className="w-5 h-5" />
                        Export Excel
                    </button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                {/* Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 w-full md:w-auto">
                    <button
                        onClick={() => router.get('/admin/konseling', { tab: 'pengajuan', search: searchQuery }, { preserveState: true })}
                        className={`px-4 py-2 font-bold text-sm border-b-2 transition-colors whitespace-nowrap ${
                            currentTab === 'pengajuan'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        Pengajuan Baru
                    </button>
                    <button
                        onClick={() => router.get('/admin/konseling', { tab: 'terjadwal', search: searchQuery }, { preserveState: true })}
                        className={`px-4 py-2 font-bold text-sm border-b-2 transition-colors whitespace-nowrap ${
                            currentTab === 'terjadwal'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        Terjadwal
                    </button>
                    <button
                        onClick={() => router.get('/admin/konseling', { tab: 'selesai', search: searchQuery }, { preserveState: true })}
                        className={`px-4 py-2 font-bold text-sm border-b-2 transition-colors whitespace-nowrap ${
                            currentTab === 'selesai'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        Selesai
                    </button>
                    <button
                        onClick={() => router.get('/admin/konseling', { tab: 'batal', search: searchQuery }, { preserveState: true })}
                        className={`px-4 py-2 font-bold text-sm border-b-2 transition-colors whitespace-nowrap ${
                            currentTab === 'batal'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        Dibatalkan
                    </button>
                </div>

                <form onSubmit={handleSearch} className="relative w-full md:w-64">
                    <input
                        type="text"
                        placeholder="Cari nama/wa..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                    <RiSearchLine className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </form>
            </div>

            {/* Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="p-4 w-10">
                                    <input 
                                        type="checkbox" 
                                        className="rounded border-slate-300 text-primary focus:ring-primary"
                                        checked={appointments.data.length > 0 && selectedIds.length === appointments.data.length}
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                <th className="p-4 font-bold text-slate-700 text-sm">Tgl Daftar</th>
                                <th className="p-4 font-bold text-slate-700 text-sm">Nama / Status</th>
                                <th className="p-4 font-bold text-slate-700 text-sm">WhatsApp</th>
                                <th className="p-4 font-bold text-slate-700 text-sm">Status</th>
                                <th className="p-4 font-bold text-slate-700 text-sm">Jadwal & Konselor</th>
                                <th className="p-4 font-bold text-slate-700 text-sm text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.data.length > 0 ? appointments.data.map(item => (
                                <tr key={item.id} className={`border-b border-slate-100 hover:bg-slate-50/50 transition-colors ${selectedIds.includes(item.id) ? 'bg-primary/5' : ''}`}>
                                    <td className="p-4">
                                        <input 
                                            type="checkbox" 
                                            className="rounded border-slate-300 text-primary focus:ring-primary"
                                            checked={selectedIds.includes(item.id)}
                                            onChange={() => toggleSelect(item.id)}
                                        />
                                    </td>
                                    <td className="p-4 text-slate-500 text-sm whitespace-nowrap">
                                        {new Date(item.created_at).toLocaleDateString('id-ID')}
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold text-slate-800">{item.name}</div>
                                        <div className="text-xs text-slate-500 mt-0.5">
                                            {item.applicant_status}{item.semester ? ` · Smstr ${item.semester}` : ''}
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm">
                                        <span className="text-slate-700">{item.whatsapp}</span>
                                    </td>
                                    <td className="p-4">{getStatusBadge(item.status)}</td>
                                    <td className="p-4 text-sm">
                                        {item.scheduled_at ? (
                                            <div>
                                                <div className="font-semibold text-slate-800 text-xs">
                                                    {new Date(item.scheduled_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                                                </div>
                                                {item.location && (
                                                    <div className="text-xs text-slate-500 mt-0.5">📍 {item.location}</div>
                                                )}
                                                {item.assigned_counselor && (
                                                    <div className="text-xs text-primary mt-0.5">👤 {item.assigned_counselor}</div>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-slate-300 text-xs">—</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-center items-center gap-1.5">
                                            {/* Detail */}
                                            <button
                                                onClick={() => setDetailItem(item)}
                                                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                                                title="Lihat Detail"
                                            >
                                                <RiEyeLine className="w-3.5 h-3.5" /> Detail
                                            </button>
                                            {/* Hubungi WA */}
                                            <a
                                                href={buildWaLink(item)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors shadow-sm shadow-green-200"
                                                title="Hubungi via WhatsApp"
                                            >
                                                <RiWhatsappLine className="w-3.5 h-3.5" /> WA
                                            </a>
                                            {/* Setujui / Reschedule */}
                                            {item.status !== 'completed' && item.status !== 'cancelled' && (
                                                <button
                                                    onClick={() => openApproveModal(item)}
                                                    className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-white rounded-lg transition-colors shadow-sm ${item.status === 'scheduled' ? 'bg-blue-500 hover:bg-blue-600 shadow-blue-200' : 'bg-primary hover:bg-purple-900 shadow-primary/30'}`}
                                                    title={item.status === 'scheduled' ? "Reschedule" : "Setujui & Jadwalkan"}
                                                >
                                                    <RiCheckLine className="w-3.5 h-3.5" /> {item.status === 'scheduled' ? "Reschedule" : "Setujui"}
                                                </button>
                                            )}
                                            {/* Cancel */}
                                            {item.status === 'scheduled' && (
                                                <button
                                                    onClick={() => setCancelItem(item)}
                                                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-orange-600 bg-orange-100 hover:bg-orange-200 rounded-lg transition-colors"
                                                    title="Batalkan Jadwal"
                                                >
                                                    <RiCloseLine className="w-3.5 h-3.5" /> Batal
                                                </button>
                                            )}
                                            {/* Hapus */}
                                            <button
                                                onClick={() => handleDelete(item)}
                                                disabled={isDeleting === item.id}
                                                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors shadow-sm shadow-red-200 disabled:opacity-50"
                                                title="Hapus Data"
                                            >
                                                <RiDeleteBin2Line className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={7} className="p-12 text-center text-slate-400">
                                        Belum ada data konseling.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {appointments.links && appointments.links.length > 3 && (
                    <div className="p-4 border-t border-slate-100 flex gap-1 flex-wrap">
                        {appointments.links.map((link: any, i: number) => (
                            <button
                                key={i}
                                disabled={!link.url}
                                onClick={() => link.url && router.visit(link.url)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${
                                    link.active
                                        ? 'bg-primary text-white'
                                        : link.url
                                        ? 'text-slate-600 hover:bg-slate-100'
                                        : 'text-slate-300 cursor-not-allowed'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* ── Detail Modal ── */}
            {detailItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <RiCalendarCheckLine className="text-primary w-6 h-6" /> Detail Permohonan
                            </h3>
                            <button onClick={() => setDetailItem(null)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                                <RiCloseLine className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="overflow-y-auto p-6 flex-1 space-y-5 custom-scrollbar">
                            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                                <h4 className="font-bold text-slate-700 mb-3 text-xs uppercase tracking-wider">Informasi Klien</h4>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div><span className="text-slate-500 block text-xs">Nama</span><span className="font-semibold text-slate-800">{detailItem.name}</span></div>
                                    <div><span className="text-slate-500 block text-xs">Usia</span><span className="font-semibold text-slate-800">{detailItem.age} tahun</span></div>
                                    <div><span className="text-slate-500 block text-xs">Domisili</span><span className="font-semibold text-slate-800">{detailItem.domicile}</span></div>
                                    <div><span className="text-slate-500 block text-xs">Status</span><span className="font-semibold text-slate-800">{detailItem.applicant_status}</span></div>
                                    {detailItem.semester && <div><span className="text-slate-500 block text-xs">Semester</span><span className="font-semibold text-slate-800">{detailItem.semester}</span></div>}
                                    <div><span className="text-slate-500 block text-xs">No Telepon</span><span className="font-semibold text-slate-800">{detailItem.phone}</span></div>
                                    <div><span className="text-slate-500 block text-xs">WhatsApp</span><a href={buildWaLink(detailItem)} target="_blank" className="font-semibold text-green-600 hover:underline">{detailItem.whatsapp}</a></div>
                                    <div><span className="text-slate-500 block text-xs">Tgl Diinginkan</span><span className="font-semibold text-slate-800">{detailItem.preferred_date ? new Date(detailItem.preferred_date).toLocaleDateString('id-ID') : '-'}</span></div>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700 mb-2 text-xs uppercase tracking-wider">Deskripsi Masalah</h4>
                                <div className="bg-red-50 text-red-900 p-4 rounded-xl text-sm leading-relaxed border border-red-100">{detailItem.problem_description}</div>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700 mb-2 text-xs uppercase tracking-wider">Sudah Berapa Lama</h4>
                                <div className="bg-slate-50 text-slate-800 p-4 rounded-xl text-sm border border-slate-100">{detailItem.problem_duration}</div>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700 mb-2 text-xs uppercase tracking-wider">Tindakan Saat Perasaan Muncul</h4>
                                <div className="bg-slate-50 text-slate-800 p-4 rounded-xl text-sm border border-slate-100">{detailItem.action_taken}</div>
                            </div>
                            {detailItem.scheduled_at && (
                                <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                                    <h4 className="font-bold text-blue-700 mb-2 text-xs uppercase tracking-wider">Jadwal Konseling</h4>
                                    <div className="text-sm text-blue-900 space-y-1">
                                        <div>🗓️ {new Date(detailItem.scheduled_at).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}</div>
                                        {detailItem.location && <div>📍 {detailItem.location}</div>}
                                        {detailItem.assigned_counselor && <div>👤 {detailItem.assigned_counselor}</div>}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                            <a href={buildWaLink(detailItem)} target="_blank"
                                className="flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-sm transition-colors shadow">
                                <RiWhatsappLine className="w-4 h-4" /> Hubungi WA
                            </a>
                            <button onClick={() => { setDetailItem(null); openApproveModal(detailItem); }}
                                className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-purple-900 text-white rounded-xl font-bold text-sm transition-colors shadow">
                                <RiCheckLine className="w-4 h-4" /> Setujui
                            </button>
                            <button onClick={() => setDetailItem(null)}
                                className="px-5 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-200 transition-colors text-sm">
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Approve Modal ── */}
            {approveItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-primary/5 to-indigo-50">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                    <RiCalendarCheckLine className="text-primary w-6 h-6" /> {approveItem.status === 'scheduled' ? 'Reschedule Konseling' : 'Setujui Konseling'}
                                </h3>
                                <p className="text-slate-500 text-sm mt-0.5">untuk <span className="font-bold text-slate-700">{approveItem.name}</span></p>
                            </div>
                            <button onClick={closeApproveModal} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                                <RiCloseLine className="w-6 h-6" />
                            </button>
                        </div>

                        <form id="approve-form" onSubmit={handleApprove} className="p-6 space-y-5">
                            {/* Jadwal */}
                            <div>
                                <label className="flex items-center gap-1.5 text-sm font-bold text-slate-700 mb-2">
                                    <RiTimeLine className="w-4 h-4 text-primary" /> Tanggal & Waktu Konseling *
                                </label>
                                <input
                                    type="datetime-local"
                                    value={data.scheduled_at}
                                    onChange={e => setData('scheduled_at', e.target.value)}
                                    min={new Date().toISOString().slice(0, 16)}
                                    required
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-medium focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                />
                                {errors.scheduled_at && <p className="text-xs text-red-500 mt-1">{errors.scheduled_at}</p>}
                            </div>

                            {/* Tempat */}
                            <div>
                                <label className="flex items-center gap-1.5 text-sm font-bold text-slate-700 mb-2">
                                    <RiMapPinLine className="w-4 h-4 text-primary" /> Tempat / Lokasi *
                                </label>
                                <input
                                    type="text"
                                    value={data.location}
                                    onChange={e => setData('location', e.target.value)}
                                    required
                                    placeholder="Mis: Ruang Konseling Lt. 2 Gedung BK"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-medium focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                />
                                {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
                            </div>

                            {/* Konselor */}
                            <div>
                                <label className="flex items-center gap-1.5 text-sm font-bold text-slate-700 mb-2">
                                    <RiUserHeartLine className="w-4 h-4 text-primary" /> Nama Konselor *
                                </label>
                                <select
                                    value={data.assigned_counselor}
                                    onChange={e => setData('assigned_counselor', e.target.value)}
                                    required
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-medium focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                >
                                    <option value="">Pilih Konselor...</option>
                                    <optgroup label="Tim UPA BK UNM (Dosen)">
                                        {counselors.filter(c => c.type === 'dosen').map(c => (
                                            <option key={c.id} value={c.name}>{c.name}</option>
                                        ))}
                                    </optgroup>
                                    <optgroup label="Konselor Sebaya">
                                        {counselors.filter(c => c.type === 'konselor-sebaya').map(c => (
                                            <option key={c.id} value={c.name}>{c.name}</option>
                                        ))}
                                    </optgroup>
                                </select>
                                {errors.assigned_counselor && <p className="text-xs text-red-500 mt-1">{errors.assigned_counselor}</p>}
                            </div>

                            {/* Catatan */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Catatan Admin (Opsional)</label>
                                <textarea
                                    rows={2}
                                    value={data.admin_notes}
                                    onChange={e => setData('admin_notes', e.target.value)}
                                    placeholder="Catatan tambahan untuk tim..."
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-none"
                                />
                            </div>

                            <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-800">
                                <span className="font-bold">💬 Info:</span> Setelah menyimpan, WA Web akan terbuka dengan pesan notifikasi yang sudah terisi otomatis. Anda tinggal klik <em>Kirim</em>.
                            </div>
                        </form>

                        <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                            <button type="button" onClick={closeApproveModal}
                                className="px-5 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-200 transition-colors text-sm">
                                Batal
                            </button>
                            <button form="approve-form" type="submit" disabled={processing}
                                className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-purple-900 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-primary/30 disabled:opacity-60 disabled:cursor-wait">
                                <RiCheckLine className="w-5 h-5" />
                                {processing ? 'Menyimpan...' : (approveItem.status === 'scheduled' ? 'Reschedule & Buka WA' : 'Setujui & Buka WA')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* ── Cancel Modal ── */}
            {cancelItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-red-50">
                            <div>
                                <h3 className="text-xl font-bold text-red-700 flex items-center gap-2">
                                    <RiCloseLine className="w-6 h-6" /> Batalkan Konseling
                                </h3>
                                <p className="text-slate-500 text-sm mt-0.5">untuk <span className="font-bold text-slate-700">{cancelItem.name}</span></p>
                            </div>
                            <button onClick={() => { setCancelItem(null); setCancelReason(''); }} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-100 rounded-xl transition-colors">
                                <RiCloseLine className="w-6 h-6" />
                            </button>
                        </div>
                        <form id="cancel-form" onSubmit={handleCancel} className="p-6">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Alasan Pembatalan (Opsional)</label>
                            <textarea
                                rows={3}
                                value={cancelReason}
                                onChange={e => setCancelReason(e.target.value)}
                                placeholder="Jelaskan alasan mengapa jadwal dibatalkan..."
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none resize-none"
                            />
                            <div className="mt-4 bg-orange-50 border border-orange-200 rounded-xl p-3 text-sm text-orange-800">
                                <span className="font-bold">💬 Info:</span> Setelah menyimpan, WA Web akan terbuka dengan pesan notifikasi pembatalan. Anda tinggal klik <em>Kirim</em>.
                            </div>
                        </form>
                        <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                            <button type="button" onClick={() => { setCancelItem(null); setCancelReason(''); }}
                                className="px-5 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-200 transition-colors text-sm">
                                Kembali
                            </button>
                            <button form="cancel-form" type="submit"
                                className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-red-500/30">
                                <RiCloseLine className="w-5 h-5" /> Batalkan & Buka WA
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Export Modal ── */}
            {exportModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-emerald-50">
                            <div>
                                <h3 className="text-xl font-bold text-emerald-800 flex items-center gap-2">
                                    <RiFileExcel2Line className="w-6 h-6" /> Export Data
                                </h3>
                            </div>
                            <button onClick={() => setExportModal(false)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                                <RiCloseLine className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-slate-600 mb-4">Pilih status konseling yang ingin diekspor:</p>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                        checked={exportStatus.pending} onChange={e => setExportStatus(prev => ({...prev, pending: e.target.checked}))} />
                                    <span className="text-sm font-medium text-slate-700 group-hover:text-emerald-700 transition-colors">Pengajuan Baru</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                        checked={exportStatus.scheduled} onChange={e => setExportStatus(prev => ({...prev, scheduled: e.target.checked}))} />
                                    <span className="text-sm font-medium text-slate-700 group-hover:text-emerald-700 transition-colors">Terjadwal</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                        checked={exportStatus.completed} onChange={e => setExportStatus(prev => ({...prev, completed: e.target.checked}))} />
                                    <span className="text-sm font-medium text-slate-700 group-hover:text-emerald-700 transition-colors">Selesai</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                        checked={exportStatus.cancelled} onChange={e => setExportStatus(prev => ({...prev, cancelled: e.target.checked}))} />
                                    <span className="text-sm font-medium text-slate-700 group-hover:text-emerald-700 transition-colors">Dibatalkan</span>
                                </label>
                            </div>
                        </div>
                        <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                            <button type="button" onClick={() => setExportModal(false)}
                                className="px-5 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-200 transition-colors text-sm">
                                Batal
                            </button>
                            <button onClick={handleExport}
                                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-500/30">
                                <RiFileExcel2Line className="w-5 h-5" /> Download
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 20px; }
            `}</style>
        </AdminLayout>
    );
}
