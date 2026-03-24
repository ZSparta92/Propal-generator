import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { readFileSync } from 'fs';
import { join } from 'path';
import { FormData } from '@/types/proposal';
import { ClaudeResponse } from '@/types/claude-response';
import { calculateTotals, formatCurrency } from './calculations';

export async function generateDocx(formData: FormData, content: ClaudeResponse): Promise<Buffer> {
  const languageSuffix = formData.langue === 'EN' ? 'EN' : 'FR';
  const templateName = `template-${languageSuffix}.docx`;
  const templatePath = join(process.cwd(), 'templates', templateName);

  let templateBuffer: Buffer;
  try {
    templateBuffer = readFileSync(templatePath);
  } catch (err) {
    throw new Error(`Template inexistant : ${templateName}. Veuillez le placer dans le dossier templates/`);
  }

  const zip = new PizZip(templateBuffer);

  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
    delimiters: { start: '{', end: '}' },
  });

  const { totalHT, tva, totalTTC } = calculateTotals(formData.pricing);
  const total_jours_bl = formData.phases.reduce((s, p) => s + p.jours_bluelemon, 0);
  const total_jours_client = formData.phases.reduce((s, p) => s + p.jours_client, 0);

  // Formatting arrays for docxtemplater
  const charges = formData.phases.map((p) => ({
    charges_label: p.nom || ' ',
    charges_phase: p.description || ' ',
    charges_jours_bl: p.jours_bluelemon,
    charges_jours_client: p.jours_client
  }));

  const prix = formData.pricing.map((p) => ({
    poste: p.poste || '',
    quantite: p.quantite,
    prix_unitaire: formatCurrency(p.prix_unitaire),
    total_ht_ligne: formatCurrency(p.total_ht),
    total_ttc_ligne: formatCurrency(p.total_ttc)
  }));

  doc.render({
    // Header & tracking
    titre_projet: formData.projet.titre_projet || ' ',
    date_proposition: formData.date_validite_proposition || new Date().toLocaleDateString(formData.langue === 'EN' ? 'en-US' : 'fr-FR'),
    date_validite_proposition: formData.date_validite_proposition || ' ',
    nom_client: formData.client.nom_entreprise || ' ',
    nom_interlocuteur_client: formData.client.interlocuteur_nom || ' ',
    region: formData.client.localisation || ' ',
    reference: formData.reference || ' ',
    consultant_relecteur: formData.contact_bl.nom || ' ',
    
    // Content Blocks (AI Generated usually)
    comprehension_besoin: content.comprehension_besoin || ' ',
    ecosysteme_description: content.ecosysteme_description || ' ',
    demarche_proposee: content.demarche_proposee || ' ',
    livrables: content.livrables || ' ',
    prerequis: content.prerequis || ' ',
    planning: content.planning || ' ',
    modalites: content.modalites || ' ',
    references_recentes: content.references_recentes || ' ',
    
    // Arrays
    charges,
    prix,
    
    // Totals
    total_ht: formatCurrency(totalHT),
    tva: formatCurrency(tva),
    total_ttc: formatCurrency(totalTTC),
    total_jours_bl,
    total_jours_client,
  });

  return doc.getZip().generate({ type: 'nodebuffer' }) as Buffer;
}
