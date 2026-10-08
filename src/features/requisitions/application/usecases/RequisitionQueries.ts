import { RequisitionCatalog } from "../../domain/entities/RequisitionCatalog";
import { RequisitionCatalogRepository } from "../../domain/repositories/RequisitionCatalogRepository";

export class RequisitionQueries {
  private loaded: RequisitionCatalog | null = null;
  constructor(private readonly repository: RequisitionCatalogRepository) {}
  async load() {
    this.loaded = await this.repository.load();
  }
  get catalog(): RequisitionCatalog {
    if (!this.loaded) throw new Error("requisitions catalog has not loaded");
    return this.loaded;
  }
}
