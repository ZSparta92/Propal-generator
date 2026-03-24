'use client';

import { useState } from 'react';
import { FormProvider, useFormContext } from '@/components/form/FormProvider';
import Stepper from '@/components/ui/Stepper';
import StepClient from '@/components/form/StepClient';
import StepProject from '@/components/form/StepProject';
import StepContext from '@/components/form/StepContext';
import StepScope from '@/components/form/StepScope';
import StepConstraints from '@/components/form/StepConstraints';
import StepTeam from '@/components/form/StepTeam';
import StepPhases from '@/components/form/StepPhases';
import StepPricing from '@/components/form/StepPricing';
import StepDeliverables from '@/components/form/StepDeliverables';
import StepReview from '@/components/form/StepReview';
import ProposalPreview from '@/components/preview/ProposalPreview';
import { ClaudeResponse } from '@/types/claude-response';
import { FormData } from '@/types/proposal';

const STEPS = ['Client', 'Projet', 'Contexte', 'Perimetre', 'Contraintes', 'Equipe', 'Phases', 'Tarification', 'Livrables', 'Revue'];

const LOADING_MESSAGES = [
  'Analyse du brief client...',
  'Generation de la comprehension du besoin...',
  'Elaboration de la demarche proposee...',
  'Redaction des livrables et prerequis...',
  'Structuration du planning...',
  'Finalisation de la proposition...',
];

function ProposalForm() {
  const { formData } = useFormContext();
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [generatedContent, setGeneratedContent] = useState<ClaudeResponse | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState('');

  const isNextDisabled = () => {
    if (currentStep === 0 && !formData.client.nom_entreprise.trim()) return true;
    if (currentStep === 1 && !formData.projet.titre_projet.trim()) return true;
    if (currentStep === 6 && formData.phases.length === 0) return true;
    if (currentStep === 7 && formData.pricing.length === 0) return true;
    if (currentStep === 9 && !formData.reference.trim()) return true;
    return false;
  };

  const next = () => {
    if (isNextDisabled()) return;
    if (currentStep === 0 && !formData.client.nom_entreprise.trim()) {
      setError("Le nom de l'entreprise est requis.");
      return;
    }
    if (currentStep === 1 && !formData.projet.titre_projet.trim()) {
      setError("Le titre du projet est requis.");
      return;
    }
    if (currentStep === 6 && formData.phases.length === 0) {
      setError("Vous devez ajouter au moins une phase au projet.");
      return;
    }
    if (currentStep === 7 && formData.pricing.length === 0) {
      setError("Vous devez ajouter au moins un élément de tarification.");
      return;
    }
    if (currentStep === 9 && !formData.reference.trim()) {
      setError("La référence de la proposition est requise.");
      return;
    }
    
    setError('');
    setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const prev = () => {
    setError('');
    setCurrentStep((s) => Math.max(s - 1, 0));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError('');
    let msgIdx = 0;
    setLoadingMsg(LOADING_MESSAGES[0]);
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % LOADING_MESSAGES.length;
      setLoadingMsg(LOADING_MESSAGES[msgIdx]);
    }, 3000);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const errorText = await res.text();
        try {
          const errData = JSON.parse(errorText);
          throw new Error(errData.error || 'Erreur generation');
        } catch (parseError) {
          throw new Error(`Erreur serveur (${res.status}): ${errorText.substring(0, 100)}...`);
        }
      }
      const data = await res.json();
      setGeneratedContent(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      clearInterval(interval);
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedContent) return;
    setIsDownloading(true);
    try {
      const res = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData, generatedContent }),
      });
      if (!res.ok) throw new Error('Erreur telechargement');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${formData.client.nom_entreprise} - ${formData.projet.titre_projet} - BleuLemon.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur telechargement');
    } finally {
      setIsDownloading(false);
    }
  };

  if (generatedContent) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <ProposalPreview content={generatedContent} onContentChange={setGeneratedContent} />
        <div className="flex gap-4 mt-8 justify-center">
          <button onClick={() => setGeneratedContent(null)} className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Retour au formulaire</button>
          <button onClick={handleDownload} disabled={isDownloading} className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold">
            {isDownloading ? 'Telechargement...' : 'Telecharger le .docx'}
          </button>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <StepClient />;
      case 1: return <StepProject />;
      case 2: return <StepContext />;
      case 3: return <StepScope />;
      case 4: return <StepConstraints />;
      case 5: return <StepTeam />;
      case 6: return <StepPhases />;
      case 7: return <StepPricing />;
      case 8: return <StepDeliverables />;
      case 9: return <StepReview />;
      default: return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {isGenerating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md text-center shadow-2xl">
            <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-800">Generation en cours...</p>
            <p className="text-sm text-gray-500 mt-2">{loadingMsg}</p>
          </div>
        </div>
      )}
      <Stepper steps={STEPS} currentStep={currentStep} />
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {renderStep()}
        {error && <p className="text-red-600 text-sm mt-4 bg-red-50 p-3 rounded-lg">{error}</p>}
      </div>
      <div className="flex justify-between mt-6">
        <button onClick={prev} disabled={currentStep === 0} className={`px-5 py-2.5 rounded-lg ${currentStep === 0 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}>
          &lt; Precedent
        </button>
        {currentStep < STEPS.length - 1 ? (
          <button onClick={next} disabled={isNextDisabled()} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed">Suivant &gt;</button>
        ) : (
          <button onClick={handleGenerate} disabled={isGenerating} className="px-5 py-2.5 bg-blue-800 text-white rounded-lg hover:bg-blue-900 font-medium disabled:opacity-50 flex items-center gap-2">
            <span>✨</span> Generer la proposition
          </button>
        )}
      </div>
    </div>
  );
}

export default function ProposalPage() {
  return (
    <FormProvider>
      <ProposalForm />
    </FormProvider>
  );
}
