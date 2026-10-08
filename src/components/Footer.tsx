import React from 'react';
import { EVENT_INFO } from '../data/event';
import { Database, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onOpenSupabaseModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSupabaseModal }) => {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-950 py-12 text-xs text-neutral-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          
          {/* Brand & Sobre (5 cols) */}
          <div className="md:col-span-5 space-y-3">
            <span className="font-display text-xl font-extrabold tracking-wider text-white">
              ANIME<span className="text-rose-500">FRIENDS</span>
            </span>
            <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
              O maior evento de cultura pop asiática da América Latina. Reúne fãs de anime, mangá, cosplay, k-pop, games e gastronomia oriental desde 2003.
            </p>
            <div className="text-[11px] text-neutral-500 space-y-0.5 pt-1">
              <p className="text-neutral-400 font-medium">{EVENT_INFO.location}</p>
              <p>{EVENT_INFO.address}</p>
              <p>Horário: {EVENT_INFO.openingHours}</p>
            </div>
          </div>

          {/* Links Rápidos (3 cols) */}
          <div className="md:col-span-3 space-y-2">
            <span className="font-semibold text-xs text-white uppercase tracking-wider block mb-3">
              Navegação
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#sobre" className="hover:text-white transition-colors">
                  Sobre a Edição 2026
                </a>
              </li>
              <li>
                <a href="#atracoes" className="hover:text-white transition-colors">
                  Atrações & Palcos
                </a>
              </li>
              <li>
                <a href="#cronograma" className="hover:text-white transition-colors">
                  Quinta, Sexta, Sábado e Domingo
                </a>
              </li>
              <li>
                <a href="#inscricao" className="text-rose-400 hover:text-rose-300 transition-colors font-medium">
                  Inscrição & Credenciamento
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Dúvidas Frequentes
                </a>
              </li>
            </ul>
          </div>

          {/* Integração e Banco (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <span className="font-semibold text-xs text-white uppercase tracking-wider block mb-3">
              Infraestrutura & Dados
            </span>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Formulário conectado com validação estrita (CPF Módulo 11, telefones brasileiros e RFC de e-mail) persistindo registros no <strong>Supabase (PostgreSQL)</strong>.
            </p>
            <div>
              <button
                type="button"
                onClick={onOpenSupabaseModal}
                className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs text-neutral-300 hover:border-neutral-700 hover:text-white transition-colors"
              >
                <Database className="h-3.5 w-3.5 text-rose-400" />
                <span>Configurar Conexão do Supabase</span>
              </button>
            </div>
          </div>

        </div>

        {/* Linha Inferior */}
        <div className="mt-12 border-t border-neutral-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-400">
          <p>
            © 2026 Anime Friends · Todos os direitos reservados. Mar Eventos / Anime Friends.
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Feito para os fãs de anime & cultura pop
            </span>
            <span aria-hidden="true" className="text-neutral-700">·</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              Dados Criptografados
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
