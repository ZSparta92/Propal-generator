'use client';

import { useFormContext } from './FormProvider';
import { PERIMETRE_FONCTIONNEL_OPTIONS } from '@/lib/constants';

export default function StepScope() {
  const { formData, dispatch } = useFormContext();
  const { perimetre } = formData;

  const toggleItem = (item: string) => {
    const current = perimetre.perimetre_fonctionnel;
    const updated = current.includes(item) ? current.filter((i) => i !== item) : [...current, item];
    dispatch({ type: 'UPDATE_PERIMETRE', payload: { perimetre_fonctionnel: updated } });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Perimetre</h2>
        <p className="text-sm text-gray-500 mt-1">Definissez le perimetre fonctionnel et technique du projet.</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Perimetre fonctionnel *</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {PERIMETRE_FONCTIONNEL_OPTIONS.map((item) => (
            <label key={item} className={`flex items-center px-3 py-2 border rounded-lg cursor-pointer transition-colors ${perimetre.perimetre_fonctionnel.includes(item) ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-300 hover:bg-gray-50'}`}>
              <input type="checkbox" checked={perimetre.perimetre_fonctionnel.includes(item)} onChange={() => toggleItem(item)} className="sr-only" />
              <span className="text-sm">{item}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Perimetre technique</label>
        <textarea value={perimetre.perimetre_technique} onChange={(e) => dispatch({ type: 'UPDATE_PERIMETRE', payload: { perimetre_technique: e.target.value } })} placeholder="Integrations prevues (SSO, API, autres outils), contraintes d'infrastructure..." rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
      </div>
    </div>
  );
}
