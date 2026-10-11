import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RiBarChart2Line, RiTableLine } from '@remixicon/react';

interface StatsVisualizerProps {
    data: {
        [key: string]: {
            Baik: number;
            Perhatian: number;
            Pendampingan: number;
        };
    };
    compact?: boolean;
}

const AREAS = ['Pribadi', 'Sosial', 'Belajar', 'Karier', 'Lainnya'];

export default function FacultyStatsVisualizer({ data, compact = false }: StatsVisualizerProps) {
    const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');

    const chartData = AREAS.map((area) => {
        const baik = data?.[area]?.['Baik'] ?? 0;
        const perhatian = data?.[area]?.['Perhatian'] ?? 0;
        const pendampingan = data?.[area]?.['Pendampingan'] ?? 0;
        const total = baik + perhatian + pendampingan;
        return {
            name: area,
            Baik: baik,
            Perhatian: perhatian,
            Pendampingan: pendampingan,
            total,
        };
    });

    const hasData = chartData.some((d) => d.total > 0);

    return (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 md:p-5 overflow-hidden">
            {/* View Mode Toggle Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span>Visualisasi Distribusi Masalah</span>
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
                    {/* Recharts Stacked Bar Chart */}
                    <div className={compact ? 'h-48' : 'h-64'}>
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
                                    content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            const item = chartData.find((c) => c.name === label);
                                            const total = item?.total || 0;
                                            return (
                                                <div className="bg-white p-3 rounded-xl shadow-xl border border-slate-100 text-xs font-sans min-w-[170px]">
                                                    <p className="font-black text-slate-800 text-sm mb-2 border-b border-slate-100 pb-1">
                                                        Bidang {label}
                                                    </p>
                                                    <div className="space-y-1.5">
                                                        <div className="flex justify-between items-center text-emerald-600 font-bold">
                                                            <span>🟢 Kondisi Baik:</span>
                                                            <span>
                                                                {item?.Baik} ({total > 0 ? Math.round(((item?.Baik || 0) / total) * 100) : 0}%)
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between items-center text-amber-600 font-bold">
                                                            <span>🟡 Perhatian:</span>
                                                            <span>
                                                                {item?.Perhatian} ({total > 0 ? Math.round(((item?.Perhatian || 0) / total) * 100) : 0}%)
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between items-center text-rose-600 font-bold">
                                                            <span>🔴 Pendampingan:</span>
                                                            <span>
                                                                {item?.Pendampingan} ({total > 0 ? Math.round(((item?.Pendampingan || 0) / total) * 100) : 0}%)
                                                            </span>
                                                        </div>
                                                        <div className="border-t border-slate-100 pt-1 flex justify-between text-slate-500 font-bold">
                                                            <span>Total Mahasiswa:</span>
                                                            <span>{total} orang</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar dataKey="Baik" stackId="stack" fill="#10b981" radius={[0, 0, 0, 0]} />
                                <Bar dataKey="Perhatian" stackId="stack" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                                <Bar dataKey="Pendampingan" stackId="stack" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Legend */}
                    <div className="flex items-center justify-center gap-4 text-xs font-bold pt-1">
                        <div className="flex items-center gap-1.5 text-emerald-700">
                            <span className="w-3 h-3 rounded bg-emerald-500 inline-block"></span>
                            <span>Kondisi Baik</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-amber-700">
                            <span className="w-3 h-3 rounded bg-amber-500 inline-block"></span>
                            <span>Perlu Perhatian</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-rose-700">
                            <span className="w-3 h-3 rounded bg-rose-500 inline-block"></span>
                            <span>Perlu Pendampingan</span>
                        </div>
                    </div>

                    {/* Visual Segmented Progress Cards */}
                    <div className={`grid grid-cols-1 sm:grid-cols-2 ${compact ? 'lg:grid-cols-3' : 'lg:grid-cols-5'} gap-2.5 pt-2`}>
                        {chartData.map((d) => {
                            const pctBaik = d.total > 0 ? Math.round((d.Baik / d.total) * 100) : 0;
                            const pctPerhatian = d.total > 0 ? Math.round((d.Perhatian / d.total) * 100) : 0;
                            const pctPendampingan = d.total > 0 ? Math.round((d.Pendampingan / d.total) * 100) : 0;
                            return (
                                <div
                                    key={d.name}
                                    className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/60 hover:bg-slate-50 transition-colors flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="font-black text-slate-800 text-xs">{d.name}</span>
                                            <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200/60">
                                                {d.total} mhs
                                            </span>
                                        </div>

                                        {/* Multi-segmented distribution bar */}
                                        <div className="w-full h-2.5 bg-slate-200/70 rounded-full overflow-hidden flex my-2">
                                            {pctBaik > 0 && (
                                                <div
                                                    style={{ width: `${pctBaik}%` }}
                                                    className="bg-emerald-500 h-full transition-all"
                                                    title={`Baik: ${d.Baik} (${pctBaik}%)`}
                                                />
                                            )}
                                            {pctPerhatian > 0 && (
                                                <div
                                                    style={{ width: `${pctPerhatian}%` }}
                                                    className="bg-amber-500 h-full transition-all"
                                                    title={`Perhatian: ${d.Perhatian} (${pctPerhatian}%)`}
                                                />
                                            )}
                                            {pctPendampingan > 0 && (
                                                <div
                                                    style={{ width: `${pctPendampingan}%` }}
                                                    className="bg-rose-500 h-full transition-all"
                                                    title={`Pendampingan: ${d.Pendampingan} (${pctPendampingan}%)`}
                                                />
                                            )}
                                        </div>
                                    </div>

                                    {/* Numbers breakdown */}
                                    <div className="flex items-center justify-between text-[11px] font-bold pt-1.5 border-t border-slate-200/50 text-slate-600">
                                        <span className="text-emerald-700" title="Baik">{d.Baik} Baik</span>
                                        <span className="text-amber-700" title="Perlu Perhatian">{d.Perhatian} Perhatian</span>
                                        <span className="text-rose-700" title="Perlu Pendampingan">{d.Pendampingan} Pendampingan</span>
                                    </div>
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
                                <th className={`px-4 ${compact ? 'py-2' : 'py-3'}`}>Bidang</th>
                                <th className={`px-4 ${compact ? 'py-2' : 'py-3'} text-center text-emerald-600 bg-emerald-50/40`}>Kondisi Baik</th>
                                <th className={`px-4 ${compact ? 'py-2' : 'py-3'} text-center text-amber-600 bg-amber-50/40`}>Perlu Perhatian</th>
                                <th className={`px-4 ${compact ? 'py-2' : 'py-3'} text-center text-rose-600 bg-rose-50/40`}>Perlu Pendampingan</th>
                                <th className={`px-4 ${compact ? 'py-2' : 'py-3'} text-center text-slate-600`}>Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {chartData.map((d) => (
                                <tr key={d.name} className="hover:bg-slate-50 transition-colors">
                                    <td className={`px-4 ${compact ? 'py-2 text-xs' : 'py-3'} font-bold text-slate-800`}>{d.name}</td>
                                    <td className={`px-4 ${compact ? 'py-2 text-xs' : 'py-3'} text-center font-bold text-emerald-700 bg-emerald-50/20`}>{d.Baik}</td>
                                    <td className={`px-4 ${compact ? 'py-2 text-xs' : 'py-3'} text-center font-bold text-amber-700 bg-amber-50/20`}>{d.Perhatian}</td>
                                    <td className={`px-4 ${compact ? 'py-2 text-xs' : 'py-3'} text-center font-bold text-rose-700 bg-rose-50/20`}>{d.Pendampingan}</td>
                                    <td className={`px-4 ${compact ? 'py-2 text-xs' : 'py-3'} text-center font-bold text-slate-600`}>{d.total}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
