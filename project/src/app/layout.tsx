import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "AI4B Project",
    description: "Mini-aplikacja w react (next.js)",
    icons: {
        icon: "logo.svg",
    }
};

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
    return (
        <html lang="pl" suppressHydrationWarning>
        <head>
            <script
                dangerouslySetInnerHTML={{
                    __html: `
                        (function() {
                            try {
                                var theme = localStorage.getItem('theme');
                                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                                    document.documentElement.classList.add('dark');
                                }
                            } catch(e) {}
                        })();
                    `
                }}
            />
        </head>
        <body>
            {children}
        </body>
        </html>
    );
}