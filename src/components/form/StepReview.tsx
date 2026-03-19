'use client';

import { useFormContext } from './FormProvider';
import { calculateTotals, formatCurrency } from '@/lib/calculations';

export default function StepReview() {
  const { formData } = useFormContext();
  const { client, projet, equipe, phases, pricing, contact_bl } = formData;
  const { totalHT, tva, totalTTC } = calculateTotals(pricing);
  const totalBL = phases.reduce((s, p) => s + p.jours_bluelemon, 0);
  const totalClient = phases.reduce((s, p) => s + p.jours_client, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Recapitulatif</h2>
        <p className="text-sm text-gray-500 mt-1">Verifiez les informations avant de generer la proposition.</p>
      </div>
      <div className="border border-gray-200 rounded-lg p-4 space-y-1">
        <h3 className="font-semibold text-gray-700">Client</h3>
        <div className="grid grid-cols-2 gap-x-4 text-sm text-gray-600">
          <p>Entreprise : <span className="font-medium text-gray-800">{client.nom_entreprise}</span></p>
          <p>Secteur : <span className="font-medium text-gray-800">{client.secteur}</span></p>
          <p>Taille : <span className="font-medium text-gray-800">{client.taille}</span></p>
          <p>Localisation : <span className="font-medium text-gray-800">{client.localisation}</span></p>
          <p>Contact : <span className="font-medium text-gray-800">{client.interlocuteur_nom} ({client.role})</span></p>
          <p>Email : <span className="font-medium text-gray-800">{client.email}</span></p>
        </div>
      </div>
      <div className="border border-gray-200 rounded-lg p-4 space-y-1">
        <h3 className="font-semibold text-gray-700">Projet</h3>
        <div className="grid grid-cols-2 gap-x-4 text-sm text-gray-600">
          <p>Titre : <span className="font-medium text-gray-800">{projet.titre_projet}</span></p>
          <p>Deploiement : <span className="font-medium text-gray-800">{projet.deployment}</span></p>
          <p>Type : <span className="font-medium text-gray-800">{projet.type_projet}</span></p>
        </div>
        <p className="text-sm text-gray-600">Outils : <span className="font-medium text-gray-800">{projet.outils_atlassian.join(', ')}</span></p>
      </div>
      <div className="border border-gray-200 rounded-lg p-4 space-y-1">
        <h3 className="font-semibold text-gray-700">Equipe BleuLemon</h3>
        {equipe.map((m, i) => (
          <p key={i} className="text-sm text-gray-600">{m.nom} — {m.role} ({m.niveau}, {m.niveau === 'Partner' ? '1600' : m.niveau === 'Senior' ? '1100' : '900'}EUR/j)</p>
        ))}
      </div>
      <div className="border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-700 mb-2">Phases</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left font-semibold text-gray-600">
              <th className="pb-1">Phase</th>
              <th className="pb-1 text-right">Jours BL</th>
              <th className="pb-1 text-right">Jours Client</th>
            </tr>
          </thead>
          <tbody>
            {phases.map((p, i) => (
              <tr key={i} className="text-gray-600 border-t border-gray-100">
                <td className="py-1">{p.nom}</td>
                <td className="py-1 text-right">{p.jours_bluelemon}</td>
                <td className="py-1 text-right">{p.jours_client}</td>
              </tr>
            ))}
            <tr className="font-bold text-gray-800 border-t border-gray-300">
              <td className="py-1">TOTAL</td>
              <td className="py-1 text-right">{totalBL}</td>
              <td className="py-1 text-right">{totalClient}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-700 mb-2">Budget</h3>
        {pricing.map((item, i) => (
          <div key={i} className="flex justify-between text-sm text-gray-600">
            <span>{item.poste} ({item.quantite}j x {formatCurrency(item.prix_unitaire)})</span>
            <span className="font-medium">{formatCurrency(item.total_ht)}</span>
          </div>
        ))}
        <div className="mt-3 pt-2 border-t border-blue-200 space-y-1">
          <div className="flex justify-between text-sm text-gray-600"><span>Total HT</span><span>{formatCurrency(totalHT)}</span></div>
          <div className="flex justify-between text-sm text-gray-600"><span>TVA (20%)</span><span>{formatCurrency(tva)}</span></div>
          <div className="flex justify-between text-lg font-bold text-blue-700"><span>Total TTC</span><span>{formatCurrency(totalTTC)}</span></div>
        </div>
      </div>
      <div className="border border-green-200 bg-green-50 rounded-lg p-3 text-sm text-gray-600">
        Ref: {formData.reference} | Date: {formData.date_creation} | Contact BL: {contact_bl.nom}
      </div>
    </div>
  );
}
