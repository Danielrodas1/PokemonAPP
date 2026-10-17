import {
  QueryClient,
  defaultShouldDehydrateQuery,
  isServer,
} from "@tanstack/react-query";

export const STALE_TIME = 24 * 60 * 60 * 1000; // 24 horas
export const GC_TIME = 48 * 60 * 60 * 1000; // 48 horas (>= staleTime)

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: STALE_TIME,
        gcTime: GC_TIME,
        retry: 1,
        refetchOnWindowFocus: false,
      },
      dehydrate: {
        // Incluye también queries pendientes para permitir streaming
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  if (isServer) {
    // En el servidor: un cliente nuevo por petición (evita filtrar datos entre usuarios)
    return makeQueryClient();
  }
  // En el navegador: un único cliente reutilizado
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}