import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: 'Por que o formulário exige a validação do CPF e do Telefone?',
      answer:
        'A credencial do Anime Friends 2026 é nominal e intransferível para garantir a segurança no acesso às catracas do Distrito Anhembi e evitar cambismo. A validação matemática do CPF previne digitações incorretas que poderiam impedir a emissão do voucher.',
    },
    {
      question: 'Como funciona a Meia-Entrada Social?',
      answer:
        'A Meia-Entrada Social é um benefício aberto a qualquer pessoa. Para validá-la na entrada do evento, basta levar 1kg de alimento não perecível (exceto sal e açúcar) no dia da sua visita. Todos os alimentos arrecadados são doados para instituições de caridade de São Paulo.',
    },
    {
      question: 'Posso selecionar apenas 1 dia específico ou trocar os dias depois?',
      answer:
        'Sim! Você pode escolher livremente qualquer combinação de dias: apenas a Quinta, a Sexta, o Sábado ou o Domingo. Caso queira comparecer a todos, selecione a opção "Passaporte 4 Dias" para receber um desconto exclusivo de R$ 90,00.',
    },
    {
      question: 'Como os dados são salvos no banco de dados Supabase?',
      answer:
        'O sistema envia os registros validados diretamente para a tabela "inscricoes_anime_friends" no Supabase via API oficial com Row Level Security (RLS). Você pode inclusive conectar seu próprio projeto Supabase através do botão "Configurar Supabase" no topo da página e executar o script SQL gerado automaticamente.',
    },
    {
      question: 'Menores de idade precisam de acompanhante?',
      answer:
        'Crianças de até 11 anos e 11 meses têm entrada gratuita acompanhadas de um adulto pagante responsável. Jovens de 12 a 15 anos podem entrar desacompanhados com documento oficial com foto e autorização por escrito dos pais.',
    },
    {
      question: 'Quais são as regras para cosplays e adereços?',
      answer:
        'São permitidos adereços de cosplay confeccionados em EVA, espuma, madeira leve ou plástico. Armas de metal, lâminas cortantes, objetos pontiagudos ou armas de fogo reais (mesmo descarregadas) são terminantemente proibidos e passarão por triagem na portaria.',
    },
  ];

  const toggleFaq = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="scroll-mt-16 py-20 border-b border-neutral-800/80 bg-neutral-950">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-rose-500 uppercase">
            <HelpCircle className="h-4 w-4" />
            <span>Perguntas Frequentes</span>
          </div>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-white sm:text-4xl">
            Tire Suas Dúvidas Sobre a Inscrição
          </h2>
          <p className="mt-3 text-sm text-neutral-400">
            Tudo o que você precisa saber sobre credenciais, dias do evento e validação de dados.
          </p>
        </div>

        <div className="mt-12 space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-neutral-800 bg-neutral-900/50 transition-colors hover:border-neutral-700"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="flex w-full items-center justify-between p-5 text-left text-sm font-bold text-white"
                >
                  <span className="pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-neutral-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-rose-500' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs leading-relaxed text-neutral-300 border-t border-neutral-800/50 pt-3 animate-in fade-in duration-150">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
