'use client';

import { useFormContext } from './FormProvider';
import { PhaseEstimation } from '@/types/proposal';
import { DEFAULT_PHASES } from '@/lib/constants';
import { useEffect } from 'react';

export default function StepPhases() {
  const { formData, dispatch } = useFormContext();
  const { phases, projet } = formData;

  useEffect(() => {
    if (phases.length === 0) {
      resetPhases();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetPhases = () => {
    const defaults = DEFAULT_PHASES[projet.type_projet] || [];
    const newPhases: PhaseEstimation[] = defaults.map((d) => ({
      nom: d.nom,
      description: '',
      jours_bluelemon: d.jours_bl,
      jours_client: d.jours_client,
    }));
    dispatch({ type: 'SET_PHASES', payload: newPhases });
  };

  const updatePhase = (index: number, field: keyof PhaseEstimation, value: string | number) => {
    const updated = [...phases];
    updated[index] = { ...updated[index], [field]: value };
    dispatch({ type: 'SET_PHASES', payload: updated });
  };

  const addPhase = () => {
    dispatch({
      type: 'SET_PHASES',
      payload: [...phases, { nom: '', description: '', jours_bluelemon: 1, jours_client: 0 }],
    });
  };

  const removePhase = (index: number) => {
    dispatch({ type: 'SET_PHASES', payload: phases.filter((_, i) => i !== index) });
  };

  const totalBL = phases.reduce((s, p) => s + p.jours_bluelemon, 0);
  const totalClient = phases.reduce((s, p) => s + p.jours_client, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Phases et charges</h2>
          <p className="text-sm text-gray-500 mt-1">Estimez les charges par phase. Les valeurs par defaut sont basees sur le type de projet.</p>
        </div>
        <button type="button" onClick={resetPhases} className="text-sm text-blue-600 hover:text-blue-800">Reinitialiser</button>
      </div>
      {phases.map((phase, idx) => (
        <div key={idx} className="border border-gray-200 rounded-lg p-4">
          <div className="flex gap-3 items-center mb-2">
            <input type="text" value={phase.nom} onChange={(e) => updatePhase(idx, 'nom', e.target.value)} className="flex-1 border border-gray-300 rounded-lg px-3 py-2 font-medium" />
            <div className="text-xs text-gray-500">
              <label>Jours BL</label>
              <input type="number" min={0} value={phase.jours_bluelemon} onChange={(e) => updatePhase(idx, 'jours_bluelemon', parseInt(e.target.value) || 0)} className="w-16 border border-gray-300 rounded-lg px-2 py-2 ml-1" />
            </div>
            <div className="text-xs text-gray-500">
              <label>Jours Client</label>
              <input type="number" min={0} value={phase.jours_client} onChange={(e) => updatePhase(idx, 'jours_client', parseInt(e.target.value) || 0)} className="w-16 border border-gray-300 rounded-lg px-2 py-2 ml-1" />
            </div>
            <button type="button" onClick={() => removePhase(idx)} className="text-red-500 hover:text-red-700">&#x1F5D1;</button>
          </div>
          <input type="text" value={phase.description} onChange={(e) => updatePhase(idx, 'description', e.target.value)} placeholder="Description des activites de cette phase (optionnel)" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600" />
        </div>
      ))}
      <div className="flex justify-between items-center">
        <button type="button" onClick={addPhase} className="text-sm text-blue-600 hover:text-blue-800">+ Ajouter une phase</button>
        <p className="text-sm font-semibold text-gray-700">Total : {totalBL}j BL / {totalClient}j Client</p>
      </div>
    </div>
  );
}
