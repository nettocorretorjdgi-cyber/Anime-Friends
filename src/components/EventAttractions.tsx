import React from 'react';
import { Music, Award, Palette, Gamepad2, Calendar, Clock, MapPin, Sparkles } from 'lucide-react';
import { EVENT_DAYS, EVENT_INFO } from '../data/event';

interface EventAttractionsProps {
  onSelectDayInForm: (dayId: string) => void;
}

export const EventAttractions: React.FC<EventAttractionsProps> = ({
  onSelectDayInForm,
}) => {
  const pillars = [
    {
      icon: Music,
      title: '01. Shows & J-Music Internacional',
      desc: 'Bandas consagradas direto de Tóquio, cantores de aberturas lendárias de anime, orquestras ao vivo e tributos aos clássicos.',
      accent: 'text-rose-400',
    },
    {
      icon: Award,
      title: '02. WCS & Campeonato Cosplay',
      desc: 'O maior palco de cosplay da América Latina! Concurso tradicional, desfile cosplay, premiação em dinheiro e vaga para o World Cosplay Summit.',
      accent: 'text-amber-400',
    },
    {
      icon: Palette,
      title: '03. Artist\'s Alley & Mangás',
      desc: 'Mais de 250 ilustradores e quadrinistas independentes apresentando obras autorais, prints exclusivos, posters e sessões de autógrafos.',
      accent: 'text-pink-400',
    },
    {
      icon: Gamepad2,
      title: '04. Arena Games & E-Sports',
      desc: 'Estações de jogos de última geração, campeonatos de jogos de luta (Fighting Games), arcades retrô japoneses e estandes de estúdios renomados.',
      accent: 'text-purple-400',
    },
  ];

  return (
    <section id="atracoes" className="scroll-mt-16 py-20 border-b border-neutral-800/80 bg-neutral-950/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Cabeçalho */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-rose-500 uppercase">
            <Sparkles className="h-4 w-4" />
            <span>Programação Completa 2026</span>
          </div>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-white sm:text-4xl text-balance">
            4 Dias de Imersão Total na Cultura Pop Oriental
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-400">
            Cada dia do Anime Friends foi planejado com atrações exclusivas. Você pode escolher dias avulsos ou viver a experiência completa dos 4 dias!
          </p>
        </div>

        {/* 4 Pilares Principais (Bento-Grid Clean) */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 transition-all hover:border-neutral-700 hover:bg-neutral-900/80"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-800/80 mb-4 group-hover:scale-105 transition-transform">
                  <Icon className={`h-5 w-5 ${item.accent}`} />
                </div>
                <h3 className="font-semibold text-base text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-400">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Cronograma Detalhado dos 4 Dias */}
        <div id="cronograma" className="mt-16 scroll-mt-20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display text-2xl font-bold text-white">
                Grade dos Dias do Festival
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Clique em qualquer dia para ir diretamente ao formulário de inscrição.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-400">
              <Clock className="h-4 w-4 text-rose-400" />
              <span>Horário diário: {EVENT_INFO.openingHours}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {EVENT_DAYS.map((day) => (
              <div
                key={day.id}
                className="flex flex-col justify-between rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 transition-all hover:border-rose-500/50 hover:bg-neutral-900/70"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-neutral-400 mb-3">
                    <span className="font-mono font-bold text-rose-400">
                      Dia {day.dayNumber}
                    </span>
                    <span className="font-medium text-white">{day.date}</span>
                  </div>

                  <h4 className="font-display text-lg font-bold text-white">
                    {day.weekday}
                  </h4>
                  <p className="mt-1 text-xs font-semibold text-rose-400">
                    {day.title}
                  </p>
                  <p className="mt-3 text-xs leading-relaxed text-neutral-400">
                    {day.highlight}
                  </p>
                </div>

                <div className="mt-6 border-t border-neutral-800/80 pt-4 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] text-neutral-500 uppercase">A partir de</span>
                    <span className="font-mono text-base font-bold text-white tabular-nums">
                      R$ {day.price.toFixed(2).replace('.', ',')}
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectDayInForm(day.id)}
                    className="rounded-lg bg-neutral-800 hover:bg-rose-600 hover:text-white px-3 py-1.5 text-xs font-semibold text-neutral-200 transition-colors"
                  >
                    Selecionar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
