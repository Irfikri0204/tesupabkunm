import Header from '@/Components/Header';
import LinkBack from '@/Components/LinkBack';
import { PropsWithChildren } from 'react';

export default function IdentitasLayout({ children }: PropsWithChildren<{}>) {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-slate-50 font-sans">
                <div className="border-b border-slate-200 bg-white px-4 py-2 sm:px-8">
                    <LinkBack />
                </div>
                <div className="w-full">
                    {children}
                </div>
            </main>
        </>
    );
}
