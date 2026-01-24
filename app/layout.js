import './globals.css'

export const metadata = {
  title: 'CRAS Digital - São João da Ponta',
  description: 'Sistema de Gestão de Assistência Social',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <head>
      <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>{children}</body>
    </html>
  )
}