export const pokemonKeys = {
  all: ["pokemon"] as const,
  list: (page: number) => [...pokemonKeys.all, "list", page] as const,
  detail: (name: string) => [...pokemonKeys.all, "detail", name] as const,
};