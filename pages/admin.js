import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export default function Admin() {
  const router = useRouter()
  const [prestadoras, setPrestadoras] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('todos')
  const [filterEsp, setFilterEsp] = useState('todos')
  const [selected, setSelected] = useState(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    loadPrestadoras()
  }, [])

  const loadPrestadoras = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('prestadoras')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setPrestadoras(data || [])
    else toast.error('Erro ao carregar cadastros')
    setLoading(false)
  }

  const updateStatus = async (id, newStatus) => {
    setUpdating(true)
    const { error } = await supabase
      .from('prestadoras')
      .update({ status: newStatus })
      .eq('id', id)

    if (!error) {
      toast.success(`Status atualizado para "${newStatus}"`)
      setPrestadoras(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p))
      if (selected?.id === id) setSelected(prev => ({ ...prev, status: newStatus }))
    } else {
      toast.error('Erro ao atualizar status')
    }
    setUpdating(false)
  }

  const deletePrestadora = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este cadastro?')) return
    const { error } = await supabase.from('prestadoras').delete().eq('id', id)
    if (!error) {
      toast.success('Cadastro removido')
      setPrestadoras(prev => prev.filter(p => p.id !== id))
      setSelected(null)
    } else {
      toast.error('Erro ao excluir')
    }
  }

  const especialidades = ['todos', ...new Set(prestadoras.map(p => p.especialidade).filter(Boolean))]

  const filtered = prestadoras.filter(p => {
    const matchSearch = !search || 
      p.nome_razao_social?.toLowerCase().includes(search.toLowerCase()) ||
      p.email?.toLowerCase().includes(search.toLowerCase()) ||
      p.cidade?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'todos' || p.status === filterStatus
    const matchEsp = filterEsp === 'todos' || p.especialidade === filterEsp
    return matchSearch && matchStatus && matchEsp
  })

  const stats = {
    total: prestadoras.length,
    pendente: prestadoras.filter(p => p.status === 'pendente').length,
    aprovado: prestadoras.filter(p => p.status === 'aprovado').length,
    reprovado: prestadoras.filter(p => p.status === 'reprovado').length,
  }

  const statusColor = (s) => {
    if (s === 'aprovado') return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
    if (s === 'reprovado') return 'text-red-400 bg-red-400/10 border-red-400/20'
    return 'text-amber-400 bg-amber-400/10 border-amber-400/20'
  }

  return (
    <>
      <Head><title>Admin | Golden + Saúde</title></Head>
      <div className="min-h-screen bg-animated flex flex-col">
        {/* Header */}
        <header className="px-6 py-4 border-b border-slate-800/80 flex items-center gap-4">
          <button onClick={() => router.push('/')} className="text-slate-500 hover:text-slate-300 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <span className="font-display font-bold gold-text">Golden</span>
            <span className="text-amber-500 font-bold">+</span>
            <span className="font-display font-bold text-emerald-400">Saúde</span>
          </div>
          <div className="h-4 w-px bg-slate-700"/>
          <span className="text-slate-400 text-sm">Painel Administrativo</span>
          <div className="ml-auto">
            <button onClick={loadPrestadoras} className="text-xs text-slate-500 hover:text-amber-400 flex items-center gap-1.5 transition-colors">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
              </svg>
              Atualizar
            </button>
          </div>
        </header>

        <div className="flex-1 p-6 max-w-7xl mx-auto w-full">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total', value: stats.total, color: 'text-slate-300', bg: 'bg-slate-700/30' },
              { label: 'Pendentes', value: stats.pendente, color: 'text-amber-400', bg: 'bg-amber-400/10' },
              { label: 'Aprovados', value: stats.aprovado, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
              { label: 'Reprovados', value: stats.reprovado, color: 'text-red-400', bg: 'bg-red-400/10' },
            ].map(s => (
              <div key={s.label} className={`card p-4 ${s.bg}`}>
                <div className={`text-2xl font-bold font-display ${s.color}`}>{s.value}</div>
                <div className="text-slate-500 text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="card p-4 mb-5 flex flex-wrap gap-3 items-center">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input className="input-field pl-9 py-2.5 text-xs" placeholder="Buscar por nome, email ou cidade..." value={search} onChange={e => setSearch(e.target.value)}/>
              </div>
            </div>
            <select className="input-field py-2.5 text-xs w-auto" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="todos">Todos os status</option>
              <option value="pendente">Pendente</option>
              <option value="aprovado">Aprovado</option>
              <option value="reprovado">Reprovado</option>
            </select>
            <select className="input-field py-2.5 text-xs w-auto" value={filterEsp} onChange={e => setFilterEsp(e.target.value)}>
              {especialidades.map(e => <option key={e} value={e}>{e === 'todos' ? 'Todas especialidades' : e}</option>)}
            </select>
            <span className="text-slate-600 text-xs">{filtered.length} resultado{filtered.length !== 1 ? 's' : ''}</span>
          </div>

          <div className="flex gap-5">
            {/* List */}
            <div className="flex-1 min-w-0">
              {loading ? (
                <div className="card p-12 text-center">
                  <svg className="animate-spin mx-auto text-amber-600 mb-4" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  <p className="text-slate-500 text-sm">Carregando cadastros...</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="card p-12 text-center">
                  <div className="text-4xl mb-4">🔍</div>
                  <p className="text-slate-400 font-medium mb-1">Nenhum cadastro encontrado</p>
                  <p className="text-slate-600 text-sm">Tente ajustar os filtros</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filtered.map(p => (
                    <div
                      key={p.id}
                      onClick={() => setSelected(selected?.id === p.id ? null : p)}
                      className={`card p-4 cursor-pointer transition-all duration-200 table-row
                        ${selected?.id === p.id ? 'border-amber-500/40 bg-amber-500/5' : 'hover:border-slate-600'}`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-slate-700">
                          {p.foto_url ? (
                            <img src={p.foto_url} alt={p.nome_razao_social} className="w-full h-full object-cover"/>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-sm">
                              {p.nome_razao_social?.charAt(0)?.toUpperCase()}
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-slate-200 text-sm truncate">{p.nome_razao_social}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColor(p.status)}`}>
                              {p.status}
                            </span>
                          </div>
                          <div className="flex gap-3 text-xs text-slate-500 mt-0.5 flex-wrap">
                            <span>{p.especialidade}</span>
                            {p.cidade && <span>• {p.cidade}/{p.estado}</span>}
                            <span>• {p.email}</span>
                          </div>
                        </div>

                        <div className="text-xs text-slate-600 flex-shrink-0 hidden md:block">
                          {new Date(p.created_at).toLocaleDateString('pt-BR')}
                        </div>

                        <svg className={`text-slate-600 flex-shrink-0 transition-transform ${selected?.id === p.id ? 'rotate-90' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 18l6-6-6-6"/>
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Detail Panel */}
            {selected && (
              <div className="w-96 flex-shrink-0 animate-slide-up">
                <div className="card p-6 sticky top-6">
                  {/* Photo & header */}
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-3 bg-slate-700 ring-2 ring-amber-600/20">
                      {selected.foto_url ? (
                        <img src={selected.foto_url} alt={selected.nome_razao_social} className="w-full h-full object-cover"/>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-slate-400">
                          {selected.nome_razao_social?.charAt(0)?.toUpperCase()}
                        </div>
                      )}
                    </div>
                    <h3 className="font-display font-bold text-slate-100 text-lg leading-tight">{selected.nome_razao_social}</h3>
                    <p className="text-amber-400 text-sm mt-1">{selected.especialidade}</p>
                    <span className={`inline-block text-xs px-3 py-1 rounded-full border mt-2 ${statusColor(selected.status)}`}>
                      {selected.status}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="space-y-3 text-xs mb-5">
                    {[
                      { label: 'CPF/CNPJ', value: selected.cpf_cnpj },
                      { label: 'E-mail', value: selected.email },
                      { label: 'Telefone', value: selected.telefone },
                      { label: 'WhatsApp', value: selected.whatsapp },
                      { label: 'Endereço', value: [selected.logradouro, selected.numero, selected.complemento, selected.bairro, selected.cidade, selected.estado].filter(Boolean).join(', ') },
                      { label: 'Registro', value: selected.registro_profissional ? `${selected.conselho || ''} ${selected.registro_profissional}`.trim() : null },
                    ].filter(i => i.value).map(item => (
                      <div key={item.label} className="flex gap-2">
                        <span className="text-slate-600 w-20 flex-shrink-0">{item.label}:</span>
                        <span className="text-slate-300">{item.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Experiência */}
                  {selected.experiencia_profissional && (
                    <div className="mb-4">
                      <p className="text-slate-600 text-xs mb-1">Experiência:</p>
                      <p className="text-slate-400 text-xs leading-relaxed bg-slate-900/50 rounded-lg p-3">{selected.experiencia_profissional}</p>
                    </div>
                  )}

                  {/* Formações */}
                  {selected.formacao?.filter(f => f.curso)?.length > 0 && (
                    <div className="mb-4">
                      <p className="text-slate-600 text-xs mb-2">Formações:</p>
                      <div className="space-y-1.5">
                        {selected.formacao.filter(f => f.curso).map((f, i) => (
                          <div key={i} className="bg-slate-900/50 rounded-lg p-2.5 text-xs">
                            <span className="text-slate-300 font-medium">{f.curso}</span>
                            {f.instituicao && <span className="text-slate-500"> • {f.instituicao}</span>}
                            {f.ano_conclusao && <span className="text-slate-600"> ({f.ano_conclusao})</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Referências */}
                  {selected.referencias?.filter(r => r.nome)?.length > 0 && (
                    <div className="mb-5">
                      <p className="text-slate-600 text-xs mb-2">Referências:</p>
                      <div className="space-y-1.5">
                        {selected.referencias.filter(r => r.nome).map((r, i) => (
                          <div key={i} className="bg-slate-900/50 rounded-lg p-2.5 text-xs">
                            <span className="text-slate-300 font-medium">{r.nome}</span>
                            {r.relacao && <span className="text-slate-500"> • {r.relacao}</span>}
                            {r.telefone && <span className="text-slate-600 block mt-0.5">{r.telefone}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="border-t border-slate-700/50 pt-4 space-y-2">
                    <p className="text-slate-600 text-xs mb-3">Alterar status:</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => updateStatus(selected.id, 'aprovado')}
                        disabled={updating || selected.status === 'aprovado'}
                        className="text-xs py-2 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 hover:bg-emerald-600/30 disabled:opacity-40 transition-all"
                      >
                        ✓ Aprovar
                      </button>
                      <button
                        onClick={() => updateStatus(selected.id, 'reprovado')}
                        disabled={updating || selected.status === 'reprovado'}
                        className="text-xs py-2 rounded-lg bg-red-600/20 text-red-400 border border-red-600/30 hover:bg-red-600/30 disabled:opacity-40 transition-all"
                      >
                        ✕ Reprovar
                      </button>
                    </div>
                    <button
                      onClick={() => updateStatus(selected.id, 'pendente')}
                      disabled={updating || selected.status === 'pendente'}
                      className="w-full text-xs py-2 rounded-lg bg-amber-600/20 text-amber-400 border border-amber-600/30 hover:bg-amber-600/30 disabled:opacity-40 transition-all"
                    >
                      ↺ Marcar como Pendente
                    </button>
                    <button
                      onClick={() => deletePrestadora(selected.id)}
                      className="w-full text-xs py-2 rounded-lg bg-slate-700/50 text-slate-500 hover:text-red-400 border border-slate-700 hover:border-red-500/30 transition-all"
                    >
                      🗑 Excluir cadastro
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
