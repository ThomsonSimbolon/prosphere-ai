import type { Metadata } from 'next';
import './globals.css';
import { PreloaderProvider } from '@/components/ui/PreloaderProvider';

export const metadata: Metadata = {
  title: 'ProSphere AI - Dashboard',
  description: 'Manage your leads all in one place. Campaign Analytics & Order Insights.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" style={{ backgroundColor: '#03170b' }}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#03170b" />
        {/* Anti-FOUC critical inline CSS to ensure instant solid dark paint on hard refresh */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html, body {
                background-color: #03170b !important;
                color: #d0e9d4 !important;
                margin: 0;
                padding: 0;
              }
              .material-symbols-outlined {
                font-family: 'Material Symbols Outlined' !important;
                font-display: block;
              }
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface font-body-md text-body-md text-on-surface antialiased selection:bg-primary/20 selection:text-primary min-h-screen">
        <PreloaderProvider>{children}</PreloaderProvider>
      </body>
    </html>
  );
}
