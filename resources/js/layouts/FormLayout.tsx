import Header from '@/Components/Header';
import LinkBack from '@/Components/LinkBack';
import { PropsWithChildren } from 'react';

export default function FormLayout({ children }: PropsWithChildren<{}>) {
    return (
        <>
            <Header />
            <main className="p-2 sm:p-4 md:p-8 overflow-x-hidden">
                <LinkBack />
                {children}
            </main>
        </>
    );
}

