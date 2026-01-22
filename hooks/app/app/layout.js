import './globals.css';

export const metadata = {
  title: 'CRAS Digital - Gestão de Assistência Social',
  description: 'Sistema interno para organização de prontuários e famílias',
  manifest: '/manifest.json', // Importante para o PWA
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <head>
        <meta name="theme-color" content="#1e40af" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
