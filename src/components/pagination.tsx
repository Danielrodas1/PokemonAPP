import Link from "next/link";

interface PaginationProps {
  page: number;
  totalPages: number;
}

const base = "rounded-lg border px-4 py-2 text-sm font-medium";

export default function Pagination({ page, totalPages }: PaginationProps) {
  return (
    <nav
      aria-label="Paginación"
      className="mt-8 flex items-center justify-center gap-4"
    >
      {page > 1 ? (
        <Link href={`/?page=${page - 1}`} className={`${base} bg-white hover:bg-slate-100`}>
          ← Anterior
        </Link>
      ) : (
        <span className={`${base} cursor-not-allowed opacity-40`}>← Anterior</span>
      )}

      <span className="text-sm text-slate-600">
        Página {page} de {totalPages}
      </span>

      {page < totalPages ? (
        <Link href={`/?page=${page + 1}`} className={`${base} bg-white hover:bg-slate-100`}>
          Siguiente →
        </Link>
      ) : (
        <span className={`${base} cursor-not-allowed opacity-40`}>Siguiente →</span>
      )}
    </nav>
  );
}