import React from 'react';
import { Check, CalendarCheck, Sparkles, AlertCircle } from 'lucide-react';
import { EVENT_DAYS, PASSPORT_DISCOUNT } from '../data/event';

interface DaySelectorProps {
  selectedDays: string[];
  onChange: (days: string[]) => void;
  error?: string;
}

export const DaySelector: React.FC<DaySelectorProps> = ({
  selectedDays,
  onChange,
  error,
}) => {
  const allDayIds = EVENT_DAYS.map(d => d.id);
  const isAllSelected = allDayIds.length > 0 && allDayIds.every(id => selectedDays.includes(id));

  const toggleDay = (dayId: string) => {
    if (selectedDays.includes(dayId)) {
      onChange(selectedDays.filter(id => id !== dayId));
    } else {
      onChange([...selectedDays, dayId]);
    }
  };

  const handleToggleAll = () => {
    if (isAllSelected) {
      onChange([]);
    } else {
      onChange(allDayIds);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header com Botão de Ação Rápida */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <label className="block text-sm font-bold text-white">
            Selecione os Dias do Evento <span className="text-rose-500">*</span>
          </label>
          <p className="text-xs text-neutral-400">
            Escolha um ou mais dias avulsos ou aproveite o Passaporte Completo.
          </p>
        </div>

        {/* Botão de Selecionar Todos / Combo Passaporte */}
        <button
          type="button"
          onClick={handleToggleAll}
          className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
            isAllSelected
              ? 'border-rose-500 bg-rose-950/60 text-rose-300 hover:bg-rose-900/60'
              : 'border-neutral-700 bg-neutral-900 text-neutral-300 hover:border-neutral-600 hover:text-white'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>
            {isAllSelected
              ? 'Desmarcar Todos'
              : `Passaporte 4 Dias (-R$ ${PASSPORT_DISCOUNT})`}
          </span>
        </button>
      </div>

      {/* Grid de Dias */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {EVENT_DAYS.map((day) => {
          const isSelected = selectedDays.includes(day.id);

          return (
            <div
              key={day.id}
              onClick={() => toggleDay(day.id)}
              className={`relative cursor-pointer rounded-xl border p-4 transition-all select-none ${
                isSelected
                  ? 'border-rose-500 bg-gradient-to-br from-rose-950/40 to-neutral-900/80 shadow-md shadow-rose-950/30 ring-1 ring-rose-500/30'
                  : 'border-neutral-800 bg-neutral-900/40 hover:border-neutral-700 hover:bg-neutral-900/70'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                {/* Informações do dia */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-rose-400">
                      Dia {day.dayNumber}
                    </span>
                    <span aria-hidden="true" className="text-neutral-700">·</span>
                    <span className="text-xs text-neutral-400">{day.date}</span>
                  </div>

                  <h4 className="mt-1 font-semibold text-sm text-white">
                    {day.weekday}
                  </h4>
                  <p className="text-xs font-medium text-neutral-300 mt-0.5">
                    {day.title}
                  </p>

                  <p className="mt-2 text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                    {day.highlight}
                  </p>
                </div>

                {/* Checkbox estilizado e preço */}
                <div className="flex flex-col items-end justify-between self-stretch">
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-md border transition-colors ${
                      isSelected
                        ? 'border-rose-500 bg-rose-600 text-white'
                        : 'border-neutral-700 bg-neutral-800 text-transparent'
                    }`}
                  >
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  </div>

                  <div className="mt-4 text-right">
                    <span className="block text-[10px] text-neutral-500 uppercase">A partir de</span>
                    <span className="font-mono text-sm font-bold text-white tabular-nums">
                      R$ {day.price.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tag de destaque no dia de sábado */}
              {day.id === 'sabado' && (
                <div className="absolute top-2 right-9 text-[10px] font-semibold text-amber-400">
                  ★ Mais concorrido
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Resumo visual dos dias selecionados */}
      <div className="flex items-center justify-between rounded-lg border border-neutral-800/80 bg-neutral-900/60 px-3.5 py-2.5 text-xs text-neutral-300">
        <div className="flex items-center gap-2">
          <CalendarCheck className="h-4 w-4 text-rose-400" />
          <span>
            {selectedDays.length === 0 ? (
              <span className="text-neutral-400">Nenhum dia selecionado ainda</span>
            ) : selectedDays.length === 4 ? (
              <span className="font-semibold text-white">
                Passaporte Completo: <span className="text-emerald-400">Todos os 4 dias incluídos</span>
              </span>
            ) : (
              <span>
                <strong className="text-white">{selectedDays.length}</strong>{' '}
                {selectedDays.length === 1 ? 'dia selecionado' : 'dias selecionados'}
              </span>
            )}
          </span>
        </div>

        {selectedDays.length > 0 && (
          <span className="font-mono text-xs font-semibold text-neutral-200">
            {EVENT_DAYS.filter(d => selectedDays.includes(d.id)).map(d => d.dateShort).join(' + ')}
          </span>
        )}
      </div>

      {/* Erro de validação */}
      {error && (
        <div className="flex items-center gap-2 text-xs font-medium text-rose-400 animate-in fade-in">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
