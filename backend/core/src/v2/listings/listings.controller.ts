import { Controller, Get } from "@nestjs/common"

@Controller("listings")
export class ListingsController {
  @Get()
  list() {
    return [1, 2, 3]
  }
}
