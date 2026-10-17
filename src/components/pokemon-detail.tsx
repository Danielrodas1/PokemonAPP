"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getPokemonDetail } from "@/lib/pokeapi";
import { pokemonKeys } from "@/lib/query-keys";

export default function PokemonDetailView({ name }: { name: string }) {
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: pokemonKeys.detail(name),
    queryFn: () => getPokemonDetail(name),
  });

  if (isPending) {
    return <div className="h-96 animate-pulse rounded-xl bg-slate-200" />;
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="font-medium text-red-700">Error: {error.message}</p>
        <button
          onClick={() => refetch()}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <article className="space-y-8">
      <header className="flex flex-col items-center gap-4 rounded-xl border bg-white p-6 shadow-sm sm:flex-row">
        <Image
          src={data.image}
          alt={data.name}
          width={220}
          height={220}
          priority
          className="h-52 w-52 object-contain"
        />
        <div className="space-y-3 text-center sm:text-left">
          <p className="text-sm text-slate-400">
            #{String(data.id).padStart(4, "0")}
          </p>
          <h1 className="text-4xl font-bold capitalize">{data.name}</h1>
          <div className="flex justify-center gap-2 sm:justify-start">
            {data.types.map((type) => (
              <span
                key={type}
                className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium capitalize text-red-700"
              >
                {type}
              </span>
            ))}
          </div>
          <p className="text-sm text-slate-600">
            Altura: {data.height / 10} m · Peso: {data.weight / 10} kg
          </p>
        </div>
      </header>

      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Estadísticas base</h2>
        <ul className="space-y-3">
          {data.stats.map((stat) => (
            <li key={stat.name} className="flex items-center gap-3 text-sm">
              <span className="w-36 capitalize text-slate-600">
                {stat.name.replace("-", " ")}
              </span>
              <span className="w-10 text-right font-semibold">{stat.value}</span>
              <div className="h-2 flex-1 rounded-full bg-slate-200">
                <div
                  className="h-2 rounded-full bg-red-500"
                  style={{ width: `${Math.min((stat.value / 255) * 100, 100)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Habilidades</h2>
        <ul className="flex flex-wrap gap-2">
          {data.abilities.map((ability) => (
            <li
              key={ability.name}
              className="rounded-lg bg-slate-100 px-3 py-1 text-sm capitalize"
            >
              {ability.name.replace("-", " ")}
              {ability.isHidden && (
                <span className="ml-1 text-xs text-slate-500">(oculta)</span>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Sprites</h2>
        <div className="flex flex-wrap gap-6">
          {data.sprites.map((sprite) => (
            <figure key={sprite.label} className="text-center">
              <Image
                src={sprite.url}
                alt={`${data.name} ${sprite.label}`}
                width={96}
                height={96}
                unoptimized
                className="h-24 w-24 [image-rendering:pixelated]"
              />
              <figcaption className="text-xs text-slate-500">{sprite.label}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Cadena evolutiva</h2>
        <ul className="flex flex-wrap items-center gap-4">
          {data.evolutions.map((stage, index) => (
            <li key={stage.id} className="flex items-center gap-4">
              {index > 0 && <span className="text-2xl text-slate-400">→</span>}
              <Link
                href={`/pokemon/${stage.name}`}
                className="flex flex-col items-center rounded-lg p-2 hover:bg-slate-100"
              >
                <Image
                  src={stage.image}
                  alt={stage.name}
                  width={96}
                  height={96}
                  className="h-24 w-24 object-contain"
                />
                <span className="text-sm capitalize">{stage.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}