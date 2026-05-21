import { Navigate } from "react-router-dom";

/** La documentación vive en la ruta pública `/docs/cosmos-pay`. */
export function CosmosPayDevDocsPage() {
  return <Navigate to="/docs/cosmos-pay" replace />;
}
