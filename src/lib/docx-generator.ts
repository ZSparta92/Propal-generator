import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { readFileSync } from 'fs';
import { join } from 'path';
import { FormData } from '@/types/proposal';
import { ClaudeResponse } from '@/types/claude-response';
import { calculateTotals, formatCurrency } from './calculations';

export async function generateDocx(formData: FormData, content: ClaudeResponse): Promise<Buffer> {
  const templatePath = join(process.cwd(), 'templates', 'bluelemon-template.docx');

  let templateBuffer: Buffer;
  try {
    templateBuffer = readFileSync(templatePath);
  } catch {
    // If template doesn't exist, create a basic one
    return createBasicDocx(formData, content);
  }

  const zip = new PizZip(templateBuffer);

  // Inject AI content into XML
  const docXml = zip.file('word/document.xml');
  if (docXml) {
    let xmlContent = docXml.asText();
    xmlContent = injectSectionContent(xmlContent, 'Notre comprehension du besoin', content.comprehension_besoin);
    xmlContent = injectSectionContent(xmlContent, 'Ecosysteme', content.ecosysteme_description);
    xmlContent = injectSectionContent(xmlContent, 'Demarche proposee', content.demarche_proposee);
    xmlContent = injectSectionContent(xmlContent, 'Livrables', content.livrables);
    xmlContent = injectSectionContent(xmlContent, 'Prerequis', content.prerequis);
    xmlContent = injectSectionContent(xmlContent, 'Planning', content.planning);
    xmlContent = injectSectionContent(xmlContent, 'Modalites', content.modalites);

    // Rebuild tables
    xmlContent = rebuildChargesTable(xmlContent, formData.phases);
    xmlContent = rebuildPricingTable(xmlContent, formData.pricing);

    zip.file('word/document.xml', xmlContent);
  }

  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
    delimiters: { start: '{', end: '}' },
  });

  const { totalHT, tva, totalTTC } = calculateTotals(formData.pricing);

  doc.render({
    titre_projet: formData.projet.titre_projet,
    nom_client: formData.client.nom_entreprise,
    region: formData.client.localisation,
    date_validite: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'),
    references_recentes: content.references_recentes,
    consultant_relecteur: formData.contact_bl.nom,
    reference: formData.reference,
    total_ht: formatCurrency(totalHT),
    tva: formatCurrency(tva),
    total_ttc: formatCurrency(totalTTC),
  });

  return doc.getZip().generate({ type: 'nodebuffer' }) as Buffer;
}

function injectSectionContent(xml: string, headingText: string, content: string): string {
  if (!content) return xml;

  const escapedHeading = headingText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const headingRegex = new RegExp(`(<w:t[^>]*>)([^<]*${escapedHeading}[^<]*)(</w:t>)`, 'is');
  const match = xml.match(headingRegex);

  if (!match) return xml;

  const headingPos = xml.indexOf(match[0]);
  const afterHeading = xml.indexOf('</w:p>', headingPos);

  if (afterHeading === -1) return xml;

  const paragraphs = content.split('\n').filter((p) => p.trim());
  const xmlParagraphs = paragraphs
    .map(
      (p) =>
        `<w:p><w:pPr><w:rPr><w:rFonts w:ascii="Montserrat" w:hAnsi="Montserrat"/><w:sz w:val="20"/></w:rPr></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Montserrat" w:hAnsi="Montserrat"/><w:sz w:val="20"/></w:rPr><w:t xml:space="preserve">${escapeXml(p)}</w:t></w:r></w:p>`
    )
    .join('');

  const insertPos = afterHeading + '</w:p>'.length;
  return xml.slice(0, insertPos) + xmlParagraphs + xml.slice(insertPos);
}

