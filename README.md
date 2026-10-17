# Pokédex: Optimización de Transferencia de Datos con TanStack Query

Aplicación web construida con **Next.js 16 (App Router)**, **React Server Components**, **TanStack Query v5** y **TypeScript**, que consume [PokéAPI](https://pokeapi.co/) aplicando prefetching estratégico, hidratación servidor-cliente y una estrategia de caché de 24 horas.

## Funcionalidades

- **Lista de Pokémon (servidor):** la página principal es un Server Component que obtiene 60 Pokémon por página y los muestra en tarjetas con nombre e imagen, con paginación (`/?page=N`).
- **Prefetching en hover:** al pasar el mouse (`onMouseEnter`) o enfocar una tarjeta se ejecuta `prefetchQuery` con los datos completos del Pokémon (stats, tipos, habilidades, sprites y cadena evolutiva).
- **HydrationBoundary:** el servidor hace `prefetchQuery`/`fetchQuery`, serializa el caché con `dehydrate` y lo envía al cliente dentro de `<HydrationBoundary>`.
- **Página de detalle:** ruta dinámica `/pokemon/[name]` con stats, tipos, habilidades, sprites y cadena evolutiva.

## Instalación y ejecución

```bash
npm install
npm run dev     # desarrollo en http://localhost:3000
npm run build   # build de producción
npm start       # servir el build
```

Requiere Node.js 20.9 o superior.

## Estructura del proyecto

```
src/
├── app/
│   ├── layout.tsx                 # Layout raíz (Server) + Providers
│   ├── page.tsx                   # Lista (Server Component, prefetch + HydrationBoundary)
│   ├── loading.tsx / error.tsx    # Estados de carga y error
│   └── pokemon/[name]/
│       ├── page.tsx               # Detalle (Server Component)
│       └── not-found.tsx
├── components/
│   ├── providers.tsx              # QueryClientProvider (Client)
│   ├── pokemon-list.tsx           # useQuery de la lista (Client)
│   ├── pokemon-card.tsx           # Tarjeta + prefetch en hover (Client)
│   ├── pokemon-detail.tsx         # useQuery del detalle (Client)
│   └── pagination.tsx
├── lib/
│   ├── get-query-client.ts        # QueryClient (staleTime, gcTime, dehydrate)
│   ├── pokeapi.ts                 # Funciones de acceso a la API
│   └── query-keys.ts              # Claves de query centralizadas
└── types/pokemon.ts               # Tipado completo de la API
```

## Separación Server / Client Components

| Tipo | Archivos | Responsabilidad |
|------|----------|-----------------|
| Server | `app/page.tsx`, `app/pokemon/[name]/page.tsx`, `app/layout.tsx` | Obtener datos, poblar el caché y deshidratarlo |
| Client | `providers`, `pokemon-list`, `pokemon-card`, `pokemon-detail` | Leer el caché con `useQuery`, interactividad (hover) |

## Estrategia de caché

### Configuración global (`src/lib/get-query-client.ts`)

| Opción | Valor | Justificación |
|--------|-------|---------------|
| `staleTime` | `24 * 60 * 60 * 1000` (24 h) | Los datos de PokéAPI casi no cambian; durante 24 h los datos se consideran frescos y no se vuelven a pedir. |
| `gcTime` | `48 * 60 * 60 * 1000` (48 h) | Debe ser mayor o igual a `staleTime`. Si fuera menor, el caché se eliminaría antes de volverse obsoleto y se perdería la ventaja del `staleTime`. |
| `retry` | `1` | Un reintento ante fallos transitorios sin saturar la API. |
| `refetchOnWindowFocus` | `false` | Evita peticiones innecesarias al volver a la pestaña, ya que los datos son estáticos. |

### Flujo de datos

1. **Servidor:** se crea un `QueryClient` nuevo por petición (evita compartir datos entre usuarios), se ejecuta `prefetchQuery` (lista) o `fetchQuery` (detalle; si falla se muestra `not-found`) y se serializa con `dehydrate()`.
2. **Transferencia:** `<HydrationBoundary state={dehydrate(queryClient)}>` incluye el estado en el HTML.
3. **Cliente:** el navegador usa un único `QueryClient` singleton. `useQuery` encuentra los datos ya hidratados y renderiza sin estado de carga ni petición adicional.
4. **Prefetch en hover:** `onMouseEnter` dispara `prefetchQuery` con la misma clave que usa la página de detalle. Al navegar, los datos ya están en caché y se muestran al instante. Como `prefetchQuery` respeta `staleTime`, no repite peticiones si los datos siguen frescos.

### Claves de query (`src/lib/query-keys.ts`)

- Lista: `["pokemon", "list", page]`
- Detalle: `["pokemon", "detail", name]`

Compartir las mismas claves entre servidor, hover y componentes cliente es lo que permite reutilizar el caché.

### Capas de caché complementarias

- **Caché de TanStack Query (cliente):** `staleTime` 24 h / `gcTime` 48 h.
- **Caché de `fetch` de Next.js (servidor):** cada `fetch` usa `next: { revalidate: 86400 }`, por lo que las respuestas de PokéAPI también se reutilizan 24 h en el servidor.

### Detalle del endpoint compuesto

`getPokemonDetail` encadena tres endpoints (`/pokemon/{name}` → `/pokemon-species` → `/evolution-chain`) y devuelve un único objeto tipado. Así se cachea una sola entrada por Pokémon y el prefetch en hover carga todo lo necesario para la página de detalle. La cadena evolutiva se aplana en una lista ordenada.

## Manejo de estados

- **Carga:** skeletons (`animate-pulse`) en lista y detalle, más `loading.tsx` durante la navegación.
- **Error:** mensaje con botón "Reintentar" en los componentes cliente, `error.tsx` como límite global y `not-found.tsx` para nombres inexistentes.
- **Paginación:** `keepPreviousData` evita parpadeos al cambiar de página.

## Tecnologías

Next.js 16 · React · TypeScript · TanStack Query v5 · Tailwind CSS · PokéAPI