import { NextRequest, NextResponse } from 'next/server';
import { generateDocx } from '@/lib/docx-generator';
import { FormData } from '@/types/proposal';
import { ClaudeResponse } from '@/types/claude-response';

export async function POST(request: NextRequest) {
  try {
    const { formData, generatedContent } = await request.json() as {
      formData: FormData;
      generatedContent: ClaudeResponse;
    };

    const buffer = await generateDocx(formData, generatedContent);

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${formData.client.nom_entreprise} - ${formData.projet.titre_projet} - BleuLemon.docx"`,
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur lors de la generation du document' },
      { status: 500 }
    );
  }
}
