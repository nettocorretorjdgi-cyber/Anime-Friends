import React from 'react';
import { Calendar, MapPin, Sparkles, ArrowDown, ShieldCheck, Zap } from 'lucide-react';
import { EVENT_INFO } from '../data/event';

interface HeroProps {
  onScrollToForm: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onScrollToForm }) => {
  return (
    <section className="relative overflow-hidden border-b border-neutral-800/80 bg-neutral-950 pt-8 pb-16 lg:py-20">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-96 w-[700px] -translate-x-1/2 rounded-full bg-rose-600/15 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/3 -right-20 -z-10 h-80 w-80 rounded-full bg-amber-500/10 blur-[100px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* Coluna de Texto (7 cols) */}
          <div className="lg:col-span-7">
            {/* Tagline sem pills estáticas */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-rose-400 uppercase">
              <Sparkles className="h-4 w-4" />
              <span>{EVENT_INFO.edition}</span>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span className="text-neutral-400">Distrito Anhembi / SP</span>
            </div>

            <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl text-balance">
              Garanta sua presença no <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400">Anime Friends</span>
            </h1>

            <p className="mt-5 text-base sm:text-lg leading-relaxed text-neutral-300 max-w-2xl">
              Quatro dias inesquecíveis de pura cultura pop japonesa, concursos de cosplay, shows internacionais, dubladores oficiais, Artist's Alley e a maior arena gamer do Brasil. Escolha os dias da sua credencial e confirme sua vaga agora.
            </p>

            {/* Informações Práticas do Evento */}
            <div className="mt-6 flex flex-wrap items-center gap-y-3 gap-x-6 text-sm text-neutral-300">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-rose-400 shrink-0" />
                <span className="font-semibold text-white">{EVENT_INFO.dates}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-amber-400 shrink-0" />
                <span>{EVENT_INFO.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="text-emerald-300">Lote Promocional Aberto</span>
              </div>
            </div>

            {/* CTA e Trust Badge */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={onScrollToForm}
                className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-rose-600/30 transition-all hover:from-rose-500 hover:to-rose-400 hover:shadow-rose-600/50 active:scale-[0.98]"
              >
                <span>Preencher Inscrição Oficial</span>
                <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
              </button>

              <a
                href="#cronograma"
                className="flex items-center justify-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900/60 px-5 py-3.5 text-sm font-semibold text-neutral-200 transition-colors hover:border-neutral-700 hover:bg-neutral-800/60 hover:text-white"
              >
                Conhecer a Programação
              </a>
            </div>

            {/* Micro-prova social */}
            <div className="mt-8 flex items-center gap-4 border-t border-neutral-800/80 pt-6">
              <div className="flex -space-x-2">
                <div className="h-9 w-9 rounded-full ring-2 ring-neutral-950 bg-rose-600 flex items-center justify-center text-xs font-bold text-white">AF</div>
                <div className="h-9 w-9 rounded-full ring-2 ring-neutral-950 bg-amber-600 flex items-center justify-center text-xs font-bold text-white">WCS</div>
                <div className="h-9 w-9 rounded-full ring-2 ring-neutral-950 bg-purple-600 flex items-center justify-center text-xs font-bold text-white">SP</div>
              </div>
              <div className="text-xs text-neutral-400">
                <p className="font-medium text-neutral-200">+120.000 otakus e fãs reunidos</p>
                <p>Credenciamento digital direto com QR Code e confirmação no banco</p>
              </div>
            </div>
          </div>

          {/* Coluna Visual: Card Hero & Banner Real (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Moldura fotográfica da convenção */}
              <div className="group relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl transition-all duration-300 hover:border-neutral-700">
                <div className="relative aspect-video w-full overflow-hidden bg-neutral-950">
                  <img
                    src={EVENT_INFO.heroImage}
                    alt="Palco principal e multidão no festival Anime Friends"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent" />
                  
                  {/* Badge flutuante do mascote oficial */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-3 rounded-xl border border-neutral-800/90 bg-neutral-950/80 p-2.5 backdrop-blur-md">
                    <img
                      src={EVENT_INFO.badgeImage}
                      alt="Mascote Anime Friends"
                      className="h-10 w-10 rounded-lg object-cover ring-1 ring-rose-500/50"
                    />
                    <div>
                      <p className="text-xs font-bold text-white">Kira · Mascote Oficial</p>
                      <p className="text-[11px] text-neutral-400">Edição comemorativa 2026</p>
                    </div>
                  </div>
                </div>

                {/* Destaques rápidos */}
                <div className="grid grid-cols-3 divide-x divide-neutral-800/80 border-t border-neutral-800/80 bg-neutral-950/90 p-4 text-center">
                  <div>
                    <span className="block font-mono text-lg font-bold text-white tabular-nums">4</span>
                    <span className="text-[11px] text-neutral-400">Dias de Evento</span>
                  </div>
                  <div>
                    <span className="block font-mono text-lg font-bold text-rose-400 tabular-nums">5+</span>
                    <span className="text-[11px] text-neutral-400">Palcos Temáticos</span>
                  </div>
                  <div>
                    <span className="block font-mono text-lg font-bold text-amber-400 tabular-nums">100%</span>
                    <span className="text-[11px] text-neutral-400">Seguro & Digital</span>
                  </div>
                </div>
              </div>

              {/* Selo de validação garantida */}
              <div className="mt-3 flex items-center justify-between px-2 text-xs text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  Validação de CPF & Telefone em tempo real
                </span>
                <span className="font-mono text-[11px] text-neutral-500">Distrito Anhembi</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
