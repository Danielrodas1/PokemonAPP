"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-red-700">Algo salió mal</h1>
      <p className="mt-2 text-slate-600">{error.message}</p>
      <button
        onClick={() => reset()}
        className="mt-6 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
      >
        Intentar de nuevo
      </button>
    </main>
  );
}