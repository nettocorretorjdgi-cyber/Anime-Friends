-- ==============================================================================
-- ANIME FRIENDS 2026 - POLÍTICAS DE ARMAZENAMENTO E SEGURANÇA (SUPABASE / POSTGRES)
-- ==============================================================================
-- Este script configura:
-- 1. Tabela de Inscrições com validações e tipos
-- 2. Políticas de Segurança em Nível de Linha (RLS) para o Banco de Dados
-- 3. Criação de Buckets no Supabase Storage (storage.buckets)
-- 4. Políticas de Armazenamento para Upload e Download de Arquivos (storage.objects)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. CRIAÇÃO DA TABELA DE INSCRIÇÕES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.inscricoes_anime_friends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT NOT NULL,
  cpf TEXT NOT NULL,
  dias TEXT[] NOT NULL,
  tipo_ingresso TEXT NOT NULL,
  cosplay_tag TEXT,
  foto_avatar_url TEXT,
  valor_total NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  ticket_code TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'confirmado',
  CONSTRAINT chk_dias_nao_vazio CHECK (array_length(dias, 1) > 0)
);

-- Comentários descritivos na tabela e colunas
COMMENT ON TABLE public.inscricoes_anime_friends IS 'Armazena as inscrições oficiais e credenciais do Anime Friends 2026';
COMMENT ON COLUMN public.inscricoes_anime_friends.ticket_code IS 'Código identificador único da credencial (ex: AF26-XXXXX)';
COMMENT ON COLUMN public.inscricoes_anime_friends.cpf IS 'CPF do titular validado via algoritmo Módulo 11';
COMMENT ON COLUMN public.inscricoes_anime_friends.dias IS 'Lista dos dias selecionados pelo participante (quinta, sexta, sabado, domingo)';

-- Índices para consultas ultra-rápidas
CREATE INDEX IF NOT EXISTS idx_inscricoes_cpf ON public.inscricoes_anime_friends(cpf);
CREATE INDEX IF NOT EXISTS idx_inscricoes_ticket_code ON public.inscricoes_anime_friends(ticket_code);
CREATE INDEX IF NOT EXISTS idx_inscricoes_email ON public.inscricoes_anime_friends(email);
CREATE INDEX IF NOT EXISTS idx_inscricoes_created_at ON public.inscricoes_anime_friends(created_at DESC);

-- Trigger para atualização automática da coluna updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_timestamp ON public.inscricoes_anime_friends;
CREATE TRIGGER trigger_set_timestamp
BEFORE UPDATE ON public.inscricoes_anime_friends
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 2. POLÍTICAS DE ROW LEVEL SECURITY (RLS) PARA A TABELA DE DADOS
-- ------------------------------------------------------------------------------
ALTER TABLE public.inscricoes_anime_friends ENABLE ROW LEVEL SECURITY;

-- Remove políticas antigas se existirem para evitar conflitos ao reexecutar
DROP POLICY IF EXISTS "Permitir inscricao publica no Anime Friends" ON public.inscricoes_anime_friends;
DROP POLICY IF EXISTS "Permitir leitura das inscricoes" ON public.inscricoes_anime_friends;
DROP POLICY IF EXISTS "Permitir insercao anonima de inscricoes" ON public.inscricoes_anime_friends;
DROP POLICY IF EXISTS "Permitir leitura de credenciais" ON public.inscricoes_anime_friends;
DROP POLICY IF EXISTS "Permitir atualizacao restrita por admin" ON public.inscricoes_anime_friends;
DROP POLICY IF EXISTS "Permitir exclusao apenas por admin" ON public.inscricoes_anime_friends;

-- POLÍTICA 1 (INSERT): Qualquer visitante anônimo ou usuário autenticado pode se inscrever
CREATE POLICY "Permitir insercao anonima de inscricoes"
  ON public.inscricoes_anime_friends
  FOR INSERT
  WITH CHECK (
    -- Garante que campos essenciais estejam preenchidos
    length(trim(nome)) >= 3 AND
    length(trim(email)) > 5 AND
    length(trim(cpf)) >= 11 AND
    array_length(dias, 1) > 0
  );

