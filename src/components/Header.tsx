import React from 'react';
import { Database, ShieldCheck, Ticket, Users } from 'lucide-react';

interface HeaderProps {
  supabaseConfigured: boolean;
  registeredCount: number;
  onOpenSupabaseModal: () => void;
  onOpenAdminModal: () => void;
  onScrollToForm: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  supabaseConfigured,
  registeredCount,
  onOpenSupabaseModal,
  onOpenAdminModal,
  onScrollToForm,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#"
          className="group flex items-center gap-2.5 text-lg font-bold tracking-tight text-white transition-opacity hover:opacity-90"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-amber-500 text-xs font-black text-white shadow-sm shadow-rose-500/20">
            AF
          </span>
          <span className="font-display text-xl font-extrabold tracking-wider text-white">
            ANIME<span className="text-rose-500">FRIENDS</span>
          </span>
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden items-center gap-7 text-sm font-medium text-neutral-300 md:flex">
          <a
            href="#sobre"
            className="transition-colors hover:text-white"
          >
            O Evento
          </a>
          <a
            href="#atracoes"
            className="transition-colors hover:text-white"
          >
            Atrações
          </a>
          <a
            href="#cronograma"
            className="transition-colors hover:text-white"
          >
            Dias & Passes
          </a>
          <a
            href="#inscricao"
            className="text-rose-400 transition-colors hover:text-rose-300"
          >
            Inscrição Oficial
          </a>
          <a
            href="#faq"
            className="transition-colors hover:text-white"
          >
            Dúvidas
          </a>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2.5">
          {/* Supabase status button */}
          <button
            onClick={onOpenSupabaseModal}
            title={supabaseConfigured ? 'Supabase conectado' : 'Configurar Supabase'}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all ${
              supabaseConfigured
                ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300 hover:bg-emerald-900/40'
                : 'border-amber-500/40 bg-amber-950/30 text-amber-300 hover:bg-amber-900/40'
            }`}
          >
            <Database className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">
              {supabaseConfigured ? 'Supabase Conectado' : 'Configurar Supabase'}
            </span>
            <span
              className={`h-2 w-2 rounded-full ${
                supabaseConfigured ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
              }`}
            />
          </button>

          {/* Organizer registered count */}
          <button
            onClick={onOpenAdminModal}
            className="flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900 px-2.5 py-1.5 text-xs font-medium text-neutral-300 hover:border-neutral-700 hover:text-white transition-colors"
            title="Ver lista de inscritos"
          >
            <Users className="h-3.5 w-3.5 text-neutral-400" />
            <span className="hidden sm:inline">Inscritos:</span>
            <span className="font-mono tabular-nums text-rose-400 font-semibold">{registeredCount}</span>
          </button>

          {/* Primary CTA */}
          <button
            onClick={onScrollToForm}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-rose-600 to-rose-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm shadow-rose-600/30 hover:from-rose-500 hover:to-rose-400 transition-all active:scale-[0.98]"
          >
            <Ticket className="h-3.5 w-3.5" />
            <span className="whitespace-nowrap">Inscrever-se</span>
          </button>
        </div>
      </div>
    </header>
  );
};
