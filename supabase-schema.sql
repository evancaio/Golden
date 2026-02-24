-- ============================================================
-- Golden + Saúde - Script SQL para Supabase
-- Execute no SQL Editor do painel Supabase
-- ============================================================

-- Tabela principal de prestadoras
CREATE TABLE IF NOT EXISTS prestadoras (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Dados pessoais
  nome_razao_social TEXT NOT NULL,
  cpf_cnpj TEXT NOT NULL,
  especialidade TEXT,
  email TEXT NOT NULL,
  telefone TEXT NOT NULL,
  whatsapp TEXT,
  experiencia_profissional TEXT,
  
  -- Endereço
  cep TEXT,
  logradouro TEXT,
  numero TEXT,
  complemento TEXT,
  bairro TEXT,
  cidade TEXT,
  estado TEXT,
  
  -- Registro profissional
  registro_profissional TEXT,
  conselho TEXT,
  
  -- JSON arrays
  formacao JSONB DEFAULT '[]'::JSONB,
  referencias JSONB DEFAULT '[]'::JSONB,
  
  -- Foto e status
  foto_url TEXT,
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado', 'reprovado'))
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_prestadoras_status ON prestadoras(status);
CREATE INDEX IF NOT EXISTS idx_prestadoras_especialidade ON prestadoras(especialidade);
CREATE INDEX IF NOT EXISTS idx_prestadoras_created_at ON prestadoras(created_at DESC);

-- Row Level Security (RLS) - permitir leitura e escrita pública
ALTER TABLE prestadoras ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON prestadoras
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert" ON prestadoras
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update" ON prestadoras
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete" ON prestadoras
  FOR DELETE USING (true);

-- ============================================================
-- Storage bucket para fotos de perfil
-- Execute no SQL Editor ou crie manualmente no painel Supabase:
-- Storage > New bucket > "fotos-prestadoras" > Public
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('fotos-prestadoras', 'fotos-prestadoras', true)
ON CONFLICT DO NOTHING;

CREATE POLICY "Allow public upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'fotos-prestadoras');

CREATE POLICY "Allow public read storage" ON storage.objects
  FOR SELECT USING (bucket_id = 'fotos-prestadoras');
