import Header from '@/Components/Header';
import LinkBack from '@/Components/LinkBack';
import { PropsWithChildren } from 'react';

export default function FormLayout({ children }: PropsWithChildren<{}>) {
    return (
        <>
            <Header />
            <main className="p-8">
                <LinkBack />
                {children}
            </main>
        </>
    );
}