function rebuildChargesTable(xml: string, phases: { nom: string; jours_bluelemon: number; jours_client: number }[]): string {
  const chargesMarker = 'Charges BleuLemon';
  const markerPos = xml.indexOf(chargesMarker);
  if (markerPos === -1) return xml;

  // Find the table containing this marker
  let tableStart = xml.lastIndexOf('<w:tbl>', markerPos);
  if (tableStart === -1) tableStart = xml.lastIndexOf('<w:tbl ', markerPos);
  if (tableStart === -1) return xml;

  const tableEnd = xml.indexOf('</w:tbl>', tableStart);
  if (tableEnd === -1) return xml;

  const tableXml = xml.slice(tableStart, tableEnd + '</w:tbl>'.length);

  // Find all rows
  const rowRegex = /<w:tr\b[^>]*>[\s\S]*?<\/w:tr>/g;
  const rows: string[] = [];
  let rowMatch;
  while ((rowMatch = rowRegex.exec(tableXml)) !== null) {
    rows.push(rowMatch[0]);
  }

  if (rows.length < 2) return xml;

  // Keep header row, replace data rows
  const headerRow = rows[0];
  const templateRow = rows[1];

  const newRows = phases.map((phase) => {
    let row = templateRow;
    row = replaceNthCellText(row, 0, phase.nom);
    row = replaceNthCellText(row, 1, String(phase.jours_bluelemon));
    row = replaceNthCellText(row, 2, String(phase.jours_client));
    return row;
  });

  const totalBL = phases.reduce((s, p) => s + p.jours_bluelemon, 0);
  const totalClient = phases.reduce((s, p) => s + p.jours_client, 0);
  let totalRow = templateRow;
  totalRow = replaceNthCellText(totalRow, 0, 'TOTAL');
  totalRow = replaceNthCellText(totalRow, 1, String(totalBL));
  totalRow = replaceNthCellText(totalRow, 2, String(totalClient));

  // Get table properties (everything before first row)
  const firstRowStart = tableXml.search(/<w:tr\b/);
  const tableProps = tableXml.slice(0, firstRowStart);

  const newTable = tableProps + headerRow + newRows.join('') + totalRow + '</w:tbl>';
  return xml.slice(0, tableStart) + newTable + xml.slice(tableEnd + '</w:tbl>'.length);
}

function rebuildPricingTable(xml: string, pricing: { poste: string; quantite: number; prix_unitaire: number; total_ht: number; total_ttc: number }[]): string {
  const pricingMarker = 'PU HT';
  const markerPos = xml.indexOf(pricingMarker);
  if (markerPos === -1) return xml;

  let tableStart = xml.lastIndexOf('<w:tbl>', markerPos);
  if (tableStart === -1) tableStart = xml.lastIndexOf('<w:tbl ', markerPos);
  if (tableStart === -1) return xml;

  const tableEnd = xml.indexOf('</w:tbl>', tableStart);
  if (tableEnd === -1) return xml;

  const tableXml = xml.slice(tableStart, tableEnd + '</w:tbl>'.length);

  const rowRegex = /<w:tr\b[^>]*>[\s\S]*?<\/w:tr>/g;
  const rows: string[] = [];
  let rowMatch;
  while ((rowMatch = rowRegex.exec(tableXml)) !== null) {
    rows.push(rowMatch[0]);
  }

  if (rows.length < 2) return xml;

  const headerRow = rows[0];
  const templateRow = rows[1];

  const newRows = pricing.map((item) => {
    let row = templateRow;
    row = replaceNthCellText(row, 0, item.poste);
    row = replaceNthCellText(row, 1, String(item.quantite));
    row = replaceNthCellText(row, 2, formatCurrency(item.prix_unitaire));
    row = replaceNthCellText(row, 3, formatCurrency(item.total_ht));
    row = replaceNthCellText(row, 4, formatCurrency(item.total_ttc));
    return row;
  });

  const firstRowStart = tableXml.search(/<w:tr\b/);
  const tableProps = tableXml.slice(0, firstRowStart);

  const newTable = tableProps + headerRow + newRows.join('') + '</w:tbl>';
  return xml.slice(0, tableStart) + newTable + xml.slice(tableEnd + '</w:tbl>'.length);
}

