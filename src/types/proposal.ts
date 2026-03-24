export enum ProjectType {
  IMPLEMENTATION = 'Implementation',
  MIGRATION = 'Migration',
  OPTIMISATION = 'Optimisation',
  AUDIT = 'Audit',
  FORMATION = 'Formation',
  SUPPORT = 'Support / TMA',
}

export enum ConsultantLevel {
  JUNIOR = 'Junior',
  SENIOR = 'Senior',
  PARTNER = 'Partner',
}

export enum AtlassianTool {
  JIRA_SOFTWARE = 'Jira Software',
  JSM = 'Jira Service Management',
  CONFLUENCE = 'Confluence',
  JIRA_ALIGN = 'Jira Align',
  BITBUCKET = 'Bitbucket',
  OPSGENIE = 'Opsgenie',
  STATUSPAGE = 'Statuspage',
  COMPASS = 'Compass',
}

export enum Deployment {
  CLOUD = 'Cloud',
  DATA_CENTER = 'Data Center',
  SERVER = 'Server',
}

export interface ClientInfo {
  nom_entreprise: string;
  secteur: string;
  taille: string;
  localisation: string;
  interlocuteur_nom: string;
  role: string;
  email: string;
}

export interface ProjectInfo {
  titre_projet: string;
  type_projet: ProjectType;
  outils_atlassian: AtlassianTool[];
  deployment: Deployment;
}

export interface ContexteBesoins {
  situation_actuelle: string;
  objectifs_business: string;
  nb_utilisateurs: string;
}

export interface PerimetreFonctionnel {
  perimetre_fonctionnel: string[];
  perimetre_technique: string;
}

export interface Contraintes {
  budget: string;
  delais: string;
  contraintes_techniques: string;
  contraintes_reglementaires: string;
}

export interface TeamMember {
  nom: string;
  role: string;
  niveau: ConsultantLevel;
}

export interface ContactBL {
  nom: string;
  email: string;
  telephone: string;
}

export interface PhaseEstimation {
  nom: string;
  description: string;
  jours_bluelemon: number;
  jours_client: number;
}

export interface PricingItem {
  poste: string;
  quantite: number;
  prix_unitaire: number;
  total_ht: number;
  total_ttc: number;
}

export interface FormData {
  langue: 'FR' | 'EN';
  client: ClientInfo;
  projet: ProjectInfo;
  contexte: ContexteBesoins;
  perimetre: PerimetreFonctionnel;
  contraintes: Contraintes;
  equipe: TeamMember[];
  contact_bl: ContactBL;
  phases: PhaseEstimation[];
  pricing: PricingItem[];
  livrables_specifiques: string;
  prerequis_specifiques: string;
  reference: string;
  date_creation: string;
  date_validite_proposition: string;
}
