import './globals.css'
import React from 'react'

export const metadata = {
  title: 'Cadastro de Prestadores – Homecare'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <main className="max-w-4xl mx-auto p-4">{children}</main>
      </body>
    </html>
  )
}
