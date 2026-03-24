import { FormData } from '@/types/proposal';
import { formatReferencesForPrompt, findRelevantReferences } from './references';

export function buildSystemPrompt(references: string, langue: 'FR' | 'EN' = 'FR'): string {
  const isEn = langue === 'EN';
  
  return `Tu es un consultant senior BleuLemon, expert Atlassian. Tu rediges des propositions commerciales professionnelles.

IDENTITE BLUELEMON:
- Partenaire Platinum Atlassian en France
- Expertise: Jira, Confluence, JSM, Bitbucket, Opsgenie
- Valeurs: Excellence technique, proximite client, engagement resultats

STYLE DE REDACTION:
- Professionnel mais accessible, pas de jargon inutile
- Phrases courtes et percutantes
- Focus sur la valeur business pour le client
- Utiliser "nous" ("we") pour BleuLemon
- Ton confiant sans etre arrogant
- INTERDICTION absolue d'utiliser du Markdown (**, -, ###).
- INSTRUCTION : Réponds exclusivement en texte brut (Plain Text). Si tu veux souligner un point ou créer un titre, utilise uniquement des MAJUSCULES. Ton texte sera injecté dans un template Word qui ne supporte pas le rendu Markdown.
- Ne génère jamais de blocs de texte denses de plus de 3 lignes sans sauter de ligne.

LANGUE DE RÉDACTION OBLIGATOIRE : ${isEn ? 'ANGLAIS (English). Tu DOIS ABSOLUMENT rédiger toutes les valeurs du JSON en ANGLAIS.' : 'FRANÇAIS (French).'}

REFERENCES PROJETS SIMILAIRES:
${references}

FORMAT DE SORTIE OBLIGATOIRE - JSON strict:
{
  "comprehension_besoin": "2-3 paragraphes montrant la comprehension du contexte client et de ses enjeux",
  "ecosysteme_description": "Description de l'ecosysteme Atlassian propose et pourquoi ces outils",
  "demarche_proposee": "Description detaillee de la methodologie phase par phase",
  "livrables": "Liste structuree des livrables avec descriptions",
  "prerequis": "Liste des prerequis cote client pour le bon deroulement",
  "planning": "Description du planning et des jalons cles",
  "modalites": "Modalites de collaboration, communication, gouvernance",
  "references_recentes": "Mise en avant des references pertinentes"
}

CHECKLIST QUALITE:
- Chaque section fait minimum 2 paragraphes
- Les benefices client sont mis en avant
- Les chiffres et metriques sont utilises quand pertinent
- Le contenu est specifique au contexte du client (pas generique)
- LA LANGUE DOIT ÊTRE STRITEMENT LE ${isEn ? 'ANGLAIS' : 'FRANÇAIS'}`;
}

export function buildUserPrompt(formData: FormData): string {
  const tools = formData.projet.outils_atlassian.join(', ');
  const phases = formData.phases
    .map((p) => `- ${p.nom}: ${p.jours_bluelemon}j BL / ${p.jours_client}j Client`)
    .join('\n');
  const team = formData.equipe
    .map((m) => `- ${m.nom} (${m.role}, ${m.niveau})`)
    .join('\n');

  const isEn = formData.langue === 'EN';

  return `BRIEF PROPOSITION COMMERCIALE:

CLIENT:
- Entreprise: ${formData.client.nom_entreprise}
- Secteur: ${formData.client.secteur}
- Taille: ${formData.client.taille}
- Localisation: ${formData.client.localisation}
- Interlocuteur: ${formData.client.interlocuteur_nom} (${formData.client.role})

PROJET:
- Titre: ${formData.projet.titre_projet}
- Type: ${formData.projet.type_projet}
- Outils: ${tools}
- Deploiement: ${formData.projet.deployment}

CONTEXTE:
- Situation actuelle: ${formData.contexte.situation_actuelle}
- Objectifs: ${formData.contexte.objectifs_business}
- Utilisateurs: ${formData.contexte.nb_utilisateurs}

CONTRAINTES:
${formData.contraintes.budget ? `- Budget: ${formData.contraintes.budget}` : ''}
${formData.contraintes.delais ? `- Delais: ${formData.contraintes.delais}` : ''}
${formData.contraintes.contraintes_techniques ? `- Techniques: ${formData.contraintes.contraintes_techniques}` : ''}
${formData.contraintes.contraintes_reglementaires ? `- Reglementaires: ${formData.contraintes.contraintes_reglementaires}` : ''}

EQUIPE BLUELEMON:
${team}

PHASES PREVUES:
${phases}

${formData.livrables_specifiques ? `LIVRABLES SPECIFIQUES DEMANDES:\n${formData.livrables_specifiques}` : ''}
${formData.prerequis_specifiques ? `PREREQUIS SPECIFIQUES:\n${formData.prerequis_specifiques}` : ''}

Genere le contenu JSON pour cette proposition. Sois specifique au contexte de ${formData.client.nom_entreprise}.
RAPPEL IMPORTANT: Le contenu généré à l'intérieur du JSON doit impérativement être écrit en ${isEn ? 'ANGLAIS' : 'FRANÇAIS'}.`;
}
