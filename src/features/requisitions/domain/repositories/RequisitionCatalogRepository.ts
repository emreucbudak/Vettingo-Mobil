import { RequisitionCatalog } from "../entities/RequisitionCatalog";
export interface RequisitionCatalogRepository {
  load(): Promise<RequisitionCatalog>;
}