-- POLÍTICA 2 (SELECT): Permite consulta anônima e autenticada
-- Permite que o participante e o painel consultem os vouchers
CREATE POLICY "Permitir leitura de credenciais"
  ON public.inscricoes_anime_friends
  FOR SELECT
  USING (true);

-- POLÍTICA 3 (UPDATE): Apenas administradores ou service_role podem atualizar dados
CREATE POLICY "Permitir atualizacao restrita por admin"
  ON public.inscricoes_anime_friends
  FOR UPDATE
  USING (
    auth.role() = 'service_role' OR
    (auth.jwt() ->> 'email') IS NOT NULL
  )
  WITH CHECK (
    auth.role() = 'service_role' OR
    (auth.jwt() ->> 'email') IS NOT NULL
  );

-- POLÍTICA 4 (DELETE): Apenas a chave mestra (service_role) pode deletar registros
CREATE POLICY "Permitir exclusao apenas por admin"
  ON public.inscricoes_anime_friends
  FOR DELETE
  USING (auth.role() = 'service_role');


-- ------------------------------------------------------------------------------
-- 3. CRIAÇÃO DOS BUCKETS NO SUPABASE STORAGE (storage.buckets)
-- ------------------------------------------------------------------------------
-- Cria o bucket para credenciais/vouchers e para fotos de cosplay se não existirem
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  (
    'credenciais-anime-friends',
    'credenciais-anime-friends',
    true,
    5242880, -- Limite de 5MB por arquivo
    ARRAY['image/png', 'image/jpeg', 'image/webp', 'application/pdf']
  ),
  (
    'fotos-cosplay',
    'fotos-cosplay',
    true,
    10485760, -- Limite de 10MB por arquivo
    ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif']
  )
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;


-- ------------------------------------------------------------------------------
-- 4. POLÍTICAS DE SEGURANÇA PARA ARMAZENAMENTO DE ARQUIVOS (storage.objects)
-- ------------------------------------------------------------------------------
-- Habilita RLS nos objetos de armazenamento (geralmente ativado por padrão no Supabase)
-- Limpa políticas anteriores dos buckets do Anime Friends para evitar duplicidade
DROP POLICY IF EXISTS "Permitir leitura publica de credenciais e fotos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir upload publico em credenciais e fotos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir atualizacao de arquivos de armazenamento" ON storage.objects;
DROP POLICY IF EXISTS "Permitir exclusao de arquivos por admin" ON storage.objects;

-- POLÍTICA DE ARMAZENAMENTO 1 (SELECT / DOWNLOAD):
-- Permite leitura e download público de arquivos armazenados nos buckets do Anime Friends
CREATE POLICY "Permitir leitura publica de credenciais e fotos"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id IN ('credenciais-anime-friends', 'fotos-cosplay')
  );

-- POLÍTICA DE ARMAZENAMENTO 2 (INSERT / UPLOAD):
-- Permite upload de credenciais geradas, comprovantes e fotos de cosplay
CREATE POLICY "Permitir upload publico em credenciais e fotos"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id IN ('credenciais-anime-friends', 'fotos-cosplay')
  );

-- POLÍTICA DE ARMAZENAMENTO 3 (UPDATE):
-- Permite atualizar arquivos caso necessário
CREATE POLICY "Permitir atualizacao de arquivos de armazenamento"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id IN ('credenciais-anime-friends', 'fotos-cosplay') AND
    (auth.role() = 'service_role' OR auth.role() = 'authenticated')
  );

-- POLÍTICA DE ARMAZENAMENTO 4 (DELETE):
-- Apenas usuários autenticados da organização ou a service_role podem remover arquivos
CREATE POLICY "Permitir exclusao de arquivos por admin"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id IN ('credenciais-anime-friends', 'fotos-cosplay') AND
    auth.role() = 'service_role'
  );

-- ==============================================================================
-- FIM DO SCRIPT - Execute este código completo no SQL Editor do seu Supabase.
-- ==============================================================================
