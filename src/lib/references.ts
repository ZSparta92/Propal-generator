import referencesData from '@/data/references_bluelemon.json';

interface Reference {
  client: string;
  projet: string;
  type: string;
  outils: string[];
  secteur: string;
  duree: string;
  description: string;
  resultats: string[];
}

export function findRelevantReferences(
  projectType: string,
  tools: string[],
  sector: string,
  maxResults: number = 3
): Reference[] {
  const references = referencesData as Reference[];

  const scored = references.map((ref) => {
    let score = 0;
    if (ref.type?.toLowerCase().includes(projectType.toLowerCase())) score += 40;
    const matchingTools = ref.outils?.filter((t) =>
      tools.some((tool) => t.toLowerCase().includes(tool.toLowerCase()))
    );
    score += (matchingTools?.length || 0) * 25;
    if (ref.secteur?.toLowerCase().includes(sector.toLowerCase())) score += 15;
    return { ...ref, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .filter((r) => r.score > 0);
}

export function formatReferencesForPrompt(references: Reference[]): string {
  if (!references.length) return 'Aucune reference similaire trouvee.';

  return references
    .map(
      (ref, i) =>
        `Reference ${i + 1}: ${ref.client} - ${ref.projet}\n` +
        `Type: ${ref.type} | Outils: ${ref.outils?.join(', ')}\n` +
        `Secteur: ${ref.secteur} | Duree: ${ref.duree}\n` +
        `Description: ${ref.description}\n` +
        `Resultats: ${ref.resultats?.join('; ')}`
    )
    .join('\n\n');
}
