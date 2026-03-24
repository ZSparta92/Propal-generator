import { NextRequest, NextResponse } from 'next/server';
import { generateProposalContent } from '@/lib/claude';
import { buildSystemPrompt, buildUserPrompt } from '@/lib/prompt-builder';
import { findRelevantReferences, formatReferencesForPrompt } from '@/lib/references';
import { FormData } from '@/types/proposal';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json() as FormData;

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'Cle API Anthropic non configuree. Ajoutez ANTHROPIC_API_KEY dans .env.local' }, { status: 500 });
    }

    const references = findRelevantReferences(
      formData.projet.type_projet,
      formData.projet.outils_atlassian as unknown as string[],
      formData.client.secteur
    );
    const referencesText = formatReferencesForPrompt(references);

    const systemPrompt = buildSystemPrompt(referencesText, formData.langue);
    const userPrompt = buildUserPrompt(formData);

    const content = await generateProposalContent(systemPrompt, userPrompt);

    return NextResponse.json(content);
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur lors de la generation' },
      { status: 500 }
    );
  }
}
