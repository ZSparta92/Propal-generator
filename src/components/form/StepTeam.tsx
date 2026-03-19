'use client';

import { useFormContext } from './FormProvider';
import { ConsultantLevel, TeamMember } from '@/types/proposal';
import { TJM_RATES } from '@/lib/constants';

export default function StepTeam() {
  const { formData, dispatch } = useFormContext();
  const { equipe, contact_bl } = formData;

  const updateMember = (index: number, field: keyof TeamMember, value: string) => {
    const updated = [...equipe];
    updated[index] = { ...updated[index], [field]: value };
    dispatch({ type: 'SET_TEAM', payload: updated });
  };

  const addMember = () => {
    dispatch({ type: 'SET_TEAM', payload: [...equipe, { nom: '', role: '', niveau: ConsultantLevel.SENIOR }] });
  };

  const removeMember = (index: number) => {
    if (equipe.length <= 1) return;
    dispatch({ type: 'SET_TEAM', payload: equipe.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Equipe BleuLemon</h2>
        <p className="text-sm text-gray-500 mt-1">Composez l&apos;equipe proposee et renseignez le contact commercial.</p>
      </div>
      <div className="border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-600 mb-3">Contact commercial</h3>
        <div className="grid grid-cols-3 gap-3">
          <input type="text" value={contact_bl.nom} onChange={(e) => dispatch({ type: 'UPDATE_CONTACT_BL', payload: { nom: e.target.value } })} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          <input type="email" value={contact_bl.email} onChange={(e) => dispatch({ type: 'UPDATE_CONTACT_BL', payload: { email: e.target.value } })} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          <input type="text" value={contact_bl.telephone} onChange={(e) => dispatch({ type: 'UPDATE_CONTACT_BL', payload: { telephone: e.target.value } })} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        </div>
      </div>
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-gray-600">Consultants</h3>
          <button type="button" onClick={addMember} className="text-sm text-blue-600 hover:text-blue-800">+ Ajouter</button>
        </div>
        {equipe.map((member, idx) => (
          <div key={idx} className="flex gap-3 items-center mb-3 border border-gray-200 rounded-lg p-3">
            <input type="text" value={member.nom} onChange={(e) => updateMember(idx, 'nom', e.target.value)} placeholder="Nom" className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            <input type="text" value={member.role} onChange={(e) => updateMember(idx, 'role', e.target.value)} placeholder="Role" className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            <select value={member.niveau} onChange={(e) => updateMember(idx, 'niveau', e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
              {Object.values(ConsultantLevel).map((level) => (
                <option key={level} value={level}>{level} ({TJM_RATES[level]}EUR/j)</option>
              ))}
            </select>
            {equipe.length > 1 && (
              <button type="button" onClick={() => removeMember(idx)} className="text-red-500 hover:text-red-700 text-lg">&#x1F5D1;</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
