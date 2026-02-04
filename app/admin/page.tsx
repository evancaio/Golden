import React from 'react'

async function getCadastros() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/cadastro`, { cache: 'no-store' })
  if (!res.ok) return []
  return res.json()
}

export default async function AdminPage() {
  const data: any[] = await getCadastros()

  return (
    <div className="container-card mt-6">
      <h1 className="text-2xl font-semibold mb-4">Painel Admin — Cadastros</h1>
      <div className="overflow-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Nome</th>
              <th className="p-2 text-left">CPF</th>
              <th className="p-2 text-left">Telefone</th>
              <th className="p-2 text-left">Idade</th>
              <th className="p-2 text-left">Endereço</th>
              <th className="p-2 text-left">Experiência</th>
              <th className="p-2 text-left">Formação</th>
              <th className="p-2 text-left">Referências</th>
              <th className="p-2 text-left">Foto</th>
              <th className="p-2 text-left">Data</th>
            </tr>
          </thead>
          <tbody>
            {data.map((r, i) => (
              <tr key={i} className="border-t align-top">
                <td className="p-2 align-top">{r.nome}</td>
                <td className="p-2 align-top">{r.cpf}</td>
                <td className="p-2 align-top">{r.telefone}</td>
                <td className="p-2 align-top">{r.idade}</td>
                <td className="p-2 align-top">{r.endereco}</td>
                <td className="p-2 align-top whitespace-pre-wrap">{r.experiencia}</td>
                <td className="p-2 align-top whitespace-pre-wrap">{r.formacao}</td>
                <td className="p-2 align-top">
                  <div className="space-y-1">
                    {[1,2,3].map(n => (
                      <div key={n} className="text-sm">
                        <strong>{r[`ref${n}_nome`] || '-'}:</strong> {r[`ref${n}_telefone`] || '-'}<br/>
                        <span className="text-xs text-gray-600">Emergência: {r[`ref${n}_emergencia`] || '-'}</span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="p-2 align-top">
                  {r.fotoUrl ? <a className="text-indigo-600" href={r.fotoUrl} target="_blank" rel="noreferrer">Ver foto</a> : '-'}
                </td>
                <td className="p-2 align-top">{new Date(r.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
