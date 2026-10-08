import { RegistrationFormData, ValidationErrors } from '../types';

/**
 * Remove qualquer caractere que não seja número
 */
export function onlyDigits(val: string): string {
  return val.replace(/\D/g, '');
}

/**
 * Aplica máscara de CPF no formato 000.000.000-00
 */
export function formatCPF(value: string): string {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
}

/**
 * Validação rigorosa de CPF brasileiro (Algoritmo Módulo 11 oficial)
 */
export function validateCPF(rawCpf: string): { isValid: boolean; message?: string } {
  const digits = onlyDigits(rawCpf);

  if (!digits) {
    return { isValid: false, message: 'O CPF é obrigatório.' };
  }

  if (digits.length !== 11) {
    return { isValid: false, message: 'O CPF deve conter exatamente 11 dígitos.' };
  }

  // Verifica se todos os dígitos são iguais (ex: 111.111.111-11)
  if (/^(\d)\1{10}$/.test(digits)) {
    return { isValid: false, message: 'CPF inválido (dígitos repetidos).' };
  }

  // Cálculo do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(digits.charAt(i), 10) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;

  if (remainder !== parseInt(digits.charAt(9), 10)) {
    return { isValid: false, message: 'CPF inválido. Verifique os números informados.' };
  }

  // Cálculo do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(digits.charAt(i), 10) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;

  if (remainder !== parseInt(digits.charAt(10), 10)) {
    return { isValid: false, message: 'CPF inválido. Dígito verificador incorreto.' };
  }

  return { isValid: true };
}

/**
 * Aplica máscara de telefone brasileiro: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
 */
export function formatPhone(value: string): string {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

/**
 * Validação de telefone brasileiro (DDD válido + celular/fixo)
 */
export function validatePhone(phone: string): { isValid: boolean; message?: string } {
  const digits = onlyDigits(phone);

  if (!digits) {
    return { isValid: false, message: 'O telefone é obrigatório.' };
  }

  if (digits.length < 10 || digits.length > 11) {
    return { isValid: false, message: 'Telefone incompleto. Informe DDD + número (10 ou 11 dígitos).' };
  }

  const ddd = parseInt(digits.slice(0, 2), 10);
  // DDDs válidos no Brasil variam de 11 a 99
  if (ddd < 11 || ddd > 99) {
    return { isValid: false, message: 'DDD inválido. Informe um código de área brasileiro válido.' };
  }

  // Para celular (11 dígitos), o terceiro dígito geralmente é 9
  if (digits.length === 11 && digits.charAt(2) !== '9') {
    return { isValid: false, message: 'Celulares devem começar com o dígito 9 após o DDD.' };
  }

  return { isValid: true };
}

/**
 * Validação de e-mail com expressão regular padronizada
 */
export function validateEmail(email: string): { isValid: boolean; message?: string } {
  const trimmed = email.trim();
  if (!trimmed) {
    return { isValid: false, message: 'O e-mail é obrigatório.' };
  }

  // Regex robusta para validação de e-mail
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, message: 'Formato de e-mail inválido. Exemplo: nome@email.com' };
  }

  return { isValid: true };
}

/**
 * Validação de nome completo (pelo menos 2 palavras, letras e acentos)
 */
export function validateName(name: string): { isValid: boolean; message?: string } {
  const trimmed = name.trim();
  if (!trimmed) {
    return { isValid: false, message: 'O nome completo é obrigatório.' };
  }

  if (trimmed.length < 3) {
    return { isValid: false, message: 'O nome deve ter no mínimo 3 caracteres.' };
  }

  const parts = trimmed.split(/\s+/).filter(p => p.length > 0);
  if (parts.length < 2) {
    return { isValid: false, message: 'Por favor, insira seu nome completo (nome e sobrenome).' };
  }

  if (!/^[a-zA-ZÀ-ÿ\s'.]+$/.test(trimmed)) {
    return { isValid: false, message: 'O nome não deve conter números ou símbolos especiais.' };
  }

  return { isValid: true };
}

/**
 * Valida todos os campos do formulário antes do envio
 */
export function validateRegistrationForm(formData: RegistrationFormData): {
  isValid: boolean;
  errors: ValidationErrors;
} {
  const errors: ValidationErrors = {};

  const nameVal = validateName(formData.nome);
  if (!nameVal.isValid) errors.nome = nameVal.message;

  const emailVal = validateEmail(formData.email);
  if (!emailVal.isValid) errors.email = emailVal.message;

  const phoneVal = validatePhone(formData.telefone);
  if (!phoneVal.isValid) errors.telefone = phoneVal.message;

  const cpfVal = validateCPF(formData.cpf);
  if (!cpfVal.isValid) errors.cpf = cpfVal.message;

  if (!formData.dias || formData.dias.length === 0) {
    errors.dias = 'Selecione pelo menos 1 dia do evento para continuar.';
  }

  if (!formData.concordaTermos) {
    errors.concordaTermos = 'Você precisa aceitar o regulamento do Anime Friends para prosseguir.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
