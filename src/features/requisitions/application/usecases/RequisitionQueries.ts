import { RequisitionCatalog } from "../../domain/entities/RequisitionCatalog";
import { RequisitionCatalogRepository } from "../../domain/repositories/RequisitionCatalogRepository";

export class RequisitionQueries {
  constructor(
    private readonly repository: RequisitionCatalogRepository,
    private loaded: RequisitionCatalog | null = null,
  ) {}
  async load() {
    this.loaded = await this.repository.load();
  }
  get catalog(): RequisitionCatalog {
    if (!this.loaded) throw new Error("requisitions catalog has not loaded");
    return this.loaded;
  }
}
