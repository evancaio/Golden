# 🏥 Golden + Saúde

Sistema de cadastro de prestadoras de saúde — Next.js + Supabase + Vercel.

---

## 🚀 Deploy em 4 passos

### 1. Configurar o Supabase (banco de dados gratuito)

1. Acesse [supabase.com](https://supabase.com) e crie uma conta gratuita
2. Crie um novo projeto
3. Vá em **SQL Editor** → clique em **New Query**
4. Cole o conteúdo do arquivo `supabase-schema.sql` e clique em **Run**
5. Vá em **Project Settings → API** e copie:
   - `Project URL` → será seu `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → será seu `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. Criar o repositório no GitHub

```bash
git init
git add .
git commit -m "feat: Golden + Saúde inicial"
git remote add origin https://github.com/SEU_USUARIO/golden-saude.git
git push -u origin main
```

### 3. Deploy no Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login com o GitHub
2. Clique em **"Add New Project"** e selecione o repositório `golden-saude`
3. Em **"Environment Variables"**, adicione:

| Nome | Valor |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do seu projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | chave anon do Supabase |
| `NEXT_PUBLIC_ADMIN_PASSWORD` | sua senha admin (ex: `GoldenSaude@2024`) |

4. Clique em **Deploy** e aguarde ~1 minuto ✅

### 4. Pronto!

Seu sistema estará disponível em `https://golden-saude.vercel.app` (ou similar).

---

## 🖥️ Rodando localmente

```bash
# 1. Instalar dependências
npm install

# 2. Criar arquivo de variáveis de ambiente
cp .env.local.example .env.local
# Edite o .env.local com suas credenciais Supabase

# 3. Rodar o servidor
npm run dev

# Acesse: http://localhost:3000
```

---

## 📋 Funcionalidades

### Página Inicial (`/`)
- Apresentação do sistema Golden + Saúde
- Botão **"Iniciar Cadastro"** → leva ao formulário
- Botão **"Área Admin"** → abre modal de senha

### Formulário de Cadastro (`/cadastro`) — 5 etapas
1. **Dados Pessoais**: Nome, CPF/CNPJ, especialidade, e-mail, telefone, WhatsApp, experiência
2. **Localização**: CEP (busca automática), endereço completo
3. **Formação**: Registro profissional, cursos e especializações (múltiplos)
4. **Referências**: Contatos anteriores com nome e telefone (múltiplos)
5. **Foto**: Upload de foto de perfil profissional

### Painel Admin (`/admin`)
- Listagem de todos os cadastros com busca e filtros
- Filtrar por: status (pendente/aprovado/reprovado) e especialidade
- Painel lateral com todos os detalhes do cadastro selecionado
- Ações: **Aprovar**, **Reprovar**, **Marcar como Pendente**, **Excluir**
- Estatísticas em tempo real (total, pendentes, aprovados, reprovados)

---

## 🎨 Tecnologias

- **Next.js 14** — Framework React para Vercel
- **Tailwind CSS** — Estilização
- **Supabase** — Banco de dados PostgreSQL + Storage de imagens
- **react-hot-toast** — Notificações
- **ViaCEP** — Busca automática de endereço por CEP

---

## 🔐 Segurança

> ⚠️ A senha admin está no `.env.local` / variáveis do Vercel. **Não commit o `.env.local` no git!**
> Para maior segurança em produção, considere usar Supabase Auth com autenticação real.
