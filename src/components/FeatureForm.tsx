"use client";

import { useId, useState } from "react";
import {
  CONFIDENCE_OPTIONS,
  IMPACT_OPTIONS,
  STATUS_OPTIONS,
  calculateRiceScore,
  formatRiceScore,
  type Feature,
  type FeatureStatus,
} from "@/lib/rice";

type FieldErrors = Partial<Record<"title" | "reach" | "effort", string>>;

type FeatureFormProps = {
  onAdd: (feature: Feature) => void;
};

const labelClass =
  "block text-sm font-medium text-zinc-700 dark:text-zinc-300";

const controlClass =
  "mt-1.5 w-full rounded-lg border bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:ring-2 disabled:opacity-50 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-600";

const okBorderClass =
  "border-zinc-300 focus:border-zinc-900 focus:ring-zinc-900/10 dark:border-zinc-700 dark:focus:border-zinc-100 dark:focus:ring-zinc-100/20";

const errorBorderClass =
  "border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500";

const hintClass = "mt-1 text-xs text-zinc-500 dark:text-zinc-500";

function fieldClass(hasError: boolean) {
  return `${controlClass} ${hasError ? errorBorderClass : okBorderClass}`;
}

/** Un campo vacío no vale 0: sin valor, el score todavía no se puede calcular. */
function parseNumber(value: string): number {
  return value.trim() === "" ? Number.NaN : Number(value);
}

