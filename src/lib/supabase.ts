import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { RegistrationFormData, RegistrationRecord, SupabaseConfig } from '../types';

const STORAGE_KEY_CONFIG = 'anime_friends_supabase_config';
const STORAGE_KEY_RECORDS = 'anime_friends_local_records';

/**
 * Recupera as credenciais atuais do Supabase
 */
export function getSupabaseConfig(): SupabaseConfig {
  // 1. Verifica se o usuário salvou credenciais manuais no navegador
  const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.url && parsed.anonKey) {
        return {
          url: parsed.url,
          anonKey: parsed.anonKey,
          isConfigured: true,
        };
      }
    } catch {
      // Ignora erro de parse
    }
  }

  // 2. Verifica variáveis de ambiente
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (envUrl && envKey && !envUrl.includes('your-project-id')) {
    return {
      url: envUrl,
      anonKey: envKey,
      isConfigured: true,
    };
  }

  return {
    url: '',
    anonKey: '',
    isConfigured: false,
  };
}

/**
 * Salva credenciais personalizadas no localStorage
 */
export function saveCustomSupabaseConfig(url: string, anonKey: string): void {
  const cleanUrl = url.trim().replace(/\/+$/, '');
  const cleanKey = anonKey.trim();
  localStorage.setItem(
    STORAGE_KEY_CONFIG,
    JSON.stringify({ url: cleanUrl, anonKey: cleanKey })
  );
}

/**
 * Remove credenciais personalizadas
 */
export function clearCustomSupabaseConfig(): void {
  localStorage.removeItem(STORAGE_KEY_CONFIG);
}

/**
 * Instancia ou obtém o cliente Supabase
 */
export function getSupabaseClient(): SupabaseClient | null {
  const config = getSupabaseConfig();
  if (!config.isConfigured || !config.url || !config.anonKey) {
    return null;
  }

  try {
    return createClient(config.url, config.anonKey, {
      auth: {
        persistSession: false,
      },
    });
  } catch (err) {
    console.error('Erro ao inicializar Supabase Client:', err);
    return null;
  }
}

/**
 * Testa a conexão com o Supabase
 */
export async function testSupabaseConnection(): Promise<{
  success: boolean;
  message: string;
  tableExists?: boolean;
}> {
  const client = getSupabaseClient();
  const config = getSupabaseConfig();

  if (!client || !config.isConfigured) {
    return {
      success: false,
      message: 'Credenciais do Supabase não configuradas (URL ou Anon Key vazias).',
    };
  }

  try {
    // Tenta consultar a tabela de inscrições
    const { data, error } = await client
      .from('inscricoes_anime_friends')
      .select('id')
      .limit(1);

    if (error) {
      // Código 42P01 indica que a tabela ainda não foi criada no banco
      if (error.code === '42P01' || error.message.includes('does not exist') || error.message.includes('relation "public.inscricoes_anime_friends" does not exist')) {
        return {
          success: true,
          tableExists: false,
          message: 'Conectado ao Supabase com sucesso! A tabela "inscricoes_anime_friends" ainda precisa ser criada.',
        };
      }
      return {
        success: false,
        message: `Falha na requisição ao Supabase: ${error.message}`,
      };
    }

    return {
      success: true,
      tableExists: true,
      message: `Conexão bem sucedida com o banco Supabase! Tabela ativa com ${data?.length !== undefined ? 'acesso liberado' : 'sucesso'}.`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Erro de conexão: ${err.message || 'Verifique a URL e a Anon Key informadas.'}`,
    };
  }
}

/**
 * Script SQL Completo com Tabelas, RLS e Políticas de Armazenamento (Storage)
 */
export const SUPABASE_SQL_SCRIPT = `-- ==============================================================================
-- ANIME FRIENDS 2026 - POLÍTICAS DE ARMAZENAMENTO E SEGURANÇA (SUPABASE / POSTGRES)
-- ==============================================================================

-- 1. CRIAÇÃO DA TABELA DE INSCRIÇÕES
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

-- Índices para buscas rápidas
CREATE INDEX IF NOT EXISTS idx_inscricoes_cpf ON public.inscricoes_anime_friends(cpf);
CREATE INDEX IF NOT EXISTS idx_inscricoes_ticket_code ON public.inscricoes_anime_friends(ticket_code);
CREATE INDEX IF NOT EXISTS idx_inscricoes_email ON public.inscricoes_anime_friends(email);
CREATE INDEX IF NOT EXISTS idx_inscricoes_created_at ON public.inscricoes_anime_friends(created_at DESC);

-- Trigger para updated_at automático
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

-- 2. POLÍTICAS DE RLS PARA A TABELA DE DADOS
ALTER TABLE public.inscricoes_anime_friends ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir insercao anonima de inscricoes" ON public.inscricoes_anime_friends;
DROP POLICY IF EXISTS "Permitir leitura de credenciais" ON public.inscricoes_anime_friends;
DROP POLICY IF EXISTS "Permitir atualizacao restrita por admin" ON public.inscricoes_anime_friends;
DROP POLICY IF EXISTS "Permitir exclusao apenas por admin" ON public.inscricoes_anime_friends;

CREATE POLICY "Permitir insercao anonima de inscricoes"
  ON public.inscricoes_anime_friends
  FOR INSERT
  WITH CHECK (
    length(trim(nome)) >= 3 AND
    length(trim(email)) > 5 AND
    length(trim(cpf)) >= 11 AND
    array_length(dias, 1) > 0
  );

CREATE POLICY "Permitir leitura de credenciais"
  ON public.inscricoes_anime_friends
  FOR SELECT
  USING (true);

CREATE POLICY "Permitir atualizacao restrita por admin"
  ON public.inscricoes_anime_friends
  FOR UPDATE
  USING (auth.role() = 'service_role' OR (auth.jwt() ->> 'email') IS NOT NULL)
  WITH CHECK (auth.role() = 'service_role' OR (auth.jwt() ->> 'email') IS NOT NULL);

CREATE POLICY "Permitir exclusao apenas por admin"
  ON public.inscricoes_anime_friends
  FOR DELETE
  USING (auth.role() = 'service_role');

-- 3. CRIAÇÃO DOS BUCKETS NO SUPABASE STORAGE (storage.buckets)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  (
    'credenciais-anime-friends',
    'credenciais-anime-friends',
    true,
    5242880,
    ARRAY['image/png', 'image/jpeg', 'image/webp', 'application/pdf']
  ),
  (
    'fotos-cosplay',
    'fotos-cosplay',
    true,
    10485760,
    ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif']
  )
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 4. POLÍTICAS DE ARMAZENAMENTO PARA UPLOAD E DOWNLOAD (storage.objects)
DROP POLICY IF EXISTS "Permitir leitura publica de credenciais e fotos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir upload publico em credenciais e fotos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir atualizacao de arquivos de armazenamento" ON storage.objects;
DROP POLICY IF EXISTS "Permitir exclusao de arquivos por admin" ON storage.objects;

CREATE POLICY "Permitir leitura publica de credenciais e fotos"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('credenciais-anime-friends', 'fotos-cosplay'));

CREATE POLICY "Permitir upload publico em credenciais e fotos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id IN ('credenciais-anime-friends', 'fotos-cosplay'));

CREATE POLICY "Permitir atualizacao de arquivos de armazenamento"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id IN ('credenciais-anime-friends', 'fotos-cosplay') AND
    (auth.role() = 'service_role' OR auth.role() = 'authenticated')
  );

CREATE POLICY "Permitir exclusao de arquivos por admin"
  ON storage.objects FOR DELETE
  USING (
    bucket_id IN ('credenciais-anime-friends', 'fotos-cosplay') AND
    auth.role() = 'service_role'
  );
`;

export const STORAGE_ONLY_SQL_SCRIPT = `-- ==============================================================================
-- SOMENTE POLÍTICAS DE ARMAZENAMENTO (SUPABASE STORAGE)
-- ==============================================================================

-- 1. Criar buckets de armazenamento
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('credenciais-anime-friends', 'credenciais-anime-friends', true, 5242880, ARRAY['image/png', 'image/jpeg', 'image/webp', 'application/pdf']),
  ('fotos-cosplay', 'fotos-cosplay', true, 10485760, ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Políticas de Leitura Pública no Storage
DROP POLICY IF EXISTS "Permitir leitura publica de credenciais e fotos" ON storage.objects;
CREATE POLICY "Permitir leitura publica de credenciais e fotos"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('credenciais-anime-friends', 'fotos-cosplay'));

-- 3. Políticas de Upload no Storage
DROP POLICY IF EXISTS "Permitir upload publico em credenciais e fotos" ON storage.objects;
CREATE POLICY "Permitir upload publico em credenciais e fotos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id IN ('credenciais-anime-friends', 'fotos-cosplay'));

-- 4. Exclusão restrita a administradores
DROP POLICY IF EXISTS "Permitir exclusao de arquivos por admin" ON storage.objects;
CREATE POLICY "Permitir exclusao de arquivos por admin"
  ON storage.objects FOR DELETE
  USING (bucket_id IN ('credenciais-anime-friends', 'fotos-cosplay') AND auth.role() = 'service_role');
`;


/**
 * Gera um código de credencial único no formato AF26-XXXXX
 */
export function generateTicketCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let random = '';
  for (let i = 0; i < 5; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `AF26-${random}`;
}

/**
 * Salva a inscrição no Supabase (com fallback para armazenamento local)
 */
export async function submitRegistration(
  formData: RegistrationFormData,
  valorTotal: number
): Promise<{
  success: boolean;
  record: RegistrationRecord;
  storageTarget: 'supabase' | 'local';
  warningMessage?: string;
}> {
  const ticketCode = generateTicketCode();
  const id = crypto.randomUUID ? crypto.randomUUID() : `id-${Date.now()}`;
  const now = new Date().toISOString();

  const record: RegistrationRecord = {
    id,
    created_at: now,
    nome: formData.nome.trim(),
    email: formData.email.trim().toLowerCase(),
    telefone: formData.telefone.trim(),
    cpf: formData.cpf.trim(),
    dias: formData.dias,
    tipo_ingresso: formData.tipoIngresso,
    cosplay_tag: formData.cosplayTag.trim() || undefined,
    valor_total: valorTotal,
    ticket_code: ticketCode,
    status: 'confirmado',
    armazenado_em: 'local',
  };

  const client = getSupabaseClient();

  if (client) {
    try {
      const { data, error } = await client
        .from('inscricoes_anime_friends')
        .insert([
          {
            nome: record.nome,
            email: record.email,
            telefone: record.telefone,
            cpf: record.cpf,
            dias: record.dias,
            tipo_ingresso: record.tipo_ingresso,
            cosplay_tag: record.cosplay_tag || null,
            valor_total: record.valor_total,
            ticket_code: record.ticket_code,
            status: record.status,
          },
        ])
        .select()
        .single();

      if (error) {
        console.warn('Erro ao inserir no Supabase, usando persistência local:', error);
        saveToLocalStorage(record);
        return {
          success: true,
          record,
          storageTarget: 'local',
          warningMessage: `Inscrição confirmada! Nota: Não foi possível salvar na tabela do Supabase (${error.message}). A inscrição foi armazenada na base local.`,
        };
      }

      // Gravado com sucesso no Supabase!
      const supabaseRecord: RegistrationRecord = {
        ...record,
        id: data?.id || id,
        armazenado_em: 'supabase',
      };
      // Também guarda uma cópia em cache local
      saveToLocalStorage(supabaseRecord);

      return {
        success: true,
        record: supabaseRecord,
        storageTarget: 'supabase',
      };
    } catch (err: any) {
      console.error('Falha de rede com Supabase:', err);
      saveToLocalStorage(record);
      return {
        success: true,
        record,
        storageTarget: 'local',
        warningMessage: `Inscrição confirmada e gravada localmente. O Supabase não respondeu: ${err.message}`,
      };
    }
  }

  // Se o Supabase não está configurado ainda, salva no armazenamento local
  saveToLocalStorage(record);
  return {
    success: true,
    record,
    storageTarget: 'local',
    warningMessage: 'Inscrição salva em modo de pré-visualização. Conecte sua URL e chave Anon do Supabase para persistir direto no banco de dados na nuvem!',
  };
}

/**
 * Salva no localStorage como backup ou modo de testes
 */
function saveToLocalStorage(record: RegistrationRecord): void {
  try {
    const existing = getLocalRecords();
    const filtered = existing.filter(r => r.ticket_code !== record.ticket_code);
    filtered.unshift(record);
    localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(filtered));
  } catch (e) {
    console.error('Erro ao salvar no localStorage:', e);
  }
}

/**
 * Recupera os registros locais
 */
export function getLocalRecords(): RegistrationRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RECORDS);
    if (raw) {
      return JSON.parse(raw);
    }

    // Registros iniciais para demonstração
    const initialSeed: RegistrationRecord[] = [
      {
        id: 'seed-1',
        created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
        nome: 'Guilherme Ferreira Santos',
        email: 'guilherme.santos@email.com',
        telefone: '(11) 98123-4567',
        cpf: '123.456.789-00',
        dias: ['quinta', 'sexta', 'sabado', 'domingo'],
        tipo_ingresso: 'meia_social',
        cosplay_tag: 'TanjiroSP',
        valor_total: 380,
        ticket_code: 'AF26-W9K2M',
        status: 'confirmado',
        armazenado_em: 'local',
      },
      {
        id: 'seed-2',
        created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
        nome: 'Beatriz Martins Oliveira',
        email: 'beatriz.cosplay@email.com',
        telefone: '(11) 97654-3210',
        cpf: '234.567.890-12',
        dias: ['sabado', 'domingo'],
        tipo_ingresso: 'vip_pass',
        cosplay_tag: 'SailorMoonBR',
        valor_total: 675,
        ticket_code: 'AF26-H4P8X',
        status: 'confirmado',
        armazenado_em: 'local',
      },
    ];

    localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(initialSeed));
    return initialSeed;
  } catch {
    return [];
  }
}

/**
 * Busca todas as inscrições (do Supabase ou do armazenamento local)
 */
export async function fetchAllRegistrations(): Promise<{
  records: RegistrationRecord[];
  source: 'supabase' | 'local';
}> {
  const client = getSupabaseClient();

  if (client) {
    try {
      const { data, error } = await client
        .from('inscricoes_anime_friends')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        const formatted: RegistrationRecord[] = data.map((item: any) => ({
          id: item.id,
          created_at: item.created_at,
          nome: item.nome,
          email: item.email,
          telefone: item.telefone,
          cpf: item.cpf,
          dias: item.dias || [],
          tipo_ingresso: item.tipo_ingresso,
          cosplay_tag: item.cosplay_tag,
          valor_total: Number(item.valor_total) || 0,
          ticket_code: item.ticket_code,
          status: item.status || 'confirmado',
          armazenado_em: 'supabase',
        }));
        return { records: formatted, source: 'supabase' };
      }
    } catch (e) {
      console.warn('Erro ao buscar do Supabase, buscando registros locais:', e);
    }
  }

  return { records: getLocalRecords(), source: 'local' };
}
