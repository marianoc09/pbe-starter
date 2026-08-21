import {
  calculateRiceScore,
  formatRiceScore,
  statusLabel,
  type Feature,
} from "@/lib/rice";

type FeatureListProps = {
  features: Feature[];
};

const badgeClass =
  "inline-flex items-center rounded-full border border-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:border-zinc-700 dark:text-zinc-400";

export default function FeatureList({ features }: FeatureListProps) {
  if (features.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Todavía no cargaste ninguna feature
        </p>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-500">
          Completá el formulario de arriba y va a aparecer acá con su score RICE.
        </p>
      </div>
    );
  }

  return (
    <section aria-labelledby="features-heading">
      <h2
        id="features-heading"
        className="text-sm font-semibold text-zinc-900 dark:text-zinc-100"
      >
        Features cargadas{" "}
        <span className="font-normal text-zinc-500 dark:text-zinc-400">
          ({features.length})
        </span>
      </h2>

      <ul className="mt-4 space-y-3">
        {features.map((feature) => {
          const score = calculateRiceScore(
            feature.reach,
            feature.impact,
            feature.confidence,
            feature.effort
          );

          return (
            <li
              key={feature.id}
              className="flex items-start justify-between gap-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-zinc-900 dark:text-zinc-50">
                  {feature.title}
                </p>

                {feature.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {feature.description}
                  </p>
                )}

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className={badgeClass}>{statusLabel(feature.status)}</span>
                  {feature.category && (
                    <span className={badgeClass}>{feature.category}</span>
                  )}
                  <span className="text-xs text-zinc-500 dark:text-zinc-500">
                    R {feature.reach} · I {feature.impact} · C{" "}
                    {feature.confidence} · E {feature.effort}
                  </span>
                </div>
              </div>

              <div className="shrink-0 text-right">
                <p className="font-mono text-lg font-semibold text-zinc-900 tabular-nums dark:text-zinc-50">
                  {formatRiceScore(score)}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-500">RICE</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
