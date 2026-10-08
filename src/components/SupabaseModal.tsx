import React, { useState, useEffect } from 'react';
import {
  X,
  Database,
  Check,
  Copy,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Code2,
  Trash2,
  Download,
  HardDrive,
  Layers,
} from 'lucide-react';
import {
  clearCustomSupabaseConfig,
  getSupabaseConfig,
  saveCustomSupabaseConfig,
  STORAGE_ONLY_SQL_SCRIPT,
  SUPABASE_SQL_SCRIPT,
  testSupabaseConnection,
} from '../lib/supabase';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigChanged: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({
  isOpen,
  onClose,
  onConfigChanged,
}) => {
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    tableExists?: boolean;
  } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'storage'>('all');

  useEffect(() => {
    if (isOpen) {
      const config = getSupabaseConfig();
      setUrl(config.url || '');
      setAnonKey(config.anonKey || '');
      setTestResult(null);
      setSaveSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      if (url.trim() && anonKey.trim()) {
        saveCustomSupabaseConfig(url, anonKey);
      }
      const res = await testSupabaseConnection();
      setTestResult(res);
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    if (!url.trim() || !anonKey.trim()) {
      setTestResult({
        success: false,
        message: 'Por favor, informe a URL e a Anon Key do seu projeto Supabase.',
      });
      return;
    }

    saveCustomSupabaseConfig(url, anonKey);
    setSaveSuccess(true);
    onConfigChanged();
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  const handleReset = () => {
    clearCustomSupabaseConfig();
    const config = getSupabaseConfig();
    setUrl(config.url || '');
    setAnonKey(config.anonKey || '');
    setTestResult(null);
    onConfigChanged();
  };

  const currentSql = activeTab === 'all' ? SUPABASE_SQL_SCRIPT : STORAGE_ONLY_SQL_SCRIPT;

  const handleCopySql = () => {
    navigator.clipboard.writeText(currentSql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleDownloadSql = () => {
    const filename =
      activeTab === 'all'
        ? 'anime_friends_setup_completo.sql'
        : 'anime_friends_storage_policies.sql';
    const blob = new Blob([currentSql], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto">
        
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Título */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-xl font-bold text-white">
              Configuração e Políticas de Armazenamento do Supabase
            </h3>
            <p className="text-xs text-neutral-400">
              Conecte sua conta do Supabase e aplique as políticas de banco e buckets de arquivos.
            </p>
          </div>
        </div>

        {/* Passo a Passo */}
        <div className="mt-6 rounded-xl border border-neutral-800 bg-neutral-950/60 p-4 text-xs text-neutral-300 space-y-2">
          <p className="font-bold text-white flex items-center gap-1.5">
            <span>Como conectar seu Supabase em 3 passos rápidos:</span>
          </p>
          <ol className="list-decimal list-inside space-y-1 text-neutral-400 pl-1">
            <li>Acesse seu projeto no <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline inline-flex items-center gap-0.5">Supabase <ExternalLink className="h-2.5 w-2.5" /></a> e vá em <strong>Project Settings → API</strong>.</li>
            <li>Copie a <strong>Project URL</strong> e a <strong>anon public key</strong> e cole nos campos abaixo.</li>
            <li>Copie o script SQL abaixo com as <strong>políticas de armazenamento e tabelas</strong> e execute no <strong>SQL Editor</strong> do Supabase.</li>
          </ol>
        </div>

        {/* Formulário de Credenciais */}
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Project URL do Supabase
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://seu-projeto-id.supabase.co"
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 font-mono text-xs text-white placeholder-neutral-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Anon Public API Key
            </label>
            <input
              type="password"
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 font-mono text-xs text-white placeholder-neutral-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Feedback do Teste de Conexão */}
        {testResult && (
          <div
            className={`mt-4 rounded-xl border p-3.5 text-xs flex items-start gap-2.5 ${
              testResult.success
                ? testResult.tableExists
                  ? 'border-emerald-500/30 bg-emerald-950/30 text-emerald-300'
                  : 'border-amber-500/30 bg-amber-950/30 text-amber-300'
                : 'border-rose-500/30 bg-rose-950/30 text-rose-300'
            }`}
          >
            {testResult.success ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="font-semibold">{testResult.message}</p>
              {testResult.success && !testResult.tableExists && (
                <p className="mt-1 text-[11px] opacity-90">
                  Execute o script SQL abaixo no SQL Editor do Supabase para criar a tabela e os buckets de armazenamento.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Script SQL com Tabs e Download */}
        <div className="mt-6 border-t border-neutral-800 pt-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            {/* Tabs de Seleção do Script */}
            <div className="flex items-center gap-1 rounded-lg bg-neutral-950 p-1 border border-neutral-800">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  activeTab === 'all'
                    ? 'bg-neutral-800 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Layers className="h-3.5 w-3.5 text-rose-400" />
                <span>Script Completo (Tabela + Storage)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('storage')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  activeTab === 'storage'
                    ? 'bg-neutral-800 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <HardDrive className="h-3.5 w-3.5 text-emerald-400" />
                <span>Apenas Políticas de Storage</span>
              </button>
            </div>

            {/* Ações de Copiar e Baixar */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadSql}
                className="flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-800 px-2.5 py-1.5 text-xs font-semibold text-neutral-200 hover:bg-neutral-700 hover:text-white transition-colors"
                title="Baixar arquivo .sql para o seu computador"
              >
                <Download className="h-3.5 w-3.5 text-blue-400" />
                <span>Baixar .SQL</span>
              </button>

              <button
                type="button"
                onClick={handleCopySql}
                className="flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-800 px-2.5 py-1.5 text-xs font-semibold text-neutral-200 hover:bg-neutral-700 hover:text-white transition-colors"
              >
                {copiedSql ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copiar SQL</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="mb-2 text-[11px] text-neutral-400 flex items-center gap-2">
            <span>Arquivo salvo em:</span>
            <code className="font-mono text-neutral-300 bg-neutral-950 px-1.5 py-0.5 rounded border border-neutral-800">
              /supabase/politicas_armazenamento.sql
            </code>
          </div>

          <pre className="rounded-xl border border-neutral-800 bg-neutral-950 p-3.5 font-mono text-[11px] text-neutral-300 overflow-x-auto max-h-48 leading-relaxed">
            {currentSql}
          </pre>
        </div>

        {/* Ações do Modal */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-neutral-800 pt-5">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting || !url || !anonKey}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-xs font-semibold text-white hover:bg-neutral-700 disabled:opacity-50 transition-colors w-full sm:w-auto"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? 'Testando...' : 'Testar Conexão'}</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="flex items-center justify-center gap-1 rounded-xl border border-neutral-800 px-3 py-2.5 text-xs font-medium text-neutral-400 hover:bg-neutral-800 hover:text-rose-400 transition-colors"
              title="Restaurar valores padrão"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Limpar</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2.5 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:from-emerald-500 hover:to-teal-500 transition-all w-full sm:w-auto"
            >
              {saveSuccess ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Configuração Salva!</span>
                </>
              ) : (
                <span>Salvar Credenciais</span>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
