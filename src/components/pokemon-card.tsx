"use client";

import Image from "next/image";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { getPokemonDetail } from "@/lib/pokeapi";
import { pokemonKeys } from "@/lib/query-keys";
import type { PokemonListItem } from "@/types/pokemon";

export default function PokemonCard({ pokemon }: { pokemon: PokemonListItem }) {
  const queryClient = useQueryClient();

  const prefetchDetail = () => {
    // Respeta staleTime: si ya hay datos frescos en caché, no vuelve a pedir
    queryClient.prefetchQuery({
      queryKey: pokemonKeys.detail(pokemon.name),
      queryFn: () => getPokemonDetail(pokemon.name),
    });
  };

  return (
    <Link
      href={`/pokemon/${pokemon.name}`}
      onMouseEnter={prefetchDetail}
      onFocus={prefetchDetail}
      className="group flex flex-col items-center rounded-xl border bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <span className="self-end text-xs text-slate-400">
        #{String(pokemon.id).padStart(4, "0")}
      </span>
      <Image
        src={pokemon.image}
        alt={pokemon.name}
        width={120}
        height={120}
        className="h-28 w-28 object-contain"
      />
      <h2 className="mt-2 font-semibold capitalize">{pokemon.name}</h2>
    </Link>
  );
}