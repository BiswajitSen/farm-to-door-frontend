import './globals.css';
import { Providers } from './components/Providers';

export const metadata = {
    title: 'Rural Delivery',
    description: 'Farm to Door Delivery Service',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}

