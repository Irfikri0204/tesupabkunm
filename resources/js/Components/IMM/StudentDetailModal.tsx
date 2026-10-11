import React from 'react';
import {
    RiCloseLine,
    RiSurveyLine,
    RiAlertFill,
    RiCheckDoubleLine,
    RiPieChart2Fill,
    RiCalendarLine,
    RiUserLine,
    RiPhoneLine,
    RiGraduationCapLine,
} from '@remixicon/react';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';
import { immInterpretations } from '@/utils/immInterpretations';

interface StudentDetailModalProps {
    student: any | null;
    onClose: () => void;
}

export default function StudentDetailModal({ student, onClose }: StudentDetailModalProps) {
    if (!student) return null;

    const radarData = [
        { subject: 'Pribadi', score: student.skor_pribadi || 0, fullMark: 45 },
        { subject: 'Sosial', score: student.skor_sosial || 0, fullMark: 45 },
        { subject: 'Belajar', score: student.skor_belajar || 0, fullMark: 45 },
        { subject: 'Karier', score: student.skor_karier || 0, fullMark: 45 },
        { subject: 'Lainnya', score: student.skor_lainnya || 0, fullMark: 45 },
    ];

    const criticalItems = student.full_result?.criticalItems?.filter((c: any) => c.triggered) || [];
    const tigaMasalah = student.penutup?.tiga_masalah_terberat || [];

    const getAreaCategory = (score: number) => {
        if (score <= 15) return { text: 'Baik', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', bar: 'bg-emerald-500' };
        if (score <= 30) return { text: 'Perlu Perhatian', badge: 'bg-amber-100 text-amber-700 border-amber-200', bar: 'bg-amber-500' };
        return { text: 'Perlu Pendampingan', badge: 'bg-rose-100 text-rose-700 border-rose-200', bar: 'bg-rose-500' };
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div
                className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-between shrink-0 shadow-md">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center font-bold text-white shadow-inner">
                            <RiSurveyLine size={26} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-xl font-black">{student.nama}</h3>
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white">
                                    NIM: {student.nim || '-'}
                                </span>
                            </div>
                            <p className="text-xs text-white/80 mt-1 font-medium">
                                {student.fakultas || '-'} • {student.program_studi || '-'} • Semester {student.semester || '-'}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                        title="Tutup"
                    >
                        <RiCloseLine size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1">
                    {/* Ringkasan Skor Utama */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Total Score */}
                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between shadow-sm">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Skor Total Masalah
                                </span>
                                <div className="flex items-baseline gap-2 mt-2">
                                    <span className="text-4xl font-black text-slate-800">{student.total_score}</span>
                                    <span className="text-sm font-semibold text-slate-400">/ 225</span>
                                </div>
                                <span
                                    className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-bold border ${
                                        student.total_classification === 'Kondisi Baik'
                                            ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                            : student.total_classification === 'Perlu Perhatian Khusus'
                                            ? 'bg-amber-100 text-amber-700 border-amber-200'
                                            : 'bg-rose-100 text-rose-700 border-rose-200'
                                    }`}
                                >
                                    {student.total_classification}
                                </span>
                            </div>
                            <p className="text-xs text-slate-600 mt-4 pt-3 border-t border-slate-200/60 font-medium leading-relaxed">
                                {student.conclusion || 'Hasil penilaian menyeluruh berdasarkan 75 indikator identifikasi masalah.'}
                            </p>
                        </div>

                        {/* Risiko Putus Kuliah */}
                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between shadow-sm">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Risiko Putus Kuliah (3 Kategori)
                                </span>
                                <div className="flex items-baseline gap-2 mt-2">
                                    <span className="text-4xl font-black text-slate-800">
                                        {student.dropout_risk_score}
                                    </span>
                                    <span className="text-sm font-semibold text-slate-400">/ 27</span>
                                </div>
                                <span
                                    className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-bold border ${
                                        student.dropout_risk_classification === 'Risiko rendah' ||
                                        student.dropout_risk_classification === 'Aman'
                                            ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                            : student.dropout_risk_classification === 'Risiko sedang'
                                            ? 'bg-amber-100 text-amber-700 border-amber-200'
                                            : 'bg-rose-100 text-rose-700 border-rose-200'
                                    }`}
                                >
                                    {student.dropout_risk_classification}
                                </span>
                            </div>
                            <p className="text-xs text-slate-600 mt-4 pt-3 border-t border-slate-200/60 font-medium leading-relaxed">
                                {student.dropout_risk_classification === 'Risiko tinggi'
                                    ? 'Mahasiswa berada pada kategori risiko tinggi putus kuliah, memerlukan konseling dan tindak lanjut segera.'
                                    : student.dropout_risk_classification === 'Risiko sedang'
                                    ? 'Mahasiswa berada pada kategori risiko sedang, disarankan perhatian berkala.'
                                    : 'Mahasiswa berada pada kategori risiko rendah, kondisi terpantau aman.'}
                            </p>
                        </div>
                    </div>

                    {/* Visualisasi Peta Masalah 5 Bidang */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <RiPieChart2Fill size={18} className="text-blue-500" /> Peta Masalah 5 Bidang (Maks 45 Poin Tiap Bidang)
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                            {/* Radar Chart */}
                            <div className="h-60 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                                        <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                                        <PolarAngleAxis
                                            dataKey="subject"
                                            tick={{ fill: '#475569', fontSize: 11, fontWeight: 700 }}
                                        />
                                        <PolarRadiusAxis angle={90} domain={[0, 45]} tick={false} axisLine={false} />
                                        <Radar
                                            name="Skor"
                                            dataKey="score"
                                            stroke="#3b82f6"
                                            strokeWidth={2.5}
                                            fill="#60a5fa"
                                            fillOpacity={0.35}
                                            dot={{ r: 3, fill: '#2563eb' }}
                                        />
                                        <Tooltip />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* 5 Area Progress List */}
                            <div className="space-y-3">
                                {[
                                    { name: 'Pribadi', score: student.skor_pribadi || 0 },
                                    { name: 'Sosial', score: student.skor_sosial || 0 },
                                    { name: 'Belajar', score: student.skor_belajar || 0 },
                                    { name: 'Karier', score: student.skor_karier || 0 },
                                    { name: 'Lainnya', score: student.skor_lainnya || 0 },
                                ].map((area) => {
                                    const cat = getAreaCategory(area.score);
                                    const pct = Math.min(100, Math.round((area.score / 45) * 100));
                                    const interpretation = immInterpretations[area.name]?.[cat.text];

                                    return (
                                        <div key={area.name} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                            <div className="flex items-center justify-between mb-1.5">
                                                <span className="font-bold text-xs text-slate-800">{area.name}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-black text-xs text-slate-700">
                                                        {area.score} / 45
                                                    </span>
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${cat.badge}`}>
                                                        {cat.text}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                                <div
                                                    style={{ width: `${pct}%` }}
                                                    className={`h-full ${cat.bar} transition-all duration-500`}
                                                />
                                            </div>
                                            {interpretation?.artinya && (
                                                <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                                                    {interpretation.artinya}
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Butir Kritis jika ada */}
                    {criticalItems.length > 0 && (
                        <div className="p-6 bg-red-50 rounded-2xl border border-red-200">
                            <div className="flex items-center gap-2 mb-3">
                                <RiAlertFill size={20} className="text-red-600" />
                                <h4 className="font-black text-sm text-red-700 uppercase tracking-tight">
                                    Perhatian: Butir Kritis Terdeteksi!
                                </h4>
                            </div>
                            <div className="space-y-2">
                                {criticalItems.map((c: any, i: number) => (
                                    <div key={i} className="bg-white p-3 rounded-xl border border-red-100 text-xs">
                                        <p className="font-bold text-slate-800">{c.condition}</p>
                                        <p className="text-red-600 mt-1">{c.actionForCounselor}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tiga Masalah Paling Mengganggu */}
                    {tigaMasalah.length > 0 && (
                        <div className="p-5 bg-amber-50 rounded-2xl border border-amber-200">
                            <h5 className="font-bold text-amber-900 text-xs uppercase tracking-wider mb-2">
                                Pernyataan yang Paling Mengganggu Saat Ini:
                            </h5>
                            <div className="flex flex-wrap gap-2">
                                {tigaMasalah.map((num: any, idx: number) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1 bg-amber-100 border border-amber-300 text-amber-900 font-black rounded-lg text-xs"
                                    >
                                        Pernyataan No. {num}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Profil Tambahan */}
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80">
                        <h5 className="font-bold text-slate-700 text-xs uppercase tracking-wider mb-3">
                            Informasi Tambahan Responden
                        </h5>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                            <div>
                                <span className="text-slate-400 block font-bold">Tanggal Tes</span>
                                <span className="font-bold text-slate-800">
                                    {student.created_at ? new Date(student.created_at).toLocaleDateString('id-ID') : '-'}
                                </span>
                            </div>
                            <div>
                                <span className="text-slate-400 block font-bold">Jenis Kelamin</span>
                                <span className="font-bold text-slate-800">{student.jenis_kelamin || '-'}</span>
                            </div>
                            <div>
                                <span className="text-slate-400 block font-bold">No. WhatsApp</span>
                                <span className="font-bold text-slate-800">{student.nomor_hp || '-'}</span>
                            </div>
                            <div>
                                <span className="text-slate-400 block font-bold">IPK Terakhir</span>
                                <span className="font-bold text-slate-800">{student.ipk_terakhir || '-'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 px-6 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 bg-slate-800 text-white rounded-xl text-sm font-bold hover:bg-slate-900 transition-colors shadow-sm"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}
