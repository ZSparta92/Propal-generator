'use client';

import { useFormContext } from './FormProvider';

export default function StepContext() {
  const { formData, dispatch } = useFormContext();
  const { contexte } = formData;

  const update = (field: string, value: string) => {
    dispatch({ type: 'UPDATE_CONTEXTE', payload: { [field]: value } });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Contexte et besoins</h2>
        <p className="text-sm text-gray-500 mt-1">Decrivez la situation actuelle du client et ses objectifs. Plus vous etes precis, meilleure sera la proposition generee.</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Situation actuelle *</label>
        <textarea value={contexte.situation_actuelle} onChange={(e) => update('situation_actuelle', e.target.value)} placeholder="Decrivez l'environnement actuel du client : outils utilises, processus en place, points de douleur..." rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Objectifs business *</label>
        <textarea value={contexte.objectifs_business} onChange={(e) => update('objectifs_business', e.target.value)} placeholder="Quels sont les objectifs du client ? Qu'espere-t-il atteindre avec ce projet ?" rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre d&apos;utilisateurs estime *</label>
        <input type="text" value={contexte.nb_utilisateurs} onChange={(e) => update('nb_utilisateurs', e.target.value)} placeholder="Ex: 50-100 agents, 500 utilisateurs finaux" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
      </div>
    </div>
  );
}
