import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Download,
  Users,
  Calendar,
  Ticket,
  Filter,
  Eye,
  Database,
  ArrowUpDown,
} from 'lucide-react';
import { RegistrationRecord } from '../types';
import { EVENT_DAYS } from '../data/event';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: RegistrationRecord[];
  onSelectRecord: (record: RegistrationRecord) => void;
  storageSource: 'supabase' | 'local';
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  records,
  onSelectRecord,
  storageSource,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDay, setFilterDay] = useState<string>('all');

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchSearch =
        r.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.cpf.includes(searchTerm) ||
        r.ticket_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.cosplay_tag && r.cosplay_tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchDay = filterDay === 'all' || r.dias.includes(filterDay);

      return matchSearch && matchDay;
    });
  }, [records, searchTerm, filterDay]);

  if (!isOpen) return null;

  // Estatísticas rápidas
  const totalArrecadado = records.reduce((acc, cur) => acc + (cur.valor_total || 0), 0);
  const passportes = records.filter(r => r.dias.length === 4).length;

  const exportCsv = () => {
    const headers = ['Código', 'Nome', 'Email', 'Telefone', 'CPF', 'Dias', 'Ingresso', 'Cosplay', 'Total (R$)', 'Data', 'Armazenamento'];
    const rows = filteredRecords.map(r => [
      r.ticket_code,
      `"${r.nome}"`,
      r.email,
      r.telefone,
      r.cpf,
      `"${r.dias.join(', ')}"`,
      r.tipo_ingresso,
      r.cosplay_tag || '',
      r.valor_total.toFixed(2),
      new Date(r.created_at).toLocaleDateString('pt-BR'),
      r.armazenado_em,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `anime_friends_inscricoes_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl p-6 sm:p-8 my-8 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-white">
                Painel de Inscrições Realizadas
              </h3>
              <p className="text-xs text-neutral-400 flex items-center gap-2">
                <span>Fonte: <strong>{storageSource === 'supabase' ? 'Banco Supabase Cloud' : 'Armazenamento Local'}</strong></span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">{records.length} inscritos no total</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Métricas Rápidas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4">
          <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-3">
            <span className="text-[11px] text-neutral-400">Total de Inscritos</span>
            <span className="block font-display text-xl font-black text-white tabular-nums mt-0.5">
              {records.length}
            </span>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-3">
            <span className="text-[11px] text-neutral-400">Passaportes 4 Dias</span>
            <span className="block font-display text-xl font-black text-rose-400 tabular-nums mt-0.5">
              {passportes}
            </span>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-3">
            <span className="text-[11px] text-neutral-400">Dias Únicos Avulsos</span>
            <span className="block font-display text-xl font-black text-amber-400 tabular-nums mt-0.5">
              {records.length - passportes}
            </span>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-3">
            <span className="text-[11px] text-neutral-400">Arrecadação Estimada</span>
            <span className="block font-display text-xl font-black text-emerald-400 tabular-nums mt-0.5">
              R$ {totalArrecadado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Barra de Filtros e Busca */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 py-3 border-y border-neutral-800/80">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nome, CPF, email ou código..."
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div className="relative">
              <select
                value={filterDay}
                onChange={(e) => setFilterDay(e.target.value)}
                className="rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-rose-500 focus:outline-none"
              >
                <option value="all">Todos os dias</option>
                {EVENT_DAYS.map(d => (
                  <option key={d.id} value={d.id}>{d.weekday}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={exportCsv}
            disabled={filteredRecords.length === 0}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-800 px-3.5 py-2 text-xs font-semibold text-white hover:bg-neutral-700 disabled:opacity-40 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Exportar CSV</span>
          </button>
        </div>

        {/* Tabela de Inscrições */}
        <div className="flex-1 overflow-y-auto mt-4 rounded-xl border border-neutral-800 bg-neutral-950">
          {filteredRecords.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-500">
              <Ticket className="mx-auto h-8 w-8 text-neutral-600 mb-2" />
              <p>Nenhuma inscrição encontrada com os filtros atuais.</p>
              <p className="mt-1 text-[11px] text-neutral-600">Preencha o formulário para adicionar a primeira inscrição!</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-neutral-900 border-b border-neutral-800 text-[11px] uppercase font-bold text-neutral-400">
                <tr>
                  <th className="px-4 py-3">Código</th>
                  <th className="px-4 py-3">Nome / Cosplay</th>
                  <th className="px-4 py-3">CPF</th>
                  <th className="px-4 py-3">Contato</th>
                  <th className="px-4 py-3">Dias</th>
                  <th className="px-4 py-3 text-right">Valor</th>
                  <th className="px-4 py-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900 font-sans">
                {filteredRecords.map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-900/50 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-rose-400 whitespace-nowrap">
                      {item.ticket_code}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-white truncate max-w-[180px]">{item.nome}</p>
                      {item.cosplay_tag && (
                        <p className="text-[11px] text-rose-400">@{item.cosplay_tag}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-neutral-300 whitespace-nowrap">
                      {item.cpf}
                    </td>
                    <td className="px-4 py-3 text-neutral-300">
                      <p className="truncate max-w-[180px]">{item.email}</p>
                      <p className="font-mono text-[11px] text-neutral-500">{item.telefone}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1 max-w-[160px]">
                        {item.dias.map(d => (
                          <span
                            key={d}
                            className="rounded bg-neutral-800 px-1.5 py-0.5 text-[10px] font-mono text-neutral-300"
                          >
                            {d.slice(0, 3).toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-white whitespace-nowrap">
                      R$ {item.valor_total.toFixed(2).replace('.', ',')}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => {
                          onSelectRecord(item);
                          onClose();
                        }}
                        className="inline-flex items-center gap-1 rounded-lg border border-neutral-700 bg-neutral-800 px-2.5 py-1 text-[11px] font-medium text-neutral-200 hover:border-neutral-600 hover:text-white transition-colors"
                        title="Ver credencial digital"
                      >
                        <Eye className="h-3 w-3" />
                        <span>Ver</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
};
