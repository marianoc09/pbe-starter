export type FeatureStatus =
  | "idea"
  | "en_evaluacion"
  | "priorizada"
  | "en_desarrollo"
  | "lanzada";

export type Feature = {
  id: string;
  title: string;
  description: string;
  category: string;
  status: FeatureStatus;
  /** Personas alcanzadas por trimestre. */
  reach: number;
  /** 0.25 | 0.5 | 1 | 2 | 3 */
  impact: number;
  /** 0.5 | 0.8 | 1 */
  confidence: number;
  /** Persona-meses, siempre mayor a 0. */
  effort: number;
};

export const STATUS_OPTIONS: { value: FeatureStatus; label: string }[] = [
  { value: "idea", label: "Idea" },
  { value: "en_evaluacion", label: "En evaluación" },
  { value: "priorizada", label: "Priorizada" },
  { value: "en_desarrollo", label: "En desarrollo" },
  { value: "lanzada", label: "Lanzada" },
];

export const IMPACT_OPTIONS: { value: number; label: string }[] = [
  { value: 0.25, label: "Mínimo (0.25)" },
  { value: 0.5, label: "Bajo (0.5)" },
  { value: 1, label: "Medio (1)" },
  { value: 2, label: "Alto (2)" },
  { value: 3, label: "Masivo (3)" },
];

export const CONFIDENCE_OPTIONS: { value: number; label: string }[] = [
  { value: 0.5, label: "Baja (50%)" },
  { value: 0.8, label: "Media (80%)" },
  { value: 1, label: "Alta (100%)" },
];

/**
 * RICE = Reach × Impact × Confidence ÷ Effort.
 * Devuelve null cuando falta algún valor o el esfuerzo no es válido.
 */
export function calculateRiceScore(
  reach: number,
  impact: number,
  confidence: number,
  effort: number
): number | null {
  if (![reach, impact, confidence, effort].every(Number.isFinite)) return null;
  if (effort <= 0 || reach < 0) return null;

  return (reach * impact * confidence) / effort;
}

export function formatRiceScore(score: number | null): string {
  if (score === null) return "—";

  return score.toLocaleString("es", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });
}

export function statusLabel(status: FeatureStatus): string {
  return STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status;
}
