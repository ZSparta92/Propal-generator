import { ConsultantLevel, ProjectType } from '@/types/proposal';

export const TJM_RATES: Record<ConsultantLevel, number> = {
  [ConsultantLevel.JUNIOR]: 900,
  [ConsultantLevel.SENIOR]: 1100,
  [ConsultantLevel.PARTNER]: 1600,
};

export const TVA_RATE = 0.2;

export const SECTEURS = [
  'Technologie / Services IT',
  'Banque / Finance',
  'Assurance',
  'Industrie / Manufacturing',
  'Sante / Pharma',
  'Transport / Logistique',
  'Energie / Utilities',
  'Retail / Distribution',
  'Telecom / Media',
  'Secteur public',
  'Education / Recherche',
  'Autre',
];

export const PERIMETRE_FONCTIONNEL_OPTIONS = [
  'Incidents',
  'Demandes de service',
  'Changements',
  'Problemes',
  'Assets / CMDB',
  'Portail client',
  'Workflows personnalises',
  'Automatisations',
  'Rapports / Dashboards',
  'Integrations (API, SSO, etc.)',
  'Gestion de projet Agile',
  'DevOps / CI-CD',
];

export const DEFAULT_PHASES: Record<ProjectType, { nom: string; jours_bl: number; jours_client: number }[]> = {
  [ProjectType.IMPLEMENTATION]: [
    { nom: 'Initialisation / Kickoff', jours_bl: 1, jours_client: 1 },
    { nom: 'Conception / Ateliers', jours_bl: 4, jours_client: 3 },
    { nom: 'Implementation / Parametrage', jours_bl: 10, jours_client: 2 },
    { nom: 'Conduite du changement / Formation', jours_bl: 5, jours_client: 3 },
    { nom: 'Accompagnement post-MEP', jours_bl: 4, jours_client: 1 },
    { nom: 'Pilotage projet', jours_bl: 3, jours_client: 1 },
  ],
  [ProjectType.MIGRATION]: [
    { nom: 'Audit / Etat des lieux', jours_bl: 3, jours_client: 2 },
    { nom: 'Conception plan de migration', jours_bl: 3, jours_client: 1 },
    { nom: 'Migration technique', jours_bl: 8, jours_client: 2 },
    { nom: 'Recette / Validation', jours_bl: 3, jours_client: 3 },
    { nom: 'Bascule et accompagnement', jours_bl: 3, jours_client: 2 },
    { nom: 'Pilotage projet', jours_bl: 2, jours_client: 1 },
  ],
  [ProjectType.OPTIMISATION]: [
    { nom: 'Audit de l\'existant', jours_bl: 3, jours_client: 2 },
    { nom: 'Recommandations', jours_bl: 2, jours_client: 1 },
    { nom: 'Implementation des ameliorations', jours_bl: 6, jours_client: 2 },
    { nom: 'Validation et formation', jours_bl: 2, jours_client: 2 },
    { nom: 'Pilotage', jours_bl: 1, jours_client: 1 },
  ],
  [ProjectType.AUDIT]: [
    { nom: 'Cadrage et collecte', jours_bl: 2, jours_client: 2 },
    { nom: 'Analyse technique', jours_bl: 3, jours_client: 1 },
    { nom: 'Analyse fonctionnelle', jours_bl: 3, jours_client: 1 },
    { nom: 'Rapport et recommandations', jours_bl: 2, jours_client: 1 },
    { nom: 'Restitution', jours_bl: 1, jours_client: 1 },
  ],
  [ProjectType.FORMATION]: [
    { nom: 'Analyse des besoins', jours_bl: 1, jours_client: 1 },
    { nom: 'Preparation des supports', jours_bl: 3, jours_client: 0 },
    { nom: 'Sessions de formation', jours_bl: 3, jours_client: 3 },
    { nom: 'Support post-formation', jours_bl: 2, jours_client: 1 },
  ],
  [ProjectType.SUPPORT]: [
    { nom: 'Cadrage du service', jours_bl: 1, jours_client: 1 },
    { nom: 'Support niveau 2-3 (forfait mensuel)', jours_bl: 10, jours_client: 1 },
    { nom: 'Comite de suivi mensuel', jours_bl: 2, jours_client: 2 },
    { nom: 'Revue trimestrielle', jours_bl: 1, jours_client: 1 },
  ],
};
