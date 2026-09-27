import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { RiAdminLine } from '@remixicon/react';

export default function Login() {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 relative overflow-hidden">
            {/* Background Ornaments */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/4 translate-x-1/4 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/20 rounded-full blur-3xl translate-y-1/4 -translate-x-1/4 pointer-events-none" />

            <div className="w-full max-w-md p-8 md:p-12 bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 relative z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex w-20 h-20 bg-purple-50 text-primary rounded-[1.5rem] items-center justify-center mb-6">
                        <RiAdminLine className="w-10 h-10" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Admin UPA BK UNM</h1>
                    <p className="text-slate-500 mt-2 text-sm font-medium">Masuk untuk mengelola sistem layanan</p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Alamat Email</label>
                        <input 
                            type="email" 
                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium"
                            placeholder="admin@upabk.unm.ac.id"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        {errors.email && <p className="mt-2 text-sm text-red-500 font-medium">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Kata Sandi</label>
                        <input 
                            type="password" 
                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium"
                            placeholder="••••••••"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        {errors.password && <p className="mt-2 text-sm text-red-500 font-medium">{errors.password}</p>}
                    </div>

                    <div className="flex items-center">
                        <input 
                            id="remember" 
                            type="checkbox" 
                            className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <label htmlFor="remember" className="ml-3 text-sm text-slate-600 font-medium">Ingat Saya</label>
                    </div>

                    <button 
                        type="submit" 
                        disabled={processing}
                        className="w-full py-4 mt-2 bg-primary hover:bg-purple-900 text-white font-bold rounded-2xl shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {processing ? 'Memproses...' : 'Masuk Sekarang'}
                    </button>
                    
                    <div className="text-center mt-8 pt-6 border-t border-slate-100">
                        <a href="/" className="text-sm font-bold text-primary hover:text-purple-900 transition-colors">
                            &larr; Kembali ke Beranda Utama
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}
