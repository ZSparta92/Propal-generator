'use client';

import { useFormContext } from './FormProvider';
import { PricingItem } from '@/types/proposal';
import { calculatePricingFromTeamAndPhases, calculateTotals, formatCurrency } from '@/lib/calculations';
import { useEffect } from 'react';

export default function StepPricing() {
  const { formData, dispatch } = useFormContext();
  const { pricing, equipe, phases } = formData;

  useEffect(() => {
    if (pricing.length === 0) recalculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const recalculate = () => {
    const items = calculatePricingFromTeamAndPhases(equipe, phases);
    dispatch({ type: 'SET_PRICING', payload: items });
  };

  const updateItem = (index: number, field: keyof PricingItem, value: number | string) => {
    const updated = [...pricing];
    const item = { ...updated[index], [field]: value };
    if (field === 'quantite' || field === 'prix_unitaire') {
      const qty = field === 'quantite' ? (value as number) : item.quantite;
      const pu = field === 'prix_unitaire' ? (value as number) : item.prix_unitaire;
      item.total_ht = qty * pu;
      item.total_ttc = item.total_ht * 1.2;
    }
    updated[index] = item;
    dispatch({ type: 'SET_PRICING', payload: updated });
  };

  const addItem = () => {
    dispatch({
      type: 'SET_PRICING',
      payload: [...pricing, { poste: '', quantite: 1, prix_unitaire: 0, total_ht: 0, total_ttc: 0 }],
    });
  };

  const { totalHT, tva, totalTTC } = calculateTotals(pricing);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Tarification</h2>
          <p className="text-sm text-gray-500 mt-1">Le budget est pre-calcule depuis l&apos;equipe et les phases. Ajustez si necessaire.</p>
        </div>
        <button type="button" onClick={recalculate} className="text-sm text-blue-600 hover:text-blue-800">Recalculer</button>
      </div>
      <div>
        <div className="grid grid-cols-5 gap-2 text-xs font-semibold text-gray-500 mb-2 px-1">
          <span>Poste</span><span>Qte (j)</span><span>PU HT</span><span>Total HT</span><span>Total TTC</span>
        </div>
        {pricing.map((item, idx) => (
          <div key={idx} className="grid grid-cols-5 gap-2 items-center mb-2">
            <input type="text" value={item.poste} onChange={(e) => updateItem(idx, 'poste', e.target.value)} className="border border-gray-300 rounded-lg px-2 py-2 text-sm" />
            <input type="number" min={0} value={item.quantite} onChange={(e) => updateItem(idx, 'quantite', parseInt(e.target.value) || 0)} className="border border-gray-300 rounded-lg px-2 py-2 text-sm" />
            <input type="number" min={0} value={item.prix_unitaire} onChange={(e) => updateItem(idx, 'prix_unitaire', parseInt(e.target.value) || 0)} className="border border-gray-300 rounded-lg px-2 py-2 text-sm" />
            <span className="text-sm font-medium text-right">{formatCurrency(item.total_ht)}</span>
            <span className="text-sm text-gray-500 text-right">{formatCurrency(item.total_ttc)}</span>
          </div>
        ))}
      </div>
      <button type="button" onClick={addItem} className="text-sm text-blue-600 hover:text-blue-800">+ Ajouter un poste</button>
      <div className="text-right space-y-1 border-t pt-4">
        <p className="text-sm text-gray-600">Total HT : <span className="font-semibold">{formatCurrency(totalHT)}</span></p>
        <p className="text-sm text-gray-600">TVA (20%) : <span className="font-semibold">{formatCurrency(tva)}</span></p>
        <p className="text-lg font-bold text-blue-700">Total TTC : {formatCurrency(totalTTC)}</p>
      </div>
    </div>
  );
}
