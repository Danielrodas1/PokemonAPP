// ---------- Respuestas crudas de PokéAPI ----------
export interface NameApiResource {
    name: string;
    url: string;
}

export interface PokemonListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    result: NamedAPIResource[];
}

export interface PokemonApiResponse {
    id: number;
    name: string;
    height: number;
    weight: number;
    species: NamedAPIResource;
    types: { slot: number; type: NamedAPIResource } [];
    abilities: { ability: NamedAPIResource; is_hidden: boolean; slot: number}[];
    stats: { base_stat: number; effort: number; stat: NamedAPIResource }[];
    sprites: {
        front_default: string | null;
        back_default: string | null;
        front_shiny: string | null;
        back_shiny: string | null;
  };
}

export interface SpeciesApiResponse {
  evolution_chain: { url: string };
}

export interface ChainLink {
  species: NamedAPIResource;
  evolves_to: ChainLink[];
}

export interface EvolutionChainApiResponse {
  id: number;
  chain: ChainLink;
}

// ---------- Modelos propios (lo que se guarda en caché) ----------
export interface PokemonListItem {
  id: number;
  name: string;
  image: string;
}

export interface PokemonListPage {
  count: number;
  items: PokemonListItem[];
}

export interface PokemonStat {
  name: string;
  value: number;
}

export interface PokemonAbility {
  name: string;
  isHidden: boolean;
}

export interface PokemonSprite {
  label: string;
  url: string;
}

export interface EvolutionStage {
  id: number;
  name: string;
  image: string;
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  image: string;
  types: string[];
  abilities: PokemonAbility[];
  stats: PokemonStat[];
  sprites: PokemonSprite[];
  evolutions: EvolutionStage[];
}