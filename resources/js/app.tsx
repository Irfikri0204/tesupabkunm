import 'aos/dist/aos.css';
import '../css/app.css';

import AOS from 'aos';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);
        function Main() {
            useEffect(() => {
                AOS.init({
                    duration: 800,
                    once: true,
                });
            }, []);

            return <App {...props} />;
        }

        root.render(<Main />);
    },
    progress: {
        color: '#4B5563',
    },
});
