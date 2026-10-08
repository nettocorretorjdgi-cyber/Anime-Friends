import React, { useState, useId } from 'react';
import {
  User,
  Mail,
  Phone,
  CreditCard,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Loader2,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import { RegistrationFormData, TicketType, ValidationErrors } from '../types';
import { EVENT_DAYS, PASSPORT_DISCOUNT, TICKET_TYPES } from '../data/event';
import {
  formatCPF,
  formatPhone,
  validateCPF,
  validateEmail,
  validateName,
  validatePhone,
  validateRegistrationForm,
} from '../lib/validation';
import { DaySelector } from './DaySelector';

interface RegistrationFormProps {
  onSubmit: (formData: RegistrationFormData, totalValue: number) => Promise<void>;
  isSubmitting: boolean;
  supabaseConfigured: boolean;
  onOpenSupabaseModal: () => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onSubmit,
  isSubmitting,
  supabaseConfigured,
  onOpenSupabaseModal,
}) => {
  const formId = useId();

  // Estado do formulário
  const [formData, setFormData] = useState<RegistrationFormData>({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    dias: ['quinta', 'sexta', 'sabado', 'domingo'], // Padrão com passaporte selecionado para melhor conversão
    tipoIngresso: 'meia_social',
    cosplayTag: '',
    newsletter: true,
    concordaTermos: true,
  });

  // Estado de erros e campos tocados
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Manipuladores de inputs com máscara
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData(prev => ({ ...prev, nome: val }));
    if (touched.nome) {
      const res = validateName(val);
      setErrors(prev => ({ ...prev, nome: res.isValid ? undefined : res.message }));
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData(prev => ({ ...prev, email: val }));
    if (touched.email) {
      const res = validateEmail(val);
      setErrors(prev => ({ ...prev, email: res.isValid ? undefined : res.message }));
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData(prev => ({ ...prev, telefone: formatted }));
    if (touched.telefone) {
      const res = validatePhone(formatted);
      setErrors(prev => ({ ...prev, telefone: res.isValid ? undefined : res.message }));
    }
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setFormData(prev => ({ ...prev, cpf: formatted }));
    if (touched.cpf) {
      const res = validateCPF(formatted);
      setErrors(prev => ({ ...prev, cpf: res.isValid ? undefined : res.message }));
    }
  };

  const handleDaysChange = (dias: string[]) => {
    setFormData(prev => ({ ...prev, dias }));
    if (touched.dias) {
      setErrors(prev => ({
        ...prev,
        dias: dias.length === 0 ? 'Selecione pelo menos 1 dia do evento.' : undefined,
      }));
    }
  };

  const handleBlur = (field: keyof RegistrationFormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));

    if (field === 'nome') {
      const res = validateName(formData.nome);
      setErrors(prev => ({ ...prev, nome: res.isValid ? undefined : res.message }));
    } else if (field === 'email') {
      const res = validateEmail(formData.email);
      setErrors(prev => ({ ...prev, email: res.isValid ? undefined : res.message }));
    } else if (field === 'telefone') {
      const res = validatePhone(formData.telefone);
      setErrors(prev => ({ ...prev, telefone: res.isValid ? undefined : res.message }));
    } else if (field === 'cpf') {
      const res = validateCPF(formData.cpf);
      setErrors(prev => ({ ...prev, cpf: res.isValid ? undefined : res.message }));
    } else if (field === 'dias') {
      setErrors(prev => ({
        ...prev,
        dias: formData.dias.length === 0 ? 'Selecione pelo menos 1 dia do evento.' : undefined,
      }));
    }
  };

  // Cálculo financeiro em tempo real
  const selectedDaysCount = formData.dias.length;
  const isPassport = selectedDaysCount === 4;

  const rawBaseSum = EVENT_DAYS.filter(d => formData.dias.includes(d.id)).reduce(
    (acc, cur) => acc + cur.price,
    0
  );

  const discountAmount = isPassport ? PASSPORT_DISCOUNT : 0;
  const basePriceAfterDiscount = Math.max(0, rawBaseSum - discountAmount);

  const selectedTicketTypeObj = TICKET_TYPES.find(t => t.id === formData.tipoIngresso) || TICKET_TYPES[0];
  const finalTotal = basePriceAfterDiscount * selectedTicketTypeObj.multiplier;

  // Submissão com validação estrita
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Marca todos os campos como tocados
    setTouched({
      nome: true,
      email: true,
      telefone: true,
      cpf: true,
      dias: true,
      concordaTermos: true,
    });

    const validation = validateRegistrationForm(formData);
    setErrors(validation.errors);

    if (!validation.isValid) {
      // Rola suavemente até o primeiro campo com erro
      const firstErrorField = Object.keys(validation.errors)[0];
      const el = document.getElementById(`${formId}-${firstErrorField}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus();
      }
      return;
    }

    await onSubmit(formData, finalTotal);
  };

  return (
    <section id="inscricao" className="relative scroll-mt-20 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Cabeçalho da Seção */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-rose-500 uppercase">
            <Sparkles className="h-4 w-4" />
            <span>Formulário de Credenciamento Oficial</span>
          </div>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-white sm:text-4xl text-balance">
            Faça sua Inscrição para o Anime Friends 2026
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-400 max-w-xl mx-auto">
            Preencha seus dados com atenção. Seu CPF e telefone serão validados pelo sistema para emissão do passaporte oficial individual.
          </p>
        </div>

        {/* Formulário Principal */}
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* Coluna do Formulário (8 colunas) */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8 backdrop-blur-sm lg:col-span-8 shadow-xl"
          >
            {/* Bloco 1: Dados Pessoais */}
            <div className="border-b border-neutral-800/80 pb-8">
              <div className="flex items-center gap-2 text-sm font-bold text-white mb-6">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-rose-600 text-xs text-white font-mono">
                  1
                </span>
                <span>Dados Pessoais do Titular</span>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Campo Nome Completo */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor={`${formId}-nome`}
                    className="block text-xs font-semibold text-neutral-200 mb-1.5"
                  >
                    Nome Completo <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      id={`${formId}-nome`}
                      type="text"
                      value={formData.nome}
                      onChange={handleNameChange}
                      onBlur={() => handleBlur('nome')}
                      placeholder="Ex: Lucas Gabriel dos Santos"
                      autoComplete="name"
                      className={`block w-full rounded-xl border bg-neutral-950/80 pl-10 pr-10 py-3 text-sm text-white placeholder-neutral-500 transition-colors focus:outline-none ${
                        errors.nome
                          ? 'border-rose-500 focus:border-rose-400 focus:ring-1 focus:ring-rose-500'
                          : touched.nome && !errors.nome
                          ? 'border-emerald-500/70 focus:border-emerald-400'
                          : 'border-neutral-800 focus:border-rose-500'
                      }`}
                    />
                    {touched.nome && !errors.nome && formData.nome && (
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  {errors.nome ? (
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-400">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>{errors.nome}</span>
                    </p>
                  ) : (
                    <p className="mt-1 text-[11px] text-neutral-400">
                      Informe nome e sobrenome como constam no seu documento com foto.
                    </p>
                  )}
                </div>

                {/* Campo E-mail */}
                <div>
                  <label
                    htmlFor={`${formId}-email`}
                    className="block text-xs font-semibold text-neutral-200 mb-1.5"
                  >
                    E-mail <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      id={`${formId}-email`}
                      type="email"
                      value={formData.email}
                      onChange={handleEmailChange}
                      onBlur={() => handleBlur('email')}
                      placeholder="seu.email@exemplo.com"
                      autoComplete="email"
                      className={`block w-full rounded-xl border bg-neutral-950/80 pl-10 pr-10 py-3 text-sm text-white placeholder-neutral-500 transition-colors focus:outline-none ${
                        errors.email
                          ? 'border-rose-500 focus:border-rose-400 focus:ring-1 focus:ring-rose-500'
                          : touched.email && !errors.email
                          ? 'border-emerald-500/70 focus:border-emerald-400'
                          : 'border-neutral-800 focus:border-rose-500'
                      }`}
                    />
                    {touched.email && !errors.email && formData.email && (
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  {errors.email ? (
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-400">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>{errors.email}</span>
                    </p>
                  ) : (
                    <p className="mt-1 text-[11px] text-neutral-400">
                      O voucher oficial e QR Code serão enviados para este endereço.
                    </p>
                  )}
                </div>

                {/* Campo Telefone */}
                <div>
                  <label
                    htmlFor={`${formId}-telefone`}
                    className="block text-xs font-semibold text-neutral-200 mb-1.5"
                  >
                    WhatsApp / Telefone <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
                      <Phone className="h-4 w-4" />
                    </div>
                    <input
                      id={`${formId}-telefone`}
                      type="tel"
                      value={formData.telefone}
                      onChange={handlePhoneChange}
                      onBlur={() => handleBlur('telefone')}
                      placeholder="(11) 98765-4321"
                      maxLength={15}
                      autoComplete="tel"
                      className={`block w-full rounded-xl border bg-neutral-950/80 pl-10 pr-10 py-3 text-sm text-white placeholder-neutral-500 transition-colors font-mono focus:outline-none ${
                        errors.telefone
                          ? 'border-rose-500 focus:border-rose-400 focus:ring-1 focus:ring-rose-500'
                          : touched.telefone && !errors.telefone
                          ? 'border-emerald-500/70 focus:border-emerald-400'
                          : 'border-neutral-800 focus:border-rose-500'
                      }`}
                    />
                    {touched.telefone && !errors.telefone && formData.telefone && (
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  {errors.telefone ? (
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-400">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>{errors.telefone}</span>
                    </p>
                  ) : (
                    <p className="mt-1 text-[11px] text-neutral-400">
                      Com DDD. Utilizado para avisos importantes do evento.
                    </p>
                  )}
                </div>

                {/* Campo CPF */}
                <div>
                  <label
                    htmlFor={`${formId}-cpf`}
                    className="block text-xs font-semibold text-neutral-200 mb-1.5"
                  >
                    CPF (Titular da Credencial) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
                      <CreditCard className="h-4 w-4" />
                    </div>
                    <input
                      id={`${formId}-cpf`}
                      type="text"
                      value={formData.cpf}
                      onChange={handleCpfChange}
                      onBlur={() => handleBlur('cpf')}
                      placeholder="000.000.000-00"
                      maxLength={14}
                      className={`block w-full rounded-xl border bg-neutral-950/80 pl-10 pr-10 py-3 text-sm text-white placeholder-neutral-500 transition-colors font-mono focus:outline-none ${
                        errors.cpf
                          ? 'border-rose-500 focus:border-rose-400 focus:ring-1 focus:ring-rose-500'
                          : touched.cpf && !errors.cpf
                          ? 'border-emerald-500/70 focus:border-emerald-400'
                          : 'border-neutral-800 focus:border-rose-500'
                      }`}
                    />
                    {touched.cpf && !errors.cpf && formData.cpf && (
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  {errors.cpf ? (
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-400">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>{errors.cpf}</span>
                    </p>
                  ) : (
                    <p className="mt-1 text-[11px] text-neutral-400">
                      Validado matematicamente com verificação de dígitos oficiais.
                    </p>
                  )}
                </div>

                {/* Campo Cosplay Tag (Opcional) */}
                <div>
                  <label
                    htmlFor={`${formId}-cosplay`}
                    className="block text-xs font-semibold text-neutral-200 mb-1.5"
                  >
                    Cosplay Tag / Nickname <span className="text-neutral-500">(Opcional)</span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
                      <Tag className="h-4 w-4" />
                    </div>
                    <input
                      id={`${formId}-cosplay`}
                      type="text"
                      value={formData.cosplayTag}
                      onChange={(e) => setFormData(prev => ({ ...prev, cosplayTag: e.target.value }))}
                      placeholder="Ex: Levi_Cos, SailorMoonSP"
                      maxLength={25}
                      className="block w-full rounded-xl border border-neutral-800 bg-neutral-950/80 pl-10 pr-4 py-3 text-sm text-white placeholder-neutral-500 transition-colors focus:border-rose-500 focus:outline-none"
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-neutral-400">
                    Será impresso na sua credencial personalizada caso preenchido!
                  </p>
                </div>
              </div>
            </div>

            {/* Bloco 2: Seleção dos Dias do Evento */}
            <div className="border-b border-neutral-800/80 py-8">
              <div className="flex items-center gap-2 text-sm font-bold text-white mb-6">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-rose-600 text-xs text-white font-mono">
                  2
                </span>
                <span>Escolha os Dias que Deseja Participar</span>
              </div>

              <DaySelector
                selectedDays={formData.dias}
                onChange={handleDaysChange}
                error={errors.dias}
              />
            </div>

            {/* Bloco 3: Categoria do Ingresso */}
            <div className="border-b border-neutral-800/80 py-8">
              <div className="flex items-center gap-2 text-sm font-bold text-white mb-6">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-rose-600 text-xs text-white font-mono">
                  3
                </span>
                <span>Categoria de Ingresso / Credencial</span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {TICKET_TYPES.map((type) => {
                  const isSelected = formData.tipoIngresso === type.id;
                  return (
                    <label
                      key={type.id}
                      className={`relative flex cursor-pointer flex-col justify-between rounded-xl border p-4 transition-all select-none ${
                        isSelected
                          ? 'border-rose-500 bg-rose-950/30 ring-1 ring-rose-500/40'
                          : 'border-neutral-800 bg-neutral-950/50 hover:border-neutral-700 hover:bg-neutral-950'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="tipoIngresso"
                              value={type.id}
                              checked={isSelected}
                              onChange={() =>
                                setFormData(prev => ({ ...prev, tipoIngresso: type.id }))
                              }
                              className="accent-rose-500"
                            />
                            <span className="font-semibold text-sm text-white">
                              {type.title}
                            </span>
                          </div>
                          <p className="mt-1.5 text-xs text-neutral-400 leading-relaxed">
                            {type.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between border-t border-neutral-800/60 pt-2 text-[11px]">
                        <span className="text-neutral-500 font-medium">
                          {type.badge}
                        </span>
                        {type.requirement && (
                          <span className="text-amber-400 font-medium text-[10px]">
                            {type.requirement}
                          </span>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Bloco 4: Termos e Consentimentos */}
            <div className="pt-8 space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.concordaTermos}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setFormData(prev => ({ ...prev, concordaTermos: checked }));
                    if (touched.concordaTermos) {
                      setErrors(prev => ({
                        ...prev,
                        concordaTermos: checked
                          ? undefined
                          : 'Você precisa aceitar os termos do evento.',
                      }));
                    }
                  }}
                  className="mt-1 h-4 w-4 rounded border-neutral-700 bg-neutral-950 accent-rose-500 focus:ring-rose-500"
                />
                <span className="text-xs text-neutral-300 leading-relaxed">
                  Declaro que li e concordo com o <strong>Regulamento Oficial do Anime Friends 2026</strong>, regras de convivência, política de credenciais nominais e autorização de uso de imagem durante o festival. <span className="text-rose-500">*</span>
                </span>
              </label>

              {errors.concordaTermos && (
                <p className="flex items-center gap-1.5 text-xs text-rose-400">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{errors.concordaTermos}</span>
                </p>
              )}

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.newsletter}
                  onChange={(e) =>
                    setFormData(prev => ({ ...prev, newsletter: e.target.checked }))
                  }
                  className="mt-1 h-4 w-4 rounded border-neutral-700 bg-neutral-950 accent-rose-500"
                />
                <span className="text-xs text-neutral-400">
                  Desejo receber avisos exclusivos por e-mail com horários dos palcos, sessões de autógrafos com cantores japoneses e novidades do evento.
                </span>
              </label>
            </div>

            {/* Botão de Envio Mobile/Desktop */}
            <div className="mt-8 pt-4 border-t border-neutral-800">
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 py-4 text-base font-bold text-white shadow-lg shadow-rose-600/30 transition-all hover:from-rose-500 hover:to-amber-400 hover:shadow-rose-600/50 active:scale-[0.99] disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Validando e Registrando Inscrição...</span>
                  </>
                ) : (
                  <>
                    <span>Confirmar Inscrição & Gerar Credencial</span>
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Coluna Lateral: Resumo do Pedido & Status do Banco (4 colunas) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Card Resumo do Pedido */}
            <div className="sticky top-24 rounded-2xl border border-neutral-800 bg-neutral-900/80 p-6 backdrop-blur-sm shadow-xl space-y-6">
              <div>
                <h3 className="font-display text-lg font-bold text-white">
                  Resumo da Inscrição
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Distrito Anhembi · São Paulo
                </p>
              </div>

              {/* Dias Selecionados */}
              <div className="space-y-3 border-t border-neutral-800/80 pt-4">
                <div className="text-xs font-semibold text-neutral-300">
                  Dias Selecionados ({selectedDaysCount})
                </div>

                {selectedDaysCount === 0 ? (
                  <p className="text-xs text-neutral-400 italic">
                    Nenhum dia selecionado ainda. Marque ao lado!
                  </p>
                ) : (
                  <div className="space-y-2">
                    {EVENT_DAYS.filter(d => formData.dias.includes(d.id)).map(day => (
                      <div
                        key={day.id}
                        className="flex items-center justify-between text-xs text-neutral-300"
                      >
                        <span className="flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                          <span>{day.weekday} ({day.dateShort})</span>
                        </span>
                        <span className="font-mono text-neutral-200 tabular-nums">
                          R$ {day.price.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Desconto de Passaporte */}
                {isPassport && (
                  <div className="flex items-center justify-between rounded-lg bg-emerald-950/40 border border-emerald-500/30 px-3 py-2 text-xs text-emerald-300">
                    <span className="font-medium">Desconto Passaporte 4 Dias</span>
                    <span className="font-mono font-bold tabular-nums">
                      - R$ {PASSPORT_DISCOUNT.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                )}
              </div>

              {/* Categoria */}
              <div className="border-t border-neutral-800/80 pt-4 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Categoria de Ingresso:</span>
                  <span className="font-semibold text-white">
                    {selectedTicketTypeObj.title}
                  </span>
                </div>
                {selectedTicketTypeObj.multiplier !== 1 && (
                  <div className="flex items-center justify-between text-xs text-neutral-400">
                    <span>Multiplicador de categoria:</span>
                    <span className="font-mono">{selectedTicketTypeObj.multiplier}x</span>
                  </div>
                )}
              </div>

              {/* Total Final */}
              <div className="border-t border-neutral-800/80 pt-4">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="block text-xs uppercase font-bold text-neutral-400 tracking-wider">
                      Valor Total
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      {selectedDaysCount > 0 ? 'Taxas já inclusas' : 'Selecione os dias'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-display text-3xl font-black text-white tabular-nums tracking-tight">
                      R$ {finalTotal.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status do Banco de Dados Supabase */}
              <div className="rounded-xl border border-neutral-800 bg-neutral-950/70 p-3.5 text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-neutral-300 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-rose-400" />
                    Destino dos Dados
                  </span>
                  <button
                    type="button"
                    onClick={onOpenSupabaseModal}
                    className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 underline"
                  >
                    Gerenciar
                  </button>
                </div>

                {supabaseConfigured ? (
                  <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Supabase Nuvem Ativo · Inscrição persistida no Postgres
                  </p>
                ) : (
                  <p className="text-[11px] text-amber-400 flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                    Modo Local / Pré-visualização · Clique para configurar Supabase
                  </p>
                )}
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
