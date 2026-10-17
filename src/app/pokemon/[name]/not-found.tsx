import Link from "next/link";

export default function PokemonNotFound() {
  return (
    <main className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="text-2xl font-bold">Pokémon no encontrado</h1>
      <p className="mt-2 text-slate-600">No existe un Pokémon con ese nombre.</p>
      <Link href="/" className="mt-6 inline-block text-red-600 hover:underline">
        ← Volver a la lista
      </Link>
    </main>
  );
}