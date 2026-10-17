import Link from "next/link";
import { notFound } from "next/navigation";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import PokemonDetailView from "@/components/pokemon-detail";
import { getQueryClient } from "@/lib/get-query-client";
import { getPokemonDetail } from "@/lib/pokeapi";
import { pokemonKeys } from "@/lib/query-keys";

interface PokemonPageProps {
  params: Promise<{ name: string }>;
}

export default async function PokemonPage({ params }: PokemonPageProps) {
  const { name } = await params;
  const queryClient = getQueryClient();

  try {
    await queryClient.fetchQuery({
      queryKey: pokemonKeys.detail(name),
      queryFn: () => getPokemonDetail(name),
    });
  } catch {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <Link href="/" className="mb-6 inline-block text-sm text-red-600 hover:underline">
        ← Volver a la lista
      </Link>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PokemonDetailView name={name} />
      </HydrationBoundary>
    </main>
  );
}