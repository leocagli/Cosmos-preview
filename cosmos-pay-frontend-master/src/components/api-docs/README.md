# Kit de documentación de API (`api-docs`)

Componentes reutilizables para páginas tipo “API reference” (Cosmos Pay u otras guías). Están desacoplados del copy de negocio: el artículo concreto vive en tu página o en `cosmosPay/docs/CosmosPayDocsArticle.tsx`.

## Importación

Desde un archivo bajo `src/pages/`:

```tsx
import {
  ApiDocsPageHeader,
  ApiDocsCodeSample,
  ApiDocsEndpoint,
  ApiDocsTocNav,
  useDocsActiveSection,
  DocsH2,
  DocsP,
  DocsCodeBlock,
  DocsCallout,
  DocsTable,
  DocsTh,
  DocsTd,
} from "../components/api-docs";
```

## Convenciones

1. **Anclas**: cada sección visible en el TOC debe tener un elemento con `id` fijo (normalmente `DocsH2 id="mi-seccion"`).
2. **Lista de IDs**: el mismo orden de IDs se pasa a `useDocsActiveSection` y a `ApiDocsTocNav` (`items[].id`).
3. **Tema**:
   - Páginas con fondo oscuro tipo docs públicas (zinc/blanco): `variant="inverse"` en cabecera, TOC y bloques de código.
   - Resto de la app (tokens `cosmos-*`): omití `variant` o usá `variant="cosmos"` en TOC / cabecera.

## Componentes

### `ApiDocsPageHeader`

Título, intro opcional, eyebrow y botón “copiar URL de esta página”.

```tsx
<ApiDocsPageHeader
  eyebrow="Cosmos Pay"
  title="API reference"
  intro="Texto breve debajo del título."
  variant="inverse"
  copyPageLabel="Copy page"
  copiedLabel="Copied"
/>
```

### `DocsH2`, `DocsH3`, `DocsP`, `DocsCallout`, `DocsSteps`, `DocsKeyPoint`

Tipografía y bloques de contenido; usan colores del tema Cosmos salvo que el contenedor padre fuerce otro estilo (como `.public-docs-article` en la doc pública).

### `DocsCodeBlock` y `ApiDocsCodeSample`

- **`DocsCodeBlock`**: código estático (string como hijo). Prop `tone`: `"default"` (borde cosmos) u `"inverse"` (bloque zinc para fondo casi negro).
- **`ApiDocsCodeSample`**: mismo aspecto + botón para copiar el snippet.

```tsx
<DocsCodeBlock tone="inverse">{`GET /api/v1/ping`}</DocsCodeBlock>

<ApiDocsCodeSample
  code={`curl -sS https://api.example.com/ping`}
  tone="inverse"
  copyLabel="Copy"
  copiedLabel="Copied"
/>
```

### `ApiDocsEndpoint`

Resalta método HTTP + ruta (útil encima de la descripción o del ejemplo).

```tsx
<ApiDocsEndpoint method="POST" path="/cosmos-pay/v1/payment-links" />
```

### `DocsTable`, `DocsTh`, `DocsTd`

Tabla para parámetros o campos de JSON:

```tsx
<DocsTable>
  <thead>
    <tr>
      <DocsTh>Field</DocsTh>
      <DocsTh>Type</DocsTh>
      <DocsTh>Description</DocsTh>
    </tr>
  </thead>
  <tbody>
    <tr>
      <DocsTd>
        <DocsInlineCode>amount</DocsInlineCode>
      </DocsTd>
      <DocsTd>number</DocsTd>
      <DocsTd>Amount in USDC.</DocsTd>
    </tr>
  </tbody>
</DocsTable>
```

(`DocsInlineCode` también se exporta desde el índice.)

### `ApiDocsTocNav` + `useDocsActiveSection`

Para la columna “On this page” o sidebar con resaltado al hacer scroll.

```tsx
const SECTION_IDS = ["intro", "auth", "errors"] as const;

const tocItems = [
  { id: "intro", label: "Introduction" },
  { id: "auth", label: "Authentication" },
  { id: "errors", label: "Errors" },
];

const activeId = useDocsActiveSection(SECTION_IDS);

<ApiDocsTocNav items={tocItems} activeId={activeId} variant="inverse" />
```

**Importante:** pasá un array de IDs **estable** entre renders (constante de módulo o `useMemo` con dependencias correctas), para no re-registrar listeners de scroll en vano.

## Referencia en el repo

- Artículo Cosmos Pay: `src/components/cosmosPay/docs/CosmosPayDocsArticle.tsx`
- Página con layout + TOC: `src/pages/CosmosPayPublicDocsPage.tsx`
- Re-export legacy: `src/components/cosmosPay/docs/CosmosPayDocsPrimitives.tsx` → reexporta este kit

## Añadir una nueva sección (checklist)

1. Añadí `DocsH2 id="nueva-seccion"` en el artículo.
2. Incluí `nueva-seccion` en el array exportado de IDs (p. ej. `COSMOS_PAY_DOCS_SECTION_IDS`) y en la lista de `tocItems` de la página.
3. Añadí textos en i18n (`cosmosPayDev` o el namespace que corresponda).
