import type {
  ChainLink,
  EvolutionChainApiResponse,
  EvolutionStage,
  PokemonApiResponse,
  PokemonDetail,
  PokemonListPage,
  PokemonListResponse,
  PokemonSprite,
  SpeciesApiResponse,
} from "@/types/pokemon";

const BASE_URL = "https://pokeapi.co/api/v2";
const ARTWORK_URL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork";

export const PAGE_SIZE = 60;

async function fetchJson<T>(url: string): Promise<T> {
  // "next.revalidate" solo aplica en el servidor (caché de fetch de Next.js)
  const res = await fetch(url, { next: { revalidate: 24 * 60 * 60 } });
  if (!res.ok) {
    throw new Error(`PokéAPI respondió ${res.status} en ${url}`);
  }
  return res.json() as Promise<T>;
}

function extractId(url: string): number {
  return Number(url.split("/").filter(Boolean).pop());
}

export function artworkUrl(id: number): string {
  return `${ARTWORK_URL}/${id}.png`;
}

export async function getPokemonList(page: number): Promise<PokemonListPage> {
  const offset = (page - 1) * PAGE_SIZE;
  const data = await fetchJson<PokemonListResponse>(
    `${BASE_URL}/pokemon?limit=${PAGE_SIZE}&offset=${offset}`
  );

  return {
    count: data.count,
    items: data.results.map((r) => {
      const id = extractId(r.url);
      return { id, name: r.name, image: artworkUrl(id) };
    }),
  };
}

function flattenChain(node: ChainLink): EvolutionStage[] {
  const id = extractId(node.species.url);
  return [
    { id, name: node.species.name, image: artworkUrl(id) },
    ...node.evolves_to.flatMap(flattenChain),
  ];
}

export async function getPokemonDetail(name: string): Promise<PokemonDetail> {
  const pokemon = await fetchJson<PokemonApiResponse>(
    `${BASE_URL}/pokemon/${name}`
  );
  const species = await fetchJson<SpeciesApiResponse>(pokemon.species.url);
  const chain = await fetchJson<EvolutionChainApiResponse>(
    species.evolution_chain.url
  );

  const spriteCandidates: { label: string; url: string | null }[] = [
    { label: "Frente", url: pokemon.sprites.front_default },
    { label: "Espalda", url: pokemon.sprites.back_default },
    { label: "Frente shiny", url: pokemon.sprites.front_shiny },
    { label: "Espalda shiny", url: pokemon.sprites.back_shiny },
  ];
  const sprites: PokemonSprite[] = spriteCandidates.filter(
    (s): s is PokemonSprite => s.url !== null
  );

  return {
    id: pokemon.id,
    name: pokemon.name,
    height: pokemon.height,
    weight: pokemon.weight,
    image: artworkUrl(pokemon.id),
    types: pokemon.types.map((t) => t.type.name),
    abilities: pokemon.abilities.map((a) => ({
      name: a.ability.name,
      isHidden: a.is_hidden,
    })),
    stats: pokemon.stats.map((s) => ({
      name: s.stat.name,
      value: s.base_stat,
    })),
    sprites,
    evolutions: flattenChain(chain.chain),
  };
}