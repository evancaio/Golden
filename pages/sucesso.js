import { useRouter } from 'next/router'
import Head from 'next/head'

export default function Sucesso() {
  const router = useRouter()

  return (
    <>
      <Head><title>Cadastro Enviado | Golden + Saúde</title></Head>
      <div className="min-h-screen bg-animated flex items-center justify-center p-6">
        <div className="text-center max-w-md animate-fade-in">
          {/* Success icon */}
          <div className="w-24 h-24 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mx-auto mb-8 animate-slide-up">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>

          <h1 className="font-display text-4xl font-bold text-slate-100 mb-4">
            Cadastro <span className="text-emerald-400">Enviado!</span>
          </h1>
          <p className="text-slate-400 text-lg mb-3">
            Seu cadastro foi recebido com sucesso.
          </p>
          <p className="text-slate-500 text-sm mb-10">
            Nossa equipe irá analisar suas informações e entraremos em contato em até <strong className="text-amber-400">48 horas</strong>.
          </p>

          <div className="card p-5 mb-8 text-left">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <div>
                <p className="text-slate-300 text-sm font-medium mb-1">Próximos passos</p>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Você receberá um e-mail de confirmação. Fique atento ao seu WhatsApp para atualizações sobre o processo de aprovação.
                </p>
              </div>
            </div>
          </div>

          <button onClick={() => router.push('/')} className="btn-secondary inline-flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Voltar ao início
          </button>
        </div>
      </div>
    </>
  )
}
