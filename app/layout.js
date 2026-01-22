import './globals.css';

export const metadata = {
  title: 'CRAS Digital - Gestão de Assistência Social',
  description: 'Sistema interno para organização de prontuários e famílias',
  manifest: '/manifest.json',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <head>
        <meta name="theme-color" content="#1e40af" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}