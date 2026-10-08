export type TicketType = 'meia_social' | 'meia_estudante' | 'inteira' | 'vip_pass';

export interface EventDay {
  id: string;
  dayNumber: number;
  weekday: string;
  date: string;
  dateShort: string;
  title: string;
  highlight: string;
  price: number;
  badgeColor: string;
}

export interface RegistrationFormData {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  dias: string[];
  tipoIngresso: TicketType;
  cosplayTag: string;
  newsletter: boolean;
  concordaTermos: boolean;
}

export interface ValidationErrors {
  nome?: string;
  email?: string;
  telefone?: string;
  cpf?: string;
  dias?: string;
  tipoIngresso?: string;
  concordaTermos?: string;
  general?: string;
}

export interface RegistrationRecord {
  id: string;
  created_at: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  dias: string[];
  tipo_ingresso: string;
  cosplay_tag?: string;
  valor_total: number;
  ticket_code: string;
  status: 'confirmado' | 'pendente';
  armazenado_em: 'supabase' | 'local';
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConfigured: boolean;
}
