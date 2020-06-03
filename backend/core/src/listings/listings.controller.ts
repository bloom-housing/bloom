import { Controller, Get } from "@nestjs/common"
import { ListingsService } from "./listings.service"

@Controller()
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get()
  public async getAll() {
    return await this.listingsService.findAll()
  }
}
