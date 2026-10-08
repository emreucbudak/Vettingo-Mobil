import { RequisitionCatalogRepository } from "../../domain/repositories/RequisitionCatalogRepository";
import { catalog } from "../fixtures/catalog";
import { RequisitionCatalog } from "../../domain/entities/RequisitionCatalog";
export class DemoRequisitionCatalogRepository implements RequisitionCatalogRepository {
  async load() {
    return JSON.parse(JSON.stringify(catalog)) as RequisitionCatalog;
  }
}
