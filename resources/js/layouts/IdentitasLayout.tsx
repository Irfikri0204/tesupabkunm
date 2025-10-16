import Header from '@/Components/Header';
import LinkBack from '@/Components/LinkBack';
import { PropsWithChildren } from 'react';

export default function IdentitasLayout({ children }: PropsWithChildren<{}>) {
    return (
        <>
            <Header />
            <main className="bg-gradient-to-b from-purple-100 to-purple-300 p-2 md:p-8">
                <LinkBack />
                {children}
            </main>
        </>
    );
}
