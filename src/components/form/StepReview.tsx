'use client';

import { useState, useEffect } from 'react';
import { useFormContext } from './FormProvider';
import { calculateTotals, formatCurrency } from '@/lib/calculations';
import { buildSystemPrompt, buildUserPrompt } from '@/lib/prompt-builder';
import { findRelevantReferences, formatReferencesForPrompt } from '@/lib/references';

export default function StepReview() {
  const { formData, dispatch } = useFormContext();
  const [showPrompt, setShowPrompt] = useState(false);
  const [copied, setCopied] = useState(false);

  const update = (field: string, value: string) => {
    dispatch({ type: 'UPDATE_FIELD', payload: { field, value } });
  };
  const { client, projet, equipe, phases, pricing, contact_bl } = formData;
  const { totalHT, tva, totalTTC } = calculateTotals(pricing);
  const totalBL = phases.reduce((s, p) => s + p.jours_bluelemon, 0);
  const totalClient = phases.reduce((s, p) => s + p.jours_client, 0);

  const [currentDateString, setCurrentDateString] = useState('');
  useEffect(() => {
    setCurrentDateString(new Date().toLocaleDateString(formData.langue === 'EN' ? 'en-US' : 'fr-FR', formData.langue === 'EN' ? { month: 'long', day: 'numeric', year: 'numeric' } : undefined));
  }, [formData.langue]);

  const promptText = `Je vais te fournir mon template Word officiel BleuLemon contenant des balises entre accolades {}. Ta mission est d'utiliser tes capacités Python pour ouvrir ce document et remplacer CHAQUE balise par la valeur correspondante ci-dessous :

LISTE DES CORRESPONDANCES :
{titre_projet} = [${projet.titre_projet || 'Non spécifié'}]
{nom_client} = [${client.nom_entreprise || 'Non spécifié'}]
{region} = [${client.localisation || 'Non spécifié'}]
{nom_interlocuteur_client} = [${client.interlocuteur_nom || 'Non spécifié'}]
{reference} = [${formData.reference || 'Non spécifié'}]
{date_proposition} = [${currentDateString}]
{date_validite_proposition} = [${formData.date_validite_proposition || 'Non spécifié'}]
{consultant_relecteur} = [${contact_bl.nom || 'Non spécifié'}]
{total_jours_bl} = [${totalBL}]
{total_jours_client} = [${totalClient}]
{total_ht} = [${formatCurrency(totalHT)}]
{tva} = [${formatCurrency(tva)}]
{total_ttc} = [${formatCurrency(totalTTC)}]

DONNÉES POUR LES BOUCLES DE TABLEAUX :
Données pour {#charges} : [${phases.map((p) => `\n- charges_label: ${p.nom || ' '}, charges_phase: ${p.description || ' '}, charges_jours_bl: ${p.jours_bluelemon}, charges_jours_client: ${p.jours_client}`).join('')}\n]
Données pour {#prix} : [${pricing.map((p) => `\n- poste: ${p.poste || 'Non spécifié'}, quantite: ${p.quantite}, prix_unitaire: ${formatCurrency(p.prix_unitaire)}, total_ht_ligne: ${formatCurrency(p.total_ht)}, total_ttc_ligne: ${formatCurrency(p.total_ttc)}`).join('')}\n]

BRIEF POUR RÉDACTION DES SECTIONS NARRATIVES :
Contexte : [${formData.contexte.situation_actuelle || 'Non spécifié'}]
Objectifs : [${formData.contexte.objectifs_business || 'Non spécifié'}]
Outils : [${projet.outils_atlassian.join(', ') || 'Non spécifié'}]

Consigne de rédaction : Pour les sections narratives ({comprehension_besoin}, {demarche_proposee}, {ecosysteme_description}, {livrables}, {prerequis}, {planning}, {modalites}, {references_recentes}), rédige un contenu expert en tant que consultant senior BleuLemon en t'appuyant sur le brief ci-dessus.
IMPORTANT : Pour remplir le tableau {#charges}, utilise obligatoirement Python pour itérer sur la liste et créer une ligne complète (row) pour chaque phase. Ne mets jamais tout le texte dans une seule cellule.
Si une balise est vide ou non définie, remplace-la par un espace vide (" ") pour éviter l'affichage du texte "undefined".
Renvoie-moi le fichier .docx complété.`;

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
      <div className="border border-gray-200 rounded-lg p-4 space-y-1 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-700">Validité de la proposition</h3>
            <p className="text-sm text-gray-500">Date limite (ex: 31/12/2026)</p>
          </div>
          <input 
            type="text" 
            value={formData.date_validite_proposition} 
            onChange={(e) => update('date_validite_proposition', e.target.value)} 
            className="border border-gray-300 rounded-lg px-3 py-2 w-48 text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
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
      <div className="border border-green-200 bg-green-50 rounded-lg p-3 text-sm text-gray-600 flex justify-between items-center">
        <span>Ref: {formData.reference} | Date: {formData.date_creation} | Contact BL: {contact_bl.nom}</span>
      </div>

      <div className="mt-8 flex justify-center">
        <button 
          onClick={() => setShowPrompt(true)}
          className="text-sm text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-full font-medium transition-colors border border-blue-200"
        >
          🤖 Mode Économie : Générer le Prompt Manuel
        </button>
      </div>

      {showPrompt && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
              <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                <span>🤖</span> Prompt structuré pour Claude
              </h3>
              <button onClick={() => setShowPrompt(false)} className="text-gray-400 hover:text-gray-800 p-2 rounded-full hover:bg-gray-200 transition-colors">✕</button>
            </div>
            
            <div className="p-0 overflow-y-auto flex-1 bg-[#1e1e1e]">
              <pre className="text-sm whitespace-pre-wrap font-mono text-gray-300 p-6 selection:bg-blue-500/30">
                {promptText}
              </pre>
            </div>
            
            <div className="p-4 border-t bg-white flex justify-between items-center rounded-b-xl">
              <p className="text-sm text-gray-500">Copiez ce prompt et collez-le dans Claude.ai (en joignant votre template vierge) pour générer votre proposition commerciale au format .docx sans consommer vos crédits API.</p>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(promptText);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className={`px-6 py-2.5 rounded-lg font-semibold transition-all shadow-sm ${copied ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                {copied ? 'Copié ! ✅' : 'Copier le texte'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
