'use client';

import { useFormContext } from './FormProvider';

export default function StepDeliverables() {
  const { formData, dispatch } = useFormContext();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Livrables et prerequis</h2>
        <p className="text-sm text-gray-500 mt-1">Les livrables et prerequis standards seront generes automatiquement par l&apos;IA. Ajoutez ici des elements specifiques a ce projet.</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Livrables specifiques additionnels</label>
        <textarea value={formData.livrables_specifiques} onChange={(e) => dispatch({ type: 'UPDATE_FIELD', payload: { field: 'livrables_specifiques', value: e.target.value } })} placeholder="Ex: Plan de migration detaille, Matrice RACI, Documentation API..." rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        <p className="text-xs text-gray-400 mt-1">Un livrable par ligne. Sera ajoute aux livrables standards generes par l&apos;IA.</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Prerequis specifiques</label>
        <textarea value={formData.prerequis_specifiques} onChange={(e) => dispatch({ type: 'UPDATE_FIELD', payload: { field: 'prerequis_specifiques', value: e.target.value } })} placeholder="Ex: Acces VPN fourni, Instance de test disponible, Referent technique designe..." rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        <p className="text-xs text-gray-400 mt-1">Un prerequis par ligne. Sera ajoute aux prerequis standards generes par l&apos;IA.</p>
      </div>
    </div>
  );
}
