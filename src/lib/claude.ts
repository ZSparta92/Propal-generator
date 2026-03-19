import Anthropic from '@anthropic-ai/sdk';
import { ClaudeResponse } from '@/types/claude-response';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function generateProposalContent(
  systemPrompt: string,
  userPrompt: string
): Promise<ClaudeResponse> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8192,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  });

  const textBlock = response.content.find((block) => block.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No text response from Claude');
  }

  return parseClaudeResponse(textBlock.text);
}

function parseClaudeResponse(text: string): ClaudeResponse {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found in response');
    return JSON.parse(jsonMatch[0]) as ClaudeResponse;
  } catch {
    return generateWithRetry(text);
  }
}

function generateWithRetry(originalText: string): ClaudeResponse {
  const jsonMatch = originalText.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]) as ClaudeResponse;
    } catch {
      // Fall through to default
    }
  }

  return {
    comprehension_besoin: 'Erreur lors de la generation. Veuillez reessayer.',
    ecosysteme_description: '',
    demarche_proposee: '',
    livrables: '',
    prerequis: '',
    planning: '',
    modalites: '',
    references_recentes: '',
  };
}
