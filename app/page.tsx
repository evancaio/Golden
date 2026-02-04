import React, { useState } from 'react'

export default function Page() {
  const [status, setStatus] = useState<string | null>(null)
  const [cpf, setCpf] = useState('')
  const [telefone, setTelefone] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus(null)
    const fd = new FormData(e.currentTarget)

    // basic client-side validation
    const required = ['nome','cpf','telefone','idade','endereco','experiencia','formacao']
    for (const k of required) {
      if (!fd.get(k)) { setStatus('Preencha todos os campos obrigatórios'); return }
    }

    // basic client-side validation for cpf/telefone
    const cpfDigits = String(fd.get('cpf') || '').replace(/\D/g, '')
    if (cpfDigits.length !== 11) { setStatus('CPF inválido'); return }

    const telefoneDigits = String(fd.get('telefone') || '').replace(/\D/g, '')
    if (telefoneDigits.length < 10) { setStatus('Telefone inválido'); return }

    const foto = fd.get('foto') as File | null
    if (foto && foto.size > 0) {
      const allowed = ['image/jpeg','image/png']
      if (!allowed.includes(foto.type)) { setStatus('Apenas JPG/PNG aceitos'); return }
      const dataUrl = await fileToDataUrl(foto)
      fd.set('foto', dataUrl)
    } else {
      fd.set('foto', '')
    }

    const payload: any = {}
    fd.forEach((v, k) => { payload[k] = v })

    const res = await fetch('/api/cadastro', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(payload) })
    const json = await res.json()
    if (res.ok) {
      setStatus('Cadastro realizado com sucesso! Obrigado!')
      (e.currentTarget as HTMLFormElement).reset()
    } else {
      setStatus(json?.error || 'Erro no envio')
    }
  }

  return (
    <div className="container-card mt-6">
      <h1 className="text-2xl font-semibold mb-4">Cadastro de Prestadores – Homecare</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Nome completo</label>
          <input name="nome" className="mt-1 w-full rounded border p-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">CPF</label>
              <input name="cpf" value={cpf} onChange={e => { const v = formatCPF(e.target.value); setCpf(v) }} placeholder="000.000.000-00" className="mt-1 w-full rounded border p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Telefone</label>
              <input name="telefone" value={telefone} onChange={e => { const v = formatPhone(e.target.value); setTelefone(v) }} placeholder="(00) 00000-0000" className="mt-1 w-full rounded border p-2" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Idade</label>
            <input name="idade" type="number" className="mt-1 w-full rounded border p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Endereço</label>
            <input name="endereco" className="mt-1 w-full rounded border p-2" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Experiência profissional</label>
          <textarea name="experiencia" className="mt-1 w-full rounded border p-2" rows={3}></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium">Formação e cursos</label>
          <textarea name="formacao" className="mt-1 w-full rounded border p-2" rows={2}></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium">Upload de foto (JPG/PNG)</label>
          <input name="foto" type="file" accept="image/jpeg,image/png" className="mt-1 w-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1,2,3].map(i => (
            <div key={i} className="p-2 border rounded">
              <h3 className="font-medium">Referência {i}</h3>
              <input name={`ref${i}_nome`} placeholder="Nome" className="mt-1 w-full rounded border p-1" />
              <input name={`ref${i}_telefone`} placeholder="Telefone" className="mt-1 w-full rounded border p-1" />
              <input name={`ref${i}_emergencia`} placeholder="Contato de emergência" className="mt-1 w-full rounded border p-1" />
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-lg">Enviar cadastro</button>
        </div>
        {status && <p className="text-center mt-2">{status}</p>}
      </form>
    </div>
  )
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const fr = new FileReader()
    fr.onload = () => resolve(String(fr.result))
    fr.onerror = reject
    fr.readAsDataURL(file)
  })
}

function formatCPF(v: string){
  const d = v.replace(/\D/g,'').slice(0,11)
  const parts = []
  parts.push(d.slice(0,3))
  if (d.length > 3) parts.push(d.slice(3,6))
  if (d.length > 6) parts.push(d.slice(6,9))
  if (d.length > 9) parts.push(d.slice(9,11))
  if (parts.length <= 1) return parts[0] || ''
  if (parts.length === 2) return `${parts[0]}.${parts[1]}`
  if (parts.length === 3) return `${parts[0]}.${parts[1]}.${parts[2]}`
  return `${parts[0]}.${parts[1]}.${parts[2]}-${parts[3]}`
}

function formatPhone(v: string){
  const d = v.replace(/\D/g,'').slice(0,11)
  if (d.length <= 2) return d
  if (d.length <= 6) return `(${d.slice(0,2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`
  return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`
}
