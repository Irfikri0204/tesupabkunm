import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { RiBarChart2Line, RiTableLine, RiAlertFill, RiShieldCheckLine, RiAlarmWarningLine } from '@remixicon/react';

interface DropoutStatsVisualizerProps {
    data: {
        'Risiko rendah': number;
        'Risiko sedang': number;
        'Risiko tinggi': number;
    } | undefined;
    compact?: boolean;
}

const CATEGORIES = [
    {
        key: 'Risiko rendah',
        label: 'Risiko Rendah',
        scoreRange: '0 - 6',
        desc: 'Kondisi relatif stabil dan adaptif terhadap perkuliahan',
        color: '#10b981',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        text: 'text-emerald-700',
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        bar: 'bg-emerald-500',
        icon: RiShieldCheckLine,
    },
    {
        key: 'Risiko sedang',
        label: 'Risiko Sedang',
        scoreRange: '7 - 13',
        desc: 'Terdapat indikasi kendala yang memerlukan pemantauan berkala',
        color: '#f59e0b',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        text: 'text-amber-700',
        badge: 'bg-amber-100 text-amber-800 border-amber-300',
        bar: 'bg-amber-500',
        icon: RiAlarmWarningLine,
    },
    {
        key: 'Risiko tinggi',
        label: 'Risiko Tinggi',
        scoreRange: '14 - 27',
        desc: 'Prioritas tinggi, memerlukan intervensi konseling & pendampingan intensif',
        color: '#ef4444',
        bg: 'bg-rose-50',
        border: 'border-rose-200',
        text: 'text-rose-700',
        badge: 'bg-rose-100 text-rose-800 border-rose-300',
        bar: 'bg-rose-500',
        icon: RiAlertFill,
    },
];

export default function DropoutStatsVisualizer({ data, compact = false }: DropoutStatsVisualizerProps) {
    const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');

    const total =
        (data?.['Risiko rendah'] ?? 0) +
        (data?.['Risiko sedang'] ?? 0) +
        (data?.['Risiko tinggi'] ?? 0);

    const chartData = CATEGORIES.map((cat) => {
        const count = data?.[cat.key as keyof typeof data] ?? 0;
        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
        return {
            name: cat.label,
            count,
            pct,
            color: cat.color,
            key: cat.key,
        };
    });

    return (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 md:p-5 overflow-hidden">
            {/* View Mode Toggle Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    <span>Visualisasi Risiko Putus Kuliah (3 Kategori)</span>
                </div>
                <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
                    <button
                        type="button"
                        onClick={() => setViewMode('chart')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                            viewMode === 'chart'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        <RiBarChart2Line size={14} /> Grafik
                    </button>
                    <button
                        type="button"
                        onClick={() => setViewMode('table')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                            viewMode === 'table'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        <RiTableLine size={14} /> Tabel
                    </button>
                </div>
            </div>

            {viewMode === 'chart' ? (
                <div className="space-y-4">
                    {/* Visual Bar Chart */}
                    <div className={compact ? 'h-40' : 'h-52'}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={chartData}
                                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fill: '#475569', fontSize: 12, fontWeight: 700 }}
                                    axisLine={{ stroke: '#cbd5e1' }}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                                    allowDecimals={false}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            const item = payload[0].payload;
                                            return (
                                                <div className="bg-white p-3 rounded-xl shadow-xl border border-slate-100 text-xs font-sans min-w-[170px]">
                                                    <p className="font-black text-slate-800 text-sm mb-1.5">
                                                        {item.name}
                                                    </p>
                                                    <div className="flex justify-between items-center font-bold text-slate-700">
                                                        <span>Jumlah Mahasiswa:</span>
                                                        <span style={{ color: item.color }}>
                                                            {item.count} orang ({item.pct}%)
                                                        </span>
                                                    </div>
                                                    <p className="text-[10px] text-slate-400 mt-1 border-t pt-1">
                                                        Total Responden: {total}
                                                    </p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Proportional Segmented Progress Bar */}
                    <div className="space-y-1">
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                            {chartData.map((item) => (
                                item.pct > 0 && (
                                    <div
                                        key={item.key}
                                        style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                                        className="h-full transition-all"
                                        title={`${item.name}: ${item.count} (${item.pct}%)`}
                                    />
                                )
                            ))}
                        </div>
                    </div>

                    {/* 3 Detailed Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                        {CATEGORIES.map((cat) => {
                            const count = data?.[cat.key as keyof typeof data] ?? 0;
                            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                            const Icon = cat.icon;

                            return (
                                <div
                                    key={cat.key}
                                    className={`${cat.bg} p-4 rounded-xl border ${cat.border} flex flex-col justify-between shadow-xs`}
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-1.5">
                                                <Icon size={16} className={cat.text} />
                                                <span className={`font-black text-xs ${cat.text} uppercase tracking-wider`}>
                                                    {cat.label}
                                                </span>
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-500 bg-white/80 px-2 py-0.5 rounded-full border border-slate-200/50">
                                                Skor {cat.scoreRange}
                                            </span>
                                        </div>
                                        <div className="flex items-baseline gap-2 my-1">
                                            <span className={`text-2xl font-black ${cat.text}`}>
                                                {count}
                                            </span>
                                            <span className="text-xs font-bold text-slate-500">
                                                mahasiswa ({pct}%)
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-[11px] text-slate-600 mt-2 pt-2 border-t border-slate-200/60 leading-relaxed font-medium">
                                        {cat.desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                /* Tabular View */
                <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-sm">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-xs">
                            <tr>
                                <th className="px-4 py-3">Kategori Risiko</th>
                                <th className="px-4 py-3 text-center">Rentang Skor</th>
                                <th className="px-4 py-3 text-center">Jumlah Mahasiswa</th>
                                <th className="px-4 py-3 text-center">Persentase</th>
                                <th className="px-4 py-3">Keterangan Penanganan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {CATEGORIES.map((cat) => {
                                const count = data?.[cat.key as keyof typeof data] ?? 0;
                                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                                return (
                                    <tr key={cat.key} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-3 font-bold text-slate-800">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${cat.badge}`}>
                                                {cat.label}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center font-mono font-bold text-slate-600">
                                            {cat.scoreRange}
                                        </td>
                                        <td className={`px-4 py-3 text-center font-black ${cat.text}`}>
                                            {count} org
                                        </td>
                                        <td className="px-4 py-3 text-center font-bold text-slate-700">
                                            {pct}%
                                        </td>
                                        <td className="px-4 py-3 text-xs text-slate-600 whitespace-normal">
                                            {cat.desc}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