export default function FeatureForm({ onAdd }: FeatureFormProps) {
  const id = useId();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<FeatureStatus>("idea");
  const [reach, setReach] = useState("");
  const [impact, setImpact] = useState("1");
  const [confidence, setConfidence] = useState("0.8");
  const [effort, setEffort] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const liveScore = calculateRiceScore(
    parseNumber(reach),
    parseNumber(impact),
    parseNumber(confidence),
    parseNumber(effort)
  );

  function validate(): FieldErrors {
    const nextErrors: FieldErrors = {};

    if (!title.trim()) {
      nextErrors.title = "Escribí un título para la feature.";
    }

    const reachValue = Number(reach);
    if (!reach.trim()) {
      nextErrors.reach = "Indicá a cuántas personas alcanza por trimestre.";
    } else if (!Number.isFinite(reachValue) || reachValue < 0) {
      nextErrors.reach = "El alcance tiene que ser un número mayor o igual a 0.";
    }

    const effortValue = Number(effort);
    if (!effort.trim()) {
      nextErrors.effort = "Indicá el esfuerzo estimado en persona-meses.";
    } else if (!Number.isFinite(effortValue) || effortValue <= 0) {
      nextErrors.effort = "El esfuerzo tiene que ser un número mayor a 0.";
    }

    return nextErrors;
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setCategory("");
    setStatus("idea");
    setReach("");
    setImpact("1");
    setConfidence("0.8");
    setEffort("");
    setErrors({});
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    // Placeholder: hoy guardamos en memoria. Cuando entre Supabase, este await
    // pasa a ser el insert real y el estado de carga ya queda cableado.
    await new Promise((resolve) => setTimeout(resolve, 400));

    onAdd({
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      status,
      reach: Number(reach),
      impact: Number(impact),
      confidence: Number(confidence),
      effort: Number(effort),
    });

    setIsSubmitting(false);
    resetForm();
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <fieldset disabled={isSubmitting} className="space-y-5">
        <legend className="sr-only">Datos de la feature</legend>

        <div>
          <label htmlFor={`${id}-title`} className={labelClass}>
            Título <span className="text-red-500">*</span>
          </label>
          <input
            id={`${id}-title`}
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Ej: Checkout en un solo paso"
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? `${id}-title-error` : undefined}
            className={fieldClass(Boolean(errors.title))}
          />
          {errors.title && (
            <p
              id={`${id}-title-error`}
              role="alert"
              className="mt-1 text-xs text-red-600 dark:text-red-400"
            >
              {errors.title}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={`${id}-description`} className={labelClass}>
            Descripción
          </label>
          <textarea
            id={`${id}-description`}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            placeholder="¿Qué problema resuelve y para quién?"
            className={`${fieldClass(false)} resize-y`}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor={`${id}-category`} className={labelClass}>
              Categoría
            </label>
            <input
              id={`${id}-category`}
              type="text"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              placeholder="Ej: onboarding"
              className={fieldClass(false)}
            />
          </div>

          <div>
            <label htmlFor={`${id}-status`} className={labelClass}>
              Estado
            </label>
            <select
              id={`${id}-status`}
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as FeatureStatus)
              }
              className={fieldClass(false)}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </fieldset>

      <fieldset
        disabled={isSubmitting}
        className="mt-7 border-t border-zinc-200 pt-6 dark:border-zinc-800"
      >
        <legend className="flex w-full items-baseline justify-between gap-4">
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Puntuación RICE
          </span>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            Score{" "}
            <span
              aria-live="polite"
              className="font-mono text-base font-semibold text-zinc-900 tabular-nums dark:text-zinc-100"
            >
              {formatRiceScore(liveScore)}
            </span>
          </span>
        </legend>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor={`${id}-reach`} className={labelClass}>
              Reach <span className="text-red-500">*</span>
            </label>
            <input
              id={`${id}-reach`}
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              value={reach}
              onChange={(event) => setReach(event.target.value)}
              placeholder="Ej: 1200"
              aria-invalid={Boolean(errors.reach)}
              aria-describedby={
                errors.reach ? `${id}-reach-error` : `${id}-reach-hint`
              }
              className={fieldClass(Boolean(errors.reach))}
            />
            {errors.reach ? (
              <p
                id={`${id}-reach-error`}
                role="alert"
                className="mt-1 text-xs text-red-600 dark:text-red-400"
              >
                {errors.reach}
              </p>
            ) : (
              <p id={`${id}-reach-hint`} className={hintClass}>
                Personas alcanzadas por trimestre.
              </p>
            )}
          </div>

          <div>
            <label htmlFor={`${id}-impact`} className={labelClass}>
              Impact
            </label>
            <select
              id={`${id}-impact`}
              value={impact}
              onChange={(event) => setImpact(event.target.value)}
              className={fieldClass(false)}
            >
              {IMPACT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className={hintClass}>Cuánto mueve la aguja por persona.</p>
          </div>

          <div>
            <label htmlFor={`${id}-confidence`} className={labelClass}>
              Confidence
            </label>
            <select
              id={`${id}-confidence`}
              value={confidence}
              onChange={(event) => setConfidence(event.target.value)}
              className={fieldClass(false)}
            >
              {CONFIDENCE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className={hintClass}>Qué tan seguro estás de las estimaciones.</p>
          </div>

          <div>
            <label htmlFor={`${id}-effort`} className={labelClass}>
              Effort <span className="text-red-500">*</span>
            </label>
            <input
              id={`${id}-effort`}
              type="number"
              inputMode="decimal"
              min={0}
              step={0.5}
              value={effort}
              onChange={(event) => setEffort(event.target.value)}
              placeholder="Ej: 2"
              aria-invalid={Boolean(errors.effort)}
              aria-describedby={
                errors.effort ? `${id}-effort-error` : `${id}-effort-hint`
              }
              className={fieldClass(Boolean(errors.effort))}
            />
            {errors.effort ? (
              <p
                id={`${id}-effort-error`}
                role="alert"
                className="mt-1 text-xs text-red-600 dark:text-red-400"
              >
                {errors.effort}
              </p>
            ) : (
              <p id={`${id}-effort-hint`} className={hintClass}>
                Persona-meses de trabajo.
              </p>
            )}
          </div>
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-7 w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white dark:focus-visible:outline-zinc-100"
      >
        {isSubmitting ? "Guardando…" : "Agregar feature"}
      </button>
    </form>
  );
}
