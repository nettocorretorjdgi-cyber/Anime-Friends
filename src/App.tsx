/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { RegistrationForm } from './components/RegistrationForm';
import { DaySelector } from './components/DaySelector';
import { EventAttractions } from './components/EventAttractions';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { TicketBadgeModal } from './components/TicketBadgeModal';
import { SupabaseModal } from './components/SupabaseModal';
import { AdminModal } from './components/AdminModal';
import {
  fetchAllRegistrations,
  getSupabaseConfig,
  submitRegistration,
} from './lib/supabase';
import { RegistrationFormData, RegistrationRecord } from './types';
import { AlertCircle, CheckCircle2, Sparkles, Info } from 'lucide-react';

export default function App() {
  const [supabaseConfigured, setSupabaseConfigured] = useState(false);
  const [records, setRecords] = useState<RegistrationRecord[]>([]);
  const [storageSource, setStorageSource] = useState<'supabase' | 'local'>('local');

  // Modais
  const [activeBadgeRecord, setActiveBadgeRecord] = useState<RegistrationRecord | null>(null);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Notificações flutuantes
  const [toast, setToast] = useState<{
    type: 'success' | 'warning' | 'info';
    message: string;
  } | null>(null);

  // Verifica configuração do Supabase e carrega registros
  const refreshData = async () => {
    const config = getSupabaseConfig();
    setSupabaseConfigured(config.isConfigured);

    const result = await fetchAllRegistrations();
    setRecords(result.records);
    setStorageSource(result.source);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const showToast = (message: string, type: 'success' | 'warning' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  // Envio da inscrição
  const handleRegistrationSubmit = async (
    formData: RegistrationFormData,
    totalValue: number
  ) => {
    setIsSubmitting(true);
    try {
      const response = await submitRegistration(formData, totalValue);
      
      if (response.success) {
        await refreshData();
        setActiveBadgeRecord(response.record);

        if (response.storageTarget === 'supabase') {
          showToast('Inscrição gravada com sucesso no Supabase na nuvem!', 'success');
        } else if (response.warningMessage) {
          showToast(response.warningMessage, 'warning');
        } else {
          showToast('Inscrição confirmada com sucesso!', 'success');
        }
      }
    } catch (err: any) {
      showToast(
        `Erro ao processar inscrição: ${err.message || 'Tente novamente.'}`,
        'warning'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScrollToForm = () => {
    const el = document.getElementById('inscricao');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectDayFromAttractions = (dayId: string) => {
    handleScrollToForm();
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      
      {/* Toast Notifier */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md animate-in slide-in-from-bottom-5 duration-300">
          <div
            className={`flex items-start gap-3 rounded-xl border p-4 shadow-2xl backdrop-blur-md ${
              toast.type === 'success'
                ? 'border-emerald-500/40 bg-emerald-950/90 text-emerald-200'
                : toast.type === 'warning'
                ? 'border-amber-500/40 bg-amber-950/90 text-amber-200'
                : 'border-blue-500/40 bg-blue-950/90 text-blue-200'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400 mt-0.5" />
            ) : toast.type === 'warning' ? (
              <AlertCircle className="h-5 w-5 shrink-0 text-amber-400 mt-0.5" />
            ) : (
              <Info className="h-5 w-5 shrink-0 text-blue-400 mt-0.5" />
            )}
            <div className="flex-1 text-xs">
              <p className="font-semibold">{toast.message}</p>
            </div>
            <button
              onClick={() => setToast(null)}
              className="text-neutral-400 hover:text-white text-xs font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Top Header */}
      <Header
        supabaseConfigured={supabaseConfigured}
        registeredCount={records.length}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onScrollToForm={handleScrollToForm}
      />

      <main className="flex-1">
        {/* Banner Hero */}
        <Hero onScrollToForm={handleScrollToForm} />

        {/* Atrações e Cronograma dos 4 dias */}
        <EventAttractions onSelectDayInForm={handleSelectDayFromAttractions} />

        {/* Formulário Oficial de Inscrição */}
        <RegistrationForm
          onSubmit={handleRegistrationSubmit}
          isSubmitting={isSubmitting}
          supabaseConfigured={supabaseConfigured}
          onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        />

        {/* Dúvidas Frequentes */}
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)} />

      {/* Modal 1: Credencial / Badge Digital Gerada */}
      <TicketBadgeModal
        record={activeBadgeRecord}
        onClose={() => setActiveBadgeRecord(null)}
        onNewRegistration={() => {
          setActiveBadgeRecord(null);
          handleScrollToForm();
        }}
      />

      {/* Modal 2: Configuração e Script SQL do Supabase */}
      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onConfigChanged={refreshData}
      />

      {/* Modal 3: Painel do Organizador (Inscrições Cadastradas) */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        records={records}
        onSelectRecord={(rec) => setActiveBadgeRecord(rec)}
        storageSource={storageSource}
      />
    </div>
  );
}
