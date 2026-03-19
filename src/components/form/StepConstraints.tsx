'use client';

import { useFormContext } from './FormProvider';

export default function StepConstraints() {
  const { formData, dispatch } = useFormContext();
  const { contraintes } = formData;

  const update = (field: string, value: string) => {
    dispatch({ type: 'UPDATE_CONTRAINTES', payload: { [field]: value } });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Contraintes</h2>
        <p className="text-sm text-gray-500 mt-1">Renseignez les contraintes du projet (tous les champs sont optionnels).</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
          <input type="text" value={contraintes.budget} onChange={(e) => update('budget', e.target.value)} placeholder="Ex: 50 000 EUR, Non communique" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Delais / Jalons</label>
          <input type="text" value={contraintes.delais} onChange={(e) => update('delais', e.target.value)} placeholder="Ex: MEP avant septembre 2026" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contraintes techniques</label>
          <textarea value={contraintes.contraintes_techniques} onChange={(e) => update('contraintes_techniques', e.target.value)} placeholder="Contraintes d'infrastructure, securite, performance..." rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contraintes reglementaires</label>
          <textarea value={contraintes.contraintes_reglementaires} onChange={(e) => update('contraintes_reglementaires', e.target.value)} placeholder="RGPD, secteur regule, certifications requises..." rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>
      </div>
    </div>
  );
}
