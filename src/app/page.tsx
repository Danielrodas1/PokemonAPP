import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import PokemonList from "@/components/pokemon-list";
import { getQueryClient } from "@/lib/get-query-client";
import { getPokemonList } from "@/lib/pokeapi";
import { pokemonKeys } from "@/lib/query-keys";

interface HomeProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function HomePage({ searchParams }: HomeProps) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  const queryClient = getQueryClient();

  // Se ejecuta en el servidor: los datos viajan al cliente ya dentro del HTML
  await queryClient.prefetchQuery({
    queryKey: pokemonKeys.list(currentPage),
    queryFn: () => getPokemonList(currentPage),
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Lista de Pokémon</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PokemonList page={currentPage} />
      </HydrationBoundary>
    </main>
  );
}