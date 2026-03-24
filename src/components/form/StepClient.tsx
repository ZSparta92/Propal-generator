'use client';

import { useFormContext } from './FormProvider';
import { SECTEURS } from '@/lib/constants';

export default function StepClient() {
  const { formData, dispatch } = useFormContext();
  const { client } = formData;

  const update = (field: string, value: string) => {
    dispatch({ type: 'UPDATE_CLIENT', payload: { [field]: value } });
  };

  const fillTestData = () => {
    dispatch({
      type: 'SET_ALL_DATA',
      payload: {
        ...formData,
        langue: 'FR',
        client: {
          nom_entreprise: 'Air France - KLM',
          secteur: 'Transport',
          taille: 'GE (5000+ salaries)',
          localisation: 'Roissy',
          interlocuteur_nom: 'Marc Lavoine',
          role: 'CTO',
          email: 'marc.lavoine@airfranceklm.com'
        },
        projet: {
          titre_projet: 'Migration JSM Cloud',
          type_projet: 'Migration',
          deployment: 'Cloud',
          outils_atlassian: ['Jira Service Management', 'Confluence', 'Opsgenie']
        },
        contexte: {
          situation_actuelle: "Le Groupe Air France - KLM utilise actuellement une solution ITSM vieillissante (ServiceNow On-Premise) qui ne répond plus aux exigences d'agilité et de performance des équipes métiers. Les processus de gestion des incidents et des demandes sont lents et fragmentés.",
          objectifs_business: "L'objectif principal est d'harmoniser et de moderniser le centre de services IT en migrant vers Jira Service Management Cloud. Il s'agit également de réduire la dette technique, d'optimiser les coûts de licence et d'améliorer le TTM (Time To Market) par l'automatisation des workflows.",
          nb_utilisateurs: '15000'
        },
        perimetre: {
          perimetre_fonctionnel: ['Gestion des Incidents', 'Gestion des Demandes', 'Catalogue de services'],
          perimetre_technique: 'Intégration avec l\'Active Directory (Azure AD), migration de l\'historique CI/CD et interconnexion avec Opsgenie pour l\'astreinte de niveau 1.'
        },
        phases: [
          { nom: 'Cadrage et Ateliers', description: 'Définition de l\'architecture cible et des processus ITSM.', jours_bluelemon: 5, jours_client: 3 },
          { nom: 'Configuration JSM', description: 'Paramétrage des portails, workflows et SLA.', jours_bluelemon: 10, jours_client: 2 },
          { nom: 'Migration des données', description: 'Reprise de l\'historique des tickets existants.', jours_bluelemon: 7, jours_client: 1 },
          { nom: 'UAT et Recette', description: 'Tests utilisateurs et validation métier.', jours_bluelemon: 3, jours_client: 5 },
          { nom: 'Formation et Go-Live', description: 'Accompagnement au changement et support post-démarrage.', jours_bluelemon: 4, jours_client: 2 }
        ],
        pricing: [
          { poste: 'Prestation de conseil et migration', quantite: 29, prix_unitaire: 1100, total_ht: 31900, tva: 6380, total_ttc: 38280 },
          { poste: 'Licences JSM Premium (Année 1)', quantite: 1, prix_unitaire: 15400, total_ht: 15400, tva: 3080, total_ttc: 18480 }
        ],
        reference: 'BL-2026-AF-001',
        date_validite_proposition: '30/06/2026'
      } as any
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button onClick={fillTestData} className="text-sm bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-1.5 rounded-md font-medium flex items-center gap-2 transition-colors border border-purple-200 shadow-sm">
          <span>✨</span> Simuler des données de test
        </button>
      </div>
      <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center bg-blue-50 p-4 rounded-xl border border-blue-100">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Langue de la proposition</h2>
          <p className="text-sm text-gray-600">Choisissez la langue de génération du document.</p>
        </div>
        <div className="flex bg-white rounded-lg p-1 border border-gray-200">
          <button
            onClick={() => dispatch({ type: 'UPDATE_FIELD', payload: { field: 'langue', value: 'FR' } })}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${formData.langue === 'FR' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Français
          </button>
          <button
            onClick={() => dispatch({ type: 'UPDATE_FIELD', payload: { field: 'langue', value: 'EN' } })}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${formData.langue === 'EN' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Anglais
          </button>
        </div>
      </div>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Secteur d&apos;activite</label>
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input type="email" value={client.email} onChange={(e) => update('email', e.target.value)} placeholder="Ex: marie.dupont@corpiot.fr" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
      </div>
    </div>
  );
}
