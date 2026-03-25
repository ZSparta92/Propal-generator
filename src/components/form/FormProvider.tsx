'use client';

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { FormData, ProjectType, ConsultantLevel, Deployment, ClientInfo, ProjectInfo, ContexteBesoins, PerimetreFonctionnel, Contraintes, TeamMember, PhaseEstimation, PricingItem, ContactBL } from '@/types/proposal';

type FormAction =
  | { type: 'UPDATE_CLIENT'; payload: Partial<ClientInfo> }
  | { type: 'UPDATE_PROJECT'; payload: Partial<ProjectInfo> }
  | { type: 'UPDATE_CONTEXTE'; payload: Partial<ContexteBesoins> }
  | { type: 'UPDATE_PERIMETRE'; payload: Partial<PerimetreFonctionnel> }
  | { type: 'UPDATE_CONTRAINTES'; payload: Partial<Contraintes> }
  | { type: 'SET_TEAM'; payload: TeamMember[] }
  | { type: 'SET_PHASES'; payload: PhaseEstimation[] }
  | { type: 'SET_PRICING'; payload: PricingItem[] }
  | { type: 'UPDATE_CONTACT_BL'; payload: Partial<ContactBL> }
  | { type: 'UPDATE_FIELD'; payload: { field: string; value: string } }
  | { type: 'SET_ALL_DATA'; payload: FormData }
  | { type: 'RESET' };

const generateRef = () => {
  const year = new Date().getFullYear();
  const num = Math.floor(Math.random() * 900) + 100;
  return `BL-${year}-${num}`;
};

const initialState: FormData = {
  langue: 'FR',
  client: {
    nom_entreprise: '',
    secteur: '',
    taille: 'PME (10-249 salaries)',
    localisation: '',
    interlocuteur_nom: '',
    role: '',
    email: '',
  },
  projet: {
    titre_projet: '',
    type_projet: ProjectType.IMPLEMENTATION,
    outils_atlassian: [],
    deployment: Deployment.CLOUD,
  },
  contexte: {
    situation_actuelle: '',
    objectifs_business: '',
    nb_utilisateurs: '',
  },
  perimetre: {
    perimetre_fonctionnel: [],
    perimetre_technique: '',
  },
  contraintes: {
    budget: '',
    delais: '',
    contraintes_techniques: '',
    contraintes_reglementaires: '',
  },
  equipe: [
    { nom: 'Jean-Christophe DENIS', role: 'Chef de projet', niveau: ConsultantLevel.PARTNER },
  ],
  contact_bl: {
    nom: 'Jean-Christophe DENIS',
    email: 'jean-christophe.denis@bleulemon.fr',
    telephone: '06 01 64 36 69',
  },
  phases: [],
  pricing: [],
  livrables_specifiques: '',
  prerequis_specifiques: '',
  reference: generateRef(),
  date_creation: '',
  date_validite_proposition: ''
};

function formReducer(state: FormData, action: FormAction): FormData {
  switch (action.type) {
    case 'UPDATE_CLIENT':
      return { ...state, client: { ...state.client, ...action.payload } };
    case 'UPDATE_PROJECT':
      return { ...state, projet: { ...state.projet, ...action.payload } };
    case 'UPDATE_CONTEXTE':
      return { ...state, contexte: { ...state.contexte, ...action.payload } };
    case 'UPDATE_PERIMETRE':
      return { ...state, perimetre: { ...state.perimetre, ...action.payload } };
    case 'UPDATE_CONTRAINTES':
      return { ...state, contraintes: { ...state.contraintes, ...action.payload } };
    case 'SET_TEAM':
      return { ...state, equipe: action.payload };
    case 'SET_PHASES':
      return { ...state, phases: action.payload };
    case 'SET_PRICING':
      return { ...state, pricing: action.payload };
    case 'UPDATE_CONTACT_BL':
      return { ...state, contact_bl: { ...state.contact_bl, ...action.payload } };
    case 'UPDATE_FIELD':
      return { ...state, [action.payload.field]: action.payload.value };
    case 'SET_ALL_DATA':
      return action.payload;
    case 'RESET':
      return { ...initialState, reference: generateRef(), date_creation: new Date().toLocaleDateString('fr-FR') };
    default:
      return state;
  }
}

interface FormContextType {
  formData: FormData;
  dispatch: React.Dispatch<FormAction>;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({ children }: { children: ReactNode }) {
  const [formData, dispatch] = useReducer(formReducer, initialState);

  useEffect(() => {
    // Hydrate default dates client-side only to avoid SSR mismatch
    if (!formData.date_creation) {
      dispatch({ type: 'UPDATE_FIELD', payload: { field: 'date_creation', value: new Date().toLocaleDateString('fr-FR') } });
      dispatch({ type: 'UPDATE_FIELD', payload: { field: 'date_validite_proposition', value: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR') } });
    }
  }, []);

  return (
    <FormContext.Provider value={{ formData, dispatch }}>
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  const context = useContext(FormContext);
  if (!context) throw new Error('useFormContext must be used within FormProvider');
  return context;
}
