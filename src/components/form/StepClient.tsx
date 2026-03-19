'use client';

import { useFormContext } from './FormProvider';
import { SECTEURS } from '@/lib/constants';

export default function StepClient() {
  const { formData, dispatch } = useFormContext();
  const { client } = formData;

  const update = (field: string, value: string) => {
    dispatch({ type: 'UPDATE_CLIENT', payload: { [field]: value } });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Informations client</h2>
        <p className="text-sm text-gray-500 mt-1">Identifiez le client et son interlocuteur principal.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l&apos;entreprise *</label>
          <input type="text" value={client.nom_entreprise} onChange={(e) => update('nom_entreprise', e.target.value)} placeholder="Ex: CORPIOT" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Secteur d&apos;activite *</label>
          <select value={client.secteur} onChange={(e) => update('secteur', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">Selectionnez un secteur</option>
            {SECTEURS.map((s) => (<option key={s} value={s}>{s}</option>))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Taille *</label>
          <select value={client.taille} onChange={(e) => update('taille', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="TPE (&lt; 10 salaries)">TPE (&lt; 10 salaries)</option>
            <option value="PME (10-249 salaries)">PME (10-249 salaries)</option>
            <option value="ETI (250-4999 salaries)">ETI (250-4999 salaries)</option>
            <option value="GE (5000+ salaries)">GE (5000+ salaries)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Localisation *</label>
          <input type="text" value={client.localisation} onChange={(e) => update('localisation', e.target.value)} placeholder="Ex: Paris, Lyon, Marseille" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom interlocuteur *</label>
          <input type="text" value={client.interlocuteur_nom} onChange={(e) => update('interlocuteur_nom', e.target.value)} placeholder="Ex: Marie Dupont" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
          <input type="text" value={client.role} onChange={(e) => update('role', e.target.value)} placeholder="Ex: DSI, Responsable IT" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
        <input type="email" value={client.email} onChange={(e) => update('email', e.target.value)} placeholder="Ex: marie.dupont@corpiot.fr" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
      </div>
    </div>
  );
}
