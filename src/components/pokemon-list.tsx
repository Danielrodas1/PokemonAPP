"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { PAGE_SIZE, getPokemonList } from "@/lib/pokeapi";
import { pokemonKeys } from "@/lib/query-keys";
import PokemonCard from "./pokemon-card";
import Pagination from "./pagination";

export default function PokemonList({ page }: { page: number }) {
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: pokemonKeys.list(page),
    queryFn: () => getPokemonList(page),
    placeholderData: keepPreviousData,
  });

  if (isPending) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="h-44 animate-pulse rounded-xl bg-slate-200" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="font-medium text-red-700">
          No se pudo cargar la lista: {error.message}
        </p>
        <button
          onClick={() => refetch()}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const totalPages = Math.ceil(data.count / PAGE_SIZE);

  if (data.items.length === 0) {
    return <p className="text-center text-slate-500">No hay Pokémon en esta página.</p>;
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {data.items.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>
      <Pagination page={page} totalPages={totalPages} />
    </>
  );
}