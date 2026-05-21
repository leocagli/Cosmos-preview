/**
 * Componentes genéricos para páginas de documentación de API (Cosmos Pay y futuras guías).
 * Guía de uso: `README.md` en esta carpeta.
 */

export { useDocsActiveSection } from "./useDocsActiveSection";

export {
  DocsCallout,
  DocsCodeBlock,
  DocsH1,
  DocsH2,
  DocsH3,
  DocsH4,
  DocsInlineCode,
  DocsKeyPoint,
  DocsLi,
  DocsP,
  DocsSection,
  DocsSteps,
  DocsTable,
  DocsTd,
  DocsTh,
  DocsUl,
  type DocsCodeTone,
} from "./primitives";

export { ApiDocsPageHeader } from "./ApiDocsPageHeader";
export { ApiDocsCodeSample } from "./ApiDocsCodeSample";
export { ApiDocsEndpoint } from "./ApiDocsEndpoint";
export { ApiDocsTocNav, type ApiDocsTocItem } from "./ApiDocsToc";
