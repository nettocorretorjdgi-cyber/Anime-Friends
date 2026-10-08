import { EventDay, TicketType } from '../types';

export const EVENT_INFO = {
  name: 'Anime Friends 2026',
  edition: '22ª Edição Especial',
  dates: '09 a 12 de Julho de 2026',
  location: 'Distrito Anhembi — São Paulo / SP',
  address: 'Av. Olavo Fontoura, 1209 - Santana, São Paulo - SP',
  openingHours: '10:00 às 22:00',
  heroImage: '/src/assets/images/anime_friends_hero_1791496933571.jpg',
  badgeImage: '/src/assets/images/anime_friends_badge_1791496943019.jpg',
};

export const EVENT_DAYS: EventDay[] = [
  {
    id: 'quinta',
    dayNumber: 1,
    weekday: 'Quinta-feira',
    date: '09 de Julho',
    dateShort: '09/07',
    title: 'Abertura & Arena Games',
    highlight: 'Torneios de E-Sports, Anime Music Quiz, estande de games retrô e estreia do Artist\'s Alley.',
    price: 90,
    badgeColor: 'from-amber-500 to-orange-600',
  },
  {
    id: 'sexta',
    dayNumber: 2,
    weekday: 'Sexta-feira',
    date: '10 de Julho',
    dateShort: '10/07',
    title: 'Shows Internacionais & Dublagem',
    highlight: 'Painéis com dubladores clássicos de animes, bandas japonesas de J-Rock e Meet & Greet.',
    price: 110,
    badgeColor: 'from-rose-500 to-red-600',
  },
  {
    id: 'sabado',
    dayNumber: 3,
    weekday: 'Sábado',
    date: '11 de Julho',
    dateShort: '11/07',
    title: 'Cosplay Summit & Super Concertos',
    highlight: 'Eliminatória nacional de Cosplay, shows no Palco Principal, arena K-Pop e ativações temáticas.',
    price: 140,
    badgeColor: 'from-fuchsia-500 to-pink-600',
  },
  {
    id: 'domingo',
    dayNumber: 4,
    weekday: 'Domingo',
    date: '12 de Julho',
    dateShort: '12/07',
    title: 'Grande Final & Anime Song All-Stars',
    highlight: 'Cerimônia de premiação, Grande Final WCS, orquestra de temas de animes e encerramento épico.',
    price: 130,
    badgeColor: 'from-violet-500 to-purple-600',
  },
];

export const PASSPORT_DISCOUNT = 90; // Desconto de R$ 90 para quem seleciona todos os 4 dias!
// Soma dos 4 dias individuais = 90 + 110 + 140 + 130 = R$ 470
// Passaporte 4 Dias = R$ 380

export interface TicketTypeOption {
  id: TicketType;
  title: string;
  description: string;
  badge: string;
  multiplier: number; // Porcentagem do valor base
  requirement?: string;
}

export const TICKET_TYPES: TicketTypeOption[] = [
  {
    id: 'meia_social',
    title: 'Meia-Entrada Social',
    description: 'Válido para todos mediante doação de 1kg de alimento não perecível na entrada do evento.',
    badge: 'Mais Popular',
    multiplier: 1.0, // preço de tabela promocional
    requirement: 'Entregar 1kg de alimento não perecível na portaria',
  },
  {
    id: 'meia_estudante',
    title: 'Meia Estudante / PCD / Idoso',
    description: 'Benefício da Lei da Meia-Entrada para estudantes com CIE, professores da rede pública, PCDs e idosos 60+.',
    badge: 'Legal',
    multiplier: 1.0,
    requirement: 'Apresentar documento de comprovação no acesso',
  },
  {
    id: 'inteira',
    title: 'Entrada Inteira',
    description: 'Acesso regular sem necessidade de comprovação de benefício ou doação de alimento.',
    badge: 'Padrão',
    multiplier: 2.0,
  },
  {
    id: 'vip_pass',
    title: 'Credencial VIP Pass',
    description: 'Entrada antecipada 1h antes, fila expressa, acesso à área VIP perto do palco, ecobag oficial e credencial holográfica colecionável.',
    badge: 'Experiência VIP',
    multiplier: 2.5,
  },
];
