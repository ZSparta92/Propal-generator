import { z } from 'zod';

export const clientSchema = z.object({
  nom_entreprise: z.string().min(1, 'Nom requis'),
  secteur: z.string().min(1, 'Secteur requis'),
  taille: z.string().min(1, 'Taille requise'),
  localisation: z.string().min(1, 'Localisation requise'),
  interlocuteur_nom: z.string().min(1, 'Nom requis'),
  role: z.string().min(1, 'Role requis'),
  email: z.string().email('Email invalide'),
});

export const projectSchema = z.object({
  titre_projet: z.string().min(1, 'Titre requis'),
  type_projet: z.string().min(1, 'Type requis'),
  outils_atlassian: z.array(z.string()).min(1, 'Selectionnez au moins un outil'),
  deployment: z.string().min(1, 'Mode requis'),
});

export const contexteSchema = z.object({
  situation_actuelle: z.string().min(10, 'Decrivez la situation (min 10 car.)'),
  objectifs_business: z.string().min(10, 'Decrivez les objectifs (min 10 car.)'),
  nb_utilisateurs: z.string().min(1, 'Nombre requis'),
});

export const perimetreSchema = z.object({
  perimetre_fonctionnel: z.array(z.string()).min(1, 'Selectionnez au moins un element'),
  perimetre_technique: z.string().optional(),
});

export const contraintesSchema = z.object({
  budget: z.string().optional(),
  delais: z.string().optional(),
  contraintes_techniques: z.string().optional(),
  contraintes_reglementaires: z.string().optional(),
});

export const fullFormSchema = z.object({
  client: clientSchema,
  projet: projectSchema,
  contexte: contexteSchema,
  perimetre: perimetreSchema,
  contraintes: contraintesSchema,
});
