import { useState, useRef } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

const STEPS = [
  { id: 1, title: 'Dados Pessoais', icon: '👤' },
  { id: 2, title: 'Localização', icon: '📍' },
  { id: 3, title: 'Formação', icon: '🎓' },
  { id: 4, title: 'Referências', icon: '⭐' },
  { id: 5, title: 'Foto', icon: '📸' },
]

const ESPECIALIDADES = [
  'Medicina Geral', 'Cardiologia', 'Pediatria', 'Ortopedia', 'Neurologia',
  'Ginecologia', 'Dermatologia', 'Psiquiatria', 'Oftalmologia', 'Oncologia',
  'Enfermagem', 'Fisioterapia', 'Nutrição', 'Psicologia', 'Fonoaudiologia',
  'Odontologia', 'Farmácia', 'Biomedicina', 'Radiologia', 'Outro'
]

export default function Cadastro() {
  const router = useRouter()
  const fileInputRef = useRef(null)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)

  const [form, setForm] = useState({
    // Step 1 - Dados pessoais
    nome_razao_social: '',
    cpf_cnpj: '',
    especialidade: '',
    email: '',
    telefone: '',
    whatsapp: '',
    experiencia_profissional: '',
    // Step 2 - Localização
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    // Step 3 - Formação
    formacao: [{ instituicao: '', curso: '', ano_conclusao: '' }],
    registro_profissional: '',
    conselho: '',
    // Step 4 - Referências
    referencias: [{ nome: '', telefone: '', relacao: '' }],
    // Step 5 - Foto
    foto_file: null,
    foto_url: '',
  })

  const set = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

  // Array helpers
  const addFormacao = () => set('formacao', [...form.formacao, { instituicao: '', curso: '', ano_conclusao: '' }])
  const removeFormacao = (i) => set('formacao', form.formacao.filter((_, idx) => idx !== i))
  const updateFormacao = (i, key, val) => {
    const arr = [...form.formacao]
    arr[i][key] = val
    set('formacao', arr)
  }

  const addReferencia = () => set('referencias', [...form.referencias, { nome: '', telefone: '', relacao: '' }])
  const removeReferencia = (i) => set('referencias', form.referencias.filter((_, idx) => idx !== i))
  const updateReferencia = (i, key, val) => {
    const arr = [...form.referencias]
    arr[i][key] = val
    set('referencias', arr)
  }

  // CEP lookup
  const buscarCep = async (cep) => {
    const clean = cep.replace(/\D/g, '')
    if (clean.length !== 8) return
    try {
      const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`)
      const data = await res.json()
      if (!data.erro) {
        setForm(prev => ({
          ...prev,
          logradouro: data.logradouro || '',
          bairro: data.bairro || '',
          cidade: data.localidade || '',
          estado: data.uf || '',
        }))
      }
    } catch (e) {}
  }

  // Photo handling
  const handlePhoto = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast.error('Foto deve ter no máximo 5MB'); return }
    set('foto_file', file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  // Step validation
  const validateStep = () => {
    if (step === 1) {
      if (!form.nome_razao_social) { toast.error('Nome é obrigatório'); return false }
      if (!form.cpf_cnpj) { toast.error('CPF/CNPJ é obrigatório'); return false }
      if (!form.especialidade) { toast.error('Especialidade é obrigatória'); return false }
      if (!form.email) { toast.error('E-mail é obrigatório'); return false }
      if (!form.telefone) { toast.error('Telefone é obrigatório'); return false }
    }
    if (step === 2) {
      if (!form.cidade) { toast.error('Cidade é obrigatória'); return false }
      if (!form.estado) { toast.error('Estado é obrigatório'); return false }
    }
    return true
  }

  const next = () => { if (validateStep()) setStep(s => Math.min(s + 1, 5)) }
  const prev = () => setStep(s => Math.max(s - 1, 1))

  const handleSubmit = async () => {
    setLoading(true)
    try {
      let foto_url = ''

      // Upload photo if exists
      if (form.foto_file) {
        const ext = form.foto_file.name.split('.').pop()
        const fileName = `${Date.now()}.${ext}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('fotos-prestadoras')
          .upload(fileName, form.foto_file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('fotos-prestadoras')
          .getPublicUrl(fileName)
        foto_url = publicUrl
      }

      // Insert into DB
      const { error } = await supabase.from('prestadoras').insert({
        nome_razao_social: form.nome_razao_social,
        cpf_cnpj: form.cpf_cnpj,
        especialidade: form.especialidade,
        email: form.email,
        telefone: form.telefone,
        whatsapp: form.whatsapp,
        experiencia_profissional: form.experiencia_profissional,
        cep: form.cep,
        logradouro: form.logradouro,
        numero: form.numero,
        complemento: form.complemento,
        bairro: form.bairro,
        cidade: form.cidade,
        estado: form.estado,
        registro_profissional: form.registro_profissional,
        conselho: form.conselho,
        formacao: form.formacao,
        referencias: form.referencias,
        foto_url,
        status: 'pendente',
        created_at: new Date().toISOString(),
      })

      if (error) throw error

      toast.success('Cadastro realizado com sucesso!')
      router.push('/sucesso')
    } catch (err) {
      console.error(err)
      toast.error('Erro ao enviar cadastro. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Cadastro | Golden + Saúde</title>
      </Head>

      <div className="min-h-screen bg-animated">
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
          <div className="ml-auto text-xs text-slate-500">
            Etapa {step} de {STEPS.length}
          </div>
        </header>

        {/* Progress */}
        <div className="px-6 py-6 max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center gap-2 flex-1">
                <div className={`flex items-center gap-2 ${step >= s.id ? 'opacity-100' : 'opacity-30'} transition-all duration-300`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                    ${step > s.id ? 'bg-emerald-600 text-white' : step === s.id ? 'bg-amber-600 text-white ring-4 ring-amber-600/20' : 'bg-slate-700 text-slate-400'}`}>
                    {step > s.id ? '✓' : s.id}
                  </div>
                  <span className="hidden md:block text-xs text-slate-400 whitespace-nowrap">{s.title}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-px transition-all duration-500 ${step > s.id ? 'bg-emerald-600' : 'bg-slate-700'}`}/>
                )}
              </div>
            ))}
          </div>

          {/* Form Card */}
          <div className="card p-8 animate-fade-in">
            <h2 className="font-display text-2xl font-bold text-slate-100 mb-1">
              {STEPS[step-1].icon} {STEPS[step-1].title}
            </h2>
            <p className="text-slate-500 text-sm mb-8">
              {step === 1 && 'Informações básicas sobre você ou sua empresa'}
              {step === 2 && 'Onde você atende seus pacientes'}
              {step === 3 && 'Sua formação e registros profissionais'}
              {step === 4 && 'Referências profissionais anteriores'}
              {step === 5 && 'Adicione uma foto profissional ao seu perfil'}
            </p>

            {/* STEP 1 - Dados Pessoais */}
            {step === 1 && (
              <div className="grid md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="input-label">Nome / Razão Social *</label>
                  <input className="input-field" placeholder="Nome completo ou razão social" value={form.nome_razao_social} onChange={e => set('nome_razao_social', e.target.value)} />
                </div>

                <div>
                  <label className="input-label">CPF / CNPJ *</label>
                  <input className="input-field" placeholder="000.000.000-00 ou 00.000.000/0000-00" value={form.cpf_cnpj} onChange={e => set('cpf_cnpj', e.target.value)} />
                </div>

                <div>
                  <label className="input-label">Especialidade / Área de Atuação *</label>
                  <select className="input-field" value={form.especialidade} onChange={e => set('especialidade', e.target.value)}>
                    <option value="">Selecione...</option>
                    {ESPECIALIDADES.map(esp => <option key={esp} value={esp}>{esp}</option>)}
                  </select>
                </div>

                <div>
                  <label className="input-label">E-mail *</label>
                  <input className="input-field" type="email" placeholder="email@exemplo.com" value={form.email} onChange={e => set('email', e.target.value)} />
                </div>

                <div>
                  <label className="input-label">Telefone *</label>
                  <input className="input-field" placeholder="(00) 0000-0000" value={form.telefone} onChange={e => set('telefone', e.target.value)} />
                </div>

                <div>
                  <label className="input-label">WhatsApp</label>
                  <input className="input-field" placeholder="(00) 00000-0000" value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} />
                </div>

                <div className="md:col-span-2">
                  <label className="input-label">Experiência Profissional</label>
                  <textarea 
                    className="input-field resize-none" 
                    rows={4} 
                    placeholder="Descreva sua experiência profissional, áreas de atuação, anos de experiência..."
                    value={form.experiencia_profissional} 
                    onChange={e => set('experiencia_profissional', e.target.value)} 
                  />
                </div>
              </div>
            )}

            {/* STEP 2 - Localização */}
            {step === 2 && (
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="input-label">CEP</label>
                  <input 
                    className="input-field" 
                    placeholder="00000-000" 
                    value={form.cep} 
                    onChange={e => {
                      set('cep', e.target.value)
                      if (e.target.value.replace(/\D/g,'').length === 8) buscarCep(e.target.value)
                    }} 
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="input-label">Logradouro</label>
                  <input className="input-field" placeholder="Rua, Avenida, etc." value={form.logradouro} onChange={e => set('logradouro', e.target.value)} />
                </div>

                <div>
                  <label className="input-label">Número</label>
                  <input className="input-field" placeholder="123" value={form.numero} onChange={e => set('numero', e.target.value)} />
                </div>

                <div>
                  <label className="input-label">Complemento</label>
                  <input className="input-field" placeholder="Apto, sala, bloco..." value={form.complemento} onChange={e => set('complemento', e.target.value)} />
                </div>

                <div>
                  <label className="input-label">Bairro</label>
                  <input className="input-field" placeholder="Bairro" value={form.bairro} onChange={e => set('bairro', e.target.value)} />
                </div>

                <div>
                  <label className="input-label">Cidade *</label>
                  <input className="input-field" placeholder="Cidade" value={form.cidade} onChange={e => set('cidade', e.target.value)} />
                </div>

                <div>
                  <label className="input-label">Estado *</label>
                  <select className="input-field" value={form.estado} onChange={e => set('estado', e.target.value)}>
                    <option value="">Selecione...</option>
                    {['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO'].map(uf => (
                      <option key={uf} value={uf}>{uf}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* STEP 3 - Formação */}
            {step === 3 && (
              <div className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="input-label">Registro Profissional (CRM, COREN, etc.)</label>
                    <input className="input-field" placeholder="Número do registro" value={form.registro_profissional} onChange={e => set('registro_profissional', e.target.value)} />
                  </div>
                  <div>
                    <label className="input-label">Conselho</label>
                    <input className="input-field" placeholder="Ex: CRM-SP, COREN-RJ..." value={form.conselho} onChange={e => set('conselho', e.target.value)} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="input-label mb-0">Formações e Cursos</label>
                    <button onClick={addFormacao} className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      Adicionar
                    </button>
                  </div>

                  <div className="space-y-3">
                    {form.formacao.map((f, i) => (
                      <div key={i} className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs text-slate-500 font-medium">Formação #{i + 1}</span>
                          {form.formacao.length > 1 && (
                            <button onClick={() => removeFormacao(i)} className="text-red-400/70 hover:text-red-400 text-xs transition-colors">Remover</button>
                          )}
                        </div>
                        <div className="grid md:grid-cols-3 gap-3">
                          <div className="md:col-span-2">
                            <input className="input-field text-xs" placeholder="Curso / Especialização" value={f.curso} onChange={e => updateFormacao(i, 'curso', e.target.value)} />
                          </div>
                          <input className="input-field text-xs" placeholder="Ano de conclusão" value={f.ano_conclusao} onChange={e => updateFormacao(i, 'ano_conclusao', e.target.value)} />
                          <div className="md:col-span-3">
                            <input className="input-field text-xs" placeholder="Instituição" value={f.instituicao} onChange={e => updateFormacao(i, 'instituicao', e.target.value)} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4 - Referências */}
            {step === 4 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-slate-400 text-sm">Adicione referências profissionais que possam ser contatadas</p>
                  <button onClick={addReferencia} className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors whitespace-nowrap">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Adicionar
                  </button>
                </div>

                <div className="space-y-3">
                  {form.referencias.map((r, i) => (
                    <div key={i} className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs text-slate-500 font-medium">Referência #{i + 1}</span>
                        {form.referencias.length > 1 && (
                          <button onClick={() => removeReferencia(i)} className="text-red-400/70 hover:text-red-400 text-xs transition-colors">Remover</button>
                        )}
                      </div>
                      <div className="grid md:grid-cols-3 gap-3">
                        <div className="md:col-span-2">
                          <input className="input-field text-xs" placeholder="Nome completo" value={r.nome} onChange={e => updateReferencia(i, 'nome', e.target.value)} />
                        </div>
                        <input className="input-field text-xs" placeholder="Telefone" value={r.telefone} onChange={e => updateReferencia(i, 'telefone', e.target.value)} />
                        <div className="md:col-span-3">
                          <input className="input-field text-xs" placeholder="Relação / Cargo (ex: Diretor do Hospital X)" value={r.relacao} onChange={e => updateReferencia(i, 'relacao', e.target.value)} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 5 - Foto */}
            {step === 5 && (
              <div className="flex flex-col items-center">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="upload-zone w-full max-w-sm mb-6"
                >
                  {previewUrl ? (
                    <div className="flex flex-col items-center gap-3">
                      <img src={previewUrl} alt="Preview" className="w-32 h-32 rounded-full object-cover border-4 border-amber-600/30 shadow-xl shadow-amber-900/30"/>
                      <p className="text-slate-400 text-sm">Clique para trocar a foto</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3 py-4">
                      <div className="w-20 h-20 rounded-full bg-slate-700/60 flex items-center justify-center">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="1.5">
                          <circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-slate-300 font-medium mb-1">Clique para fazer upload</p>
                        <p className="text-slate-500 text-xs">JPG, PNG ou WEBP • Máx 5MB</p>
                      </div>
                    </div>
                  )}
                </div>
                <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handlePhoto}/>

                {/* Summary */}
                <div className="card p-5 w-full max-w-sm">
                  <h3 className="text-slate-300 font-semibold text-sm mb-3">Resumo do Cadastro</h3>
                  <div className="space-y-2 text-xs text-slate-400">
                    <div className="flex justify-between"><span>Nome:</span><span className="text-slate-300 font-medium truncate ml-4">{form.nome_razao_social || '—'}</span></div>
                    <div className="flex justify-between"><span>Especialidade:</span><span className="text-slate-300 font-medium">{form.especialidade || '—'}</span></div>
                    <div className="flex justify-between"><span>Cidade:</span><span className="text-slate-300 font-medium">{form.cidade ? `${form.cidade}/${form.estado}` : '—'}</span></div>
                    <div className="flex justify-between"><span>Formações:</span><span className="text-slate-300 font-medium">{form.formacao.filter(f => f.curso).length}</span></div>
                    <div className="flex justify-between"><span>Referências:</span><span className="text-slate-300 font-medium">{form.referencias.filter(r => r.nome).length}</span></div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3 mt-8 pt-6 border-t border-slate-700/50">
              {step > 1 && (
                <button onClick={prev} className="btn-secondary flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                  Voltar
                </button>
              )}
              <div className="flex-1"/>
              {step < 5 ? (
                <button onClick={next} className="btn-primary flex items-center gap-2">
                  Próximo
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={loading} className="btn-primary flex items-center gap-2 min-w-[140px] justify-center">
                  {loading ? (
                    <>
                      <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                      </svg>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                      Finalizar Cadastro
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
