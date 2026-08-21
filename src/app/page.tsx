"use client";

import Image from "next/image";
import { useState } from "react";
import FeatureForm from "@/components/FeatureForm";
import FeatureList from "@/components/FeatureList";
import type { Feature } from "@/lib/rice";

export default function Home() {
  // En memoria por ahora: se reemplaza por Supabase más adelante en el curso.
  const [features, setFeatures] = useState<Feature[]>([]);

  function handleAdd(feature: Feature) {
    setFeatures((current) => [feature, ...current]);
  }

  return (
    <main className="flex flex-1 justify-center bg-zinc-50 px-4 py-10 sm:py-16 dark:bg-zinc-950">
      <div className="w-full max-w-2xl">
        <header className="text-center">
          <Image
            src="/alaimo-labs-logo.svg"
            alt="Alaimo Labs"
            width={140}
            height={20}
            priority
            className="mx-auto dark:invert"
          />
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Nueva feature
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Capturá la idea y puntuala con RICE para saber qué construir primero.
          </p>
        </header>

        <div className="mt-8">
          <FeatureForm onAdd={handleAdd} />
        </div>

        <div className="mt-10">
          <FeatureList features={features} />
        </div>
      </div>
    </main>
  );
}
