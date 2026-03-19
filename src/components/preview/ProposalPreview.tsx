'use client';

import { useState } from 'react';
import { ClaudeResponse } from '@/types/claude-response';

interface ProposalPreviewProps {
  content: ClaudeResponse;
  onContentChange: (content: ClaudeResponse) => void;
}

const SECTION_LABELS: Record<keyof ClaudeResponse, string> = {
  comprehension_besoin: 'Comprehension du besoin',
  ecosysteme_description: 'Ecosysteme Atlassian',
  demarche_proposee: 'Demarche proposee',
  livrables: 'Livrables',
  prerequis: 'Prerequis',
  planning: 'Planning',
  modalites: 'Modalites de collaboration',
  references_recentes: 'References',
};

export default function ProposalPreview({ content, onContentChange }: ProposalPreviewProps) {
  const [editingSection, setEditingSection] = useState<keyof ClaudeResponse | null>(null);
  const [originalContent] = useState<ClaudeResponse>({ ...content });

  const handleEdit = (key: keyof ClaudeResponse, value: string) => {
    onContentChange({ ...content, [key]: value });
  };

  const restoreOriginal = (key: keyof ClaudeResponse) => {
    onContentChange({ ...content, [key]: originalContent[key] });
    setEditingSection(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Apercu du contenu genere</h2>
        <p className="text-sm text-gray-500 mt-1">Cliquez sur une section pour la modifier avant le telechargement.</p>
      </div>
      {(Object.keys(SECTION_LABELS) as (keyof ClaudeResponse)[]).map((key) => (
        <div key={key} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-blue-700">{SECTION_LABELS[key]}</h3>
            <div className="flex gap-2">
              {editingSection === key && (
                <button type="button" onClick={() => restoreOriginal(key)} className="text-xs text-orange-600 hover:text-orange-800">Restaurer</button>
              )}
              <button type="button" onClick={() => setEditingSection(editingSection === key ? null : key)} className="text-xs text-blue-600 hover:text-blue-800">
                {editingSection === key ? 'Terminer' : 'Modifier'}
              </button>
            </div>
          </div>
          {editingSection === key ? (
            <textarea value={content[key]} onChange={(e) => handleEdit(key, e.target.value)} rows={8} className="w-full border border-blue-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
          ) : (
            <div className="text-sm text-gray-600 whitespace-pre-wrap">{content[key] || <span className="italic text-gray-400">Aucun contenu genere</span>}</div>
          )}
        </div>
      ))}
    </div>
  );
}
