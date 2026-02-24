import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function Home() {
  const router = useRouter()
  const [showAdminModal, setShowAdminModal] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [adminError, setAdminError] = useState('')

  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'golden2024'

  const handleAdminAccess = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      router.push('/admin')
    } else {
      setAdminError('Senha incorreta. Tente novamente.')
      setAdminPassword('')
    }
  }

  return (
    <>
      <Head>
        <title>Golden + Saúde | Cadastro de Prestadoras</title>
        <meta name="description" content="Plataforma de cadastro de prestadoras de saúde Golden+" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-animated flex flex-col">
        {/* Header */}
        <header className="px-6 py-5 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-900/40">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="white"/>
              </svg>
            </div>
            <div>
              <span className="font-display text-lg font-bold gold-text">Golden</span>
              <span className="text-amber-500 font-display text-lg font-bold"> + </span>
              <span className="font-display text-lg font-bold text-emerald-400">Saúde</span>
            </div>
          </div>

          <button
            onClick={() => setShowAdminModal(true)}
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-amber-400 border border-slate-700 hover:border-amber-600/50 rounded-lg px-4 py-2 transition-all duration-200 group"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Área Admin
          </button>
        </header>

        {/* Hero */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
          <div className="text-center max-w-2xl mx-auto animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"/>
              <span className="text-amber-400 text-xs font-medium tracking-wider uppercase">Plataforma de Saúde</span>
            </div>

            <h1 className="font-display text-5xl md:text-6xl font-bold mb-4 leading-tight">
              Cadastre-se como{' '}
              <span className="gold-text">Prestadora</span>{' '}
              <span className="text-emerald-400">de Saúde</span>
            </h1>

            <p className="text-slate-400 text-lg mb-12 leading-relaxed">
              Faça parte da rede Golden+ e amplie seu alcance. 
              Cadastre seu perfil profissional em poucos minutos.
            </p>

            {/* Action cards */}
            <div className="grid md:grid-cols-3 gap-4 mb-10">
              {[
                { icon: '🏥', title: 'Perfil Completo', desc: 'Dados profissionais e experiência' },
                { icon: '📋', title: 'Especializações', desc: 'Área de atuação e formações' },
                { icon: '⭐', title: 'Referências', desc: 'Histórico e contatos anteriores' },
              ].map((item, i) => (
                <div key={i} className={`card p-5 text-left animate-slide-up delay-${(i+1)*100}`}>
                  <div className="text-2xl mb-3">{item.icon}</div>
                  <div className="font-semibold text-slate-200 text-sm mb-1">{item.title}</div>
                  <div className="text-slate-500 text-xs">{item.desc}</div>
                </div>
              ))}
            </div>

            <button
              onClick={() => router.push('/cadastro')}
              className="btn-primary text-base px-10 py-4 inline-flex items-center gap-3 group"
            >
              <span>Iniciar Cadastro</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>

            <p className="text-slate-600 text-xs mt-5">
              Gratuito • Sem compromisso • Aprovação em até 48h
            </p>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-5 text-center text-slate-700 text-xs border-t border-slate-800/50">
          © 2024 Golden + Saúde. Todos os direitos reservados.
        </footer>
      </div>

      {/* Admin Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="card p-8 w-full max-w-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <div>
                <h2 className="font-display font-bold text-slate-100">Área Administrativa</h2>
                <p className="text-slate-500 text-xs">Acesso restrito</p>
              </div>
            </div>

            <label className="input-label">Senha de acesso</label>
            <input
              type="password"
              className="input-field mb-3"
              placeholder="••••••••"
              value={adminPassword}
              onChange={(e) => { setAdminPassword(e.target.value); setAdminError('') }}
              onKeyDown={(e) => e.key === 'Enter' && handleAdminAccess()}
              autoFocus
            />
            {adminError && (
              <p className="text-red-400 text-xs mb-3 flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                {adminError}
              </p>
            )}

            <div className="flex gap-3 mt-2">
              <button onClick={() => { setShowAdminModal(false); setAdminPassword(''); setAdminError('') }} className="btn-secondary flex-1 text-sm py-2.5">
                Cancelar
              </button>
              <button onClick={handleAdminAccess} className="btn-primary flex-1 text-sm py-2.5">
                Entrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
