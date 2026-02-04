# cadastro-homecare

Projeto Next.js (App Router) para cadastro de prestadores Homecare, pronto para deploy na Vercel.

Principais features:
- Formulário responsivo (mobile-first)
- Upload de foto (JPG/PNG) salvo em `public/uploads`
- Persistência simples em `data/cadastros.json`
- Painel admin em `/admin` listando cadastros

Pré-requisitos
- Node.js 18+
- npm

Rodando localmente
1. Instale dependências:

```bash
npm install
```

2. Crie `.env.local` a partir de `.env.example` e ajuste `NEXT_PUBLIC_BASE_URL` se necessário.

3. Rode em modo de desenvolvimento:

```bash
npm run dev
```

Abrir: http://localhost:3000

Configuração para produção / Vercel
1. Crie um repositório no GitHub e faça push do projeto.
2. No Vercel, importe do GitHub e conecte o projeto.
3. Configure variáveis (se necessário):
- `NEXT_PUBLIC_BASE_URL` — URL pública (ex: https://seu-site.vercel.app)
- `UPLOAD_DIR` — opcional, por padrão `public/uploads`.

Observações sobre storage
- Salvar arquivos no filesystem em Vercel é efêmero. Para produção real, prefira um serviço de blob (S3, Google Cloud Storage, etc.).

Estrutura relevante
- `app/` — pages e componentes do Next App Router
- `app/api/cadastro/route.ts` — endpoint POST/GET para cadastros
- `data/cadastros.json` — armazenamento simples em JSON
- `public/uploads` — imagens enviadas

Commit inicial
```bash
git init
git add .
git commit -m "chore: initial project cadastro-homecare"
```
# cadastro-homecare

Projeto Next.js (App Router) para cadastro de prestadores Homecare — frontend, backend, upload de imagem e persistência simples.

Principais pontos:
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Uploads salvos em `public/uploads` (ou `UPLOAD_DIR`)
- Persistência via JSON em `data/cadastros.json` (fallback). Existe espaço para integração com Google Sheets via variáveis de ambiente.

Rodando localmente

1. Instale dependências

```bash
npm install
```

2. Variáveis de ambiente

Copie `.env.example` para `.env.local` e ajuste `NEXT_PUBLIC_BASE_URL` (por exemplo `http://localhost:3000`) e outras variáveis se for usar Google Sheets.

3. Rodar em modo dev

```bash
npm run dev
```

Endpoints

- `POST /api/cadastro` — recebe JSON com campos do formulário. Aceita `foto` como Data URL (base64).
- `GET  /api/cadastro` — retorna lista de cadastros.

Deploy na Vercel

1. Crie um repositório no GitHub e envie o projeto.
2. Conecte o repositório na Vercel.
3. Defina as variáveis de ambiente seguindo `.env.example` no painel Vercel.
4. Se usar uploads persistentes em produção, prefira conectar um storage externo (S3, Cloud Storage) ou Google Sheets/DB — escrever em `public/uploads` não persistirá entre instâncias serverless.

Observações

- A implementação salva imagens em `public/uploads` para simplicidade; em produção serverless é recomendado usar blob storage.
- A persistência atual é via JSON (`data/cadastros.json`) — adequada para demonstrações e local, mas troque por DB/Sheets para produção.
