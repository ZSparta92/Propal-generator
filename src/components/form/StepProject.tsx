'use client';

import { useFormContext } from './FormProvider';
import { ProjectType, AtlassianTool, Deployment } from '@/types/proposal';

export default function StepProject() {
  const { formData, dispatch } = useFormContext();
  const { projet } = formData;

  const toggleTool = (tool: AtlassianTool) => {
    const current = projet.outils_atlassian;
    const updated = current.includes(tool) ? current.filter((t) => t !== tool) : [...current, tool];
    dispatch({ type: 'UPDATE_PROJECT', payload: { outils_atlassian: updated } });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Type de projet</h2>
        <p className="text-sm text-gray-500 mt-1">Definissez le type de projet et les outils Atlassian concernes.</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Titre du projet *</label>
        <input type="text" value={projet.titre_projet} onChange={(e) => dispatch({ type: 'UPDATE_PROJECT', payload: { titre_projet: e.target.value } })} placeholder="Ex: Mise en place Ticketing clients externes" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Type de projet *</label>
        <select value={projet.type_projet} onChange={(e) => dispatch({ type: 'UPDATE_PROJECT', payload: { type_projet: e.target.value as ProjectType } })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          {Object.values(ProjectType).map((t) => (<option key={t} value={t}>{t}</option>))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Outils Atlassian *</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.values(AtlassianTool).map((tool) => (
            <label key={tool} className={`flex items-center justify-center px-3 py-2 border rounded-lg cursor-pointer transition-colors ${projet.outils_atlassian.includes(tool) ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-300 hover:bg-gray-50'}`}>
              <input type="checkbox" checked={projet.outils_atlassian.includes(tool)} onChange={() => toggleTool(tool)} className="sr-only" />
              <span className="text-sm">{tool}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Mode de deploiement *</label>
        <div className="flex gap-3">
          {Object.values(Deployment).map((d) => (
            <button key={d} type="button" onClick={() => dispatch({ type: 'UPDATE_PROJECT', payload: { deployment: d } })} className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${projet.deployment === d ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-300 hover:bg-gray-50'}`}>
              {d}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