function replaceNthCellText(rowXml: string, cellIndex: number, newText: string): string {
  const cellRegex = /<w:tc\b[^>]*>[\s\S]*?<\/w:tc>/g;
  const cells: { match: string; index: number }[] = [];
  let cellMatch;
  while ((cellMatch = cellRegex.exec(rowXml)) !== null) {
    cells.push({ match: cellMatch[0], index: cellMatch.index });
  }

  if (cellIndex >= cells.length) return rowXml;

  const cell = cells[cellIndex];
  let cellXml = cell.match;

  // Try to replace existing <w:t> tag
  const wtRegex = /<w:t[^>]*>[^<]*<\/w:t>/;
  if (wtRegex.test(cellXml)) {
    cellXml = cellXml.replace(wtRegex, `<w:t xml:space="preserve">${escapeXml(newText)}</w:t>`);
  } else {
    // No <w:t> tag - insert one before </w:p>
    const wpEnd = cellXml.lastIndexOf('</w:p>');
    if (wpEnd !== -1) {
      const insert = `<w:r><w:t xml:space="preserve">${escapeXml(newText)}</w:t></w:r>`;
      cellXml = cellXml.slice(0, wpEnd) + insert + cellXml.slice(wpEnd);
    }
  }

  return rowXml.slice(0, cell.index) + cellXml + rowXml.slice(cell.index + cell.match.length);
}

function escapeXml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

async function createBasicDocx(formData: FormData, content: ClaudeResponse): Promise<Buffer> {
  const PizZipLib = (await import('pizzip')).default;
  const DocxLib = (await import('docxtemplater')).default;

  // Create a minimal docx from scratch
  const zip = new PizZipLib();

  // Content Types
  zip.file('[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>');

  // Relationships
  zip.file('_rels/.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>');

  zip.file('word/_rels/document.xml.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>');

  const { totalHT, tva, totalTTC } = calculateTotals(formData.pricing);

  // Build document content
  const sections = [
    { title: formData.projet.titre_projet, level: 1 },
    { title: `Proposition pour ${formData.client.nom_entreprise}`, level: 2 },
    { title: 'Notre comprehension du besoin', level: 2, content: content.comprehension_besoin },
    { title: 'Ecosysteme Atlassian', level: 2, content: content.ecosysteme_description },
    { title: 'Demarche proposee', level: 2, content: content.demarche_proposee },
    { title: 'Livrables', level: 2, content: content.livrables },
    { title: 'Prerequis', level: 2, content: content.prerequis },
    { title: 'Planning', level: 2, content: content.planning },
    { title: 'Modalites de collaboration', level: 2, content: content.modalites },
    { title: 'Budget', level: 2, content: `Total HT: ${formatCurrency(totalHT)}\nTVA (20%): ${formatCurrency(tva)}\nTotal TTC: ${formatCurrency(totalTTC)}` },
    { title: 'References', level: 2, content: content.references_recentes },
  ];

  let bodyXml = '';
  for (const section of sections) {
    bodyXml += `<w:p><w:pPr><w:pStyle w:val="Heading${section.level}"/></w:pPr><w:r><w:t>${escapeXml(section.title)}</w:t></w:r></w:p>`;
    if ('content' in section && section.content) {
      const paragraphs = section.content.split('\n').filter((p: string) => p.trim());
      for (const p of paragraphs) {
        bodyXml += `<w:p><w:r><w:rPr><w:rFonts w:ascii="Montserrat" w:hAnsi="Montserrat"/><w:sz w:val="20"/></w:rPr><w:t xml:space="preserve">${escapeXml(p)}</w:t></w:r></w:p>`;
      }
    }
  }

  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>${bodyXml}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/></w:sectPr></w:body>
</w:document>`;

  zip.file('word/document.xml', documentXml);

  return zip.generate({ type: 'nodebuffer' }) as Buffer;
}
