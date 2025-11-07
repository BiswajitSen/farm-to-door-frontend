'use client';

import { AppProvider } from '../context';

export function Providers({ children }) {
    return <AppProvider>{children}</AppProvider>;
}

