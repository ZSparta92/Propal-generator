import { TeamMember, PhaseEstimation, PricingItem } from '@/types/proposal';
import { TJM_RATES, TVA_RATE } from './constants';

export function calculatePricingFromTeamAndPhases(
  team: TeamMember[],
  phases: PhaseEstimation[]
): PricingItem[] {
  const totalJoursBL = phases.reduce((sum, p) => sum + p.jours_bluelemon, 0);

  const levelGroups: Record<string, { count: number; totalJours: number }> = {};

  team.forEach((member) => {
    if (!levelGroups[member.niveau]) {
      levelGroups[member.niveau] = { count: 0, totalJours: 0 };
    }
    levelGroups[member.niveau].count += 1;
  });

  const totalMembers = team.length || 1;

  return Object.entries(levelGroups).map(([niveau, group]) => {
    const proportion = group.count / totalMembers;
    const jours = Math.round(totalJoursBL * proportion);
    const tjm = TJM_RATES[niveau as keyof typeof TJM_RATES] || 1100;
    const totalHT = jours * tjm;

    return {
      poste: `Prestation de conseil ${niveau}`,
      quantite: jours,
      prix_unitaire: tjm,
      total_ht: totalHT,
      total_ttc: totalHT * (1 + TVA_RATE),
    };
  });
}

export function calculateTotals(pricing: PricingItem[]) {
  const totalHT = pricing.reduce((sum, item) => sum + item.total_ht, 0);
  const tva = totalHT * TVA_RATE;
  const totalTTC = totalHT + tva;
  return { totalHT, tva, totalTTC };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}
