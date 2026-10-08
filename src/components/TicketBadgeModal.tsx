import React, { useState } from 'react';
import {
  X,
  Printer,
  Copy,
  Check,
  Calendar,
  Sparkles,
  QrCode,
  Download,
  Database,
  ArrowRight,
} from 'lucide-react';
import { RegistrationRecord } from '../types';
import { EVENT_DAYS, EVENT_INFO, TICKET_TYPES } from '../data/event';

interface TicketBadgeModalProps {
  record: RegistrationRecord | null;
  onClose: () => void;
  onNewRegistration: () => void;
}

export const TicketBadgeModal: React.FC<TicketBadgeModalProps> = ({
  record,
  onClose,
  onNewRegistration,
}) => {
  const [copied, setCopied] = useState(false);

  if (!record) return null;

  const ticketTypeObj = TICKET_TYPES.find(t => t.id === record.tipo_ingresso);
  const ticketTitle = ticketTypeObj ? ticketTypeObj.title : record.tipo_ingresso;

  // Mascara de CPF para proteção visual: 123.***.***-45
  const maskedCpf = record.cpf.replace(/^(\d{3})\.(\d{3})\.(\d{3})-(\d{2})$/, '$1.***.***-$4');

  const handleCopyCode = () => {
    navigator.clipboard.writeText(record.ticket_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
          title="Fechar"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Notificação de Sucesso */}
        <div className="text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30 mb-3">
            <Check className="h-6 w-6 stroke-[3]" />
          </div>
          <h3 className="font-display text-2xl font-black text-white">
            Inscrição Confirmada!
          </h3>
          <p className="mt-1 text-xs text-neutral-400">
            Sua credencial oficial do Anime Friends 2026 foi gerada com sucesso.
          </p>

          {/* Tag de armazenamento */}
          <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium text-neutral-400">
            <Database className="h-3 w-3 text-rose-400" />
            <span>
              {record.armazenado_em === 'supabase'
                ? 'Gravado no banco Supabase na nuvem'
                : 'Salvo em modo local / pré-visualização'}
            </span>
          </div>
        </div>

        {/* Card da Credencial Estilizada (Passaporte do Evento) */}
        <div
          id="anime-badge-printable"
          className="mt-6 overflow-hidden rounded-2xl border border-rose-500/40 bg-gradient-to-b from-neutral-950 to-neutral-900 p-6 shadow-xl ring-1 ring-rose-500/20"
        >
          {/* Header da Credencial */}
          <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-rose-600 font-mono text-xs font-black text-white">
                AF
              </span>
              <div>
                <span className="font-display text-sm font-extrabold tracking-wider text-white">
                  ANIME<span className="text-rose-500">FRIENDS</span>
                </span>
                <span className="block text-[10px] text-neutral-400 font-medium">
                  {EVENT_INFO.edition} · 2026
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="block font-mono text-xs font-bold text-rose-400">
                {record.ticket_code}
              </span>
              <span className="text-[10px] text-emerald-400 uppercase font-semibold">
                ● Ativo
              </span>
            </div>
          </div>

          {/* Dados do Titular */}
          <div className="mt-4 space-y-3">
            <div>
              <span className="block text-[10px] uppercase font-bold text-neutral-500">
                Titular da Credencial
              </span>
              <h4 className="font-display text-lg font-black text-white tracking-tight">
                {record.nome}
              </h4>
              {record.cosplay_tag && (
                <span className="inline-block mt-0.5 text-xs font-semibold text-rose-400">
                  Tag: @{record.cosplay_tag}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="block text-[10px] text-neutral-500 uppercase font-medium">CPF</span>
                <span className="font-mono text-neutral-200">{maskedCpf}</span>
              </div>
              <div>
                <span className="block text-[10px] text-neutral-500 uppercase font-medium">WhatsApp</span>
                <span className="font-mono text-neutral-200">{record.telefone}</span>
              </div>
              <div className="col-span-2">
                <span className="block text-[10px] text-neutral-500 uppercase font-medium">Categoria</span>
                <span className="font-semibold text-white">{ticketTitle}</span>
              </div>
            </div>

            {/* Dias de Acesso */}
            <div className="border-t border-neutral-800/80 pt-3">
              <span className="block text-[10px] uppercase font-bold text-neutral-500 mb-2">
                Dias de Acesso Autorizados ({record.dias.length} dias)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {EVENT_DAYS.filter(d => record.dias.includes(d.id)).map(day => (
                  <span
                    key={day.id}
                    className="inline-flex items-center gap-1 rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1 text-[11px] font-semibold text-white"
                  >
                    <Calendar className="h-3 w-3 text-rose-400" />
                    <span>{day.weekday} ({day.dateShort})</span>
                  </span>
                ))}
              </div>
            </div>

            {/* QR Code de Entrada Simulado */}
            <div className="mt-4 flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-950 p-3">
              <div className="flex items-center gap-3">
                {/* SVG QR Code Pattern */}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-white p-1 text-black shadow-inner">
                  <svg viewBox="0 0 24 24" className="h-full w-full" fill="currentColor">
                    <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14-2h4v2h-4v-2zm-4 0h2v4h-2v-4zm4 4h4v4h-4v-4zm-4 2h2v2h-2v-2zm0-4h2v2h-2v-2zm-6 2h2v2h-2v-2zm4-6h2v2h-2v-2zm-2 2h2v2h-2v-2zm-2-2h2v2h-2v-2zm4-2h2v2h-2v-2z" />
                  </svg>
                </div>
                <div>
                  <span className="block text-[11px] font-bold text-white">
                    Voucher de Entrada Digital
                  </span>
                  <p className="text-[10px] text-neutral-400 leading-tight">
                    Apresente na catraca de credenciamento do Distrito Anhembi junto com seu documento oficial.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Footer do Badge */}
          <div className="mt-4 flex items-center justify-between border-t border-neutral-800/80 pt-3 text-[10px] text-neutral-500 font-mono">
            <span>{EVENT_INFO.location}</span>
            <span>R$ {record.valor_total.toFixed(2).replace('.', ',')}</span>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleCopyCode}
            className="flex w-full sm:flex-1 items-center justify-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-neutral-700 active:scale-[0.98]"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" />
                <span>Código Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-neutral-400" />
                <span>Copiar Código</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="flex w-full sm:flex-1 items-center justify-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-neutral-700 active:scale-[0.98]"
          >
            <Printer className="h-4 w-4 text-neutral-400" />
            <span>Imprimir Credencial</span>
          </button>
        </div>

        {/* Botão de nova inscrição */}
        <button
          onClick={onNewRegistration}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600/20 border border-rose-500/30 py-2.5 text-xs font-bold text-rose-300 hover:bg-rose-600/30 transition-colors"
        >
          <span>Cadastrar Outro Participante</span>
          <ArrowRight className="h-4 w-4" />
        </button>

      </div>
    </div>
  );
};
