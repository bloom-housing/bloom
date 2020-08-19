import { Controller, Get, Query, Request, Res } from "@nestjs/common"
import { ListingsService } from "./listings.service"
import { Request as ExpressRequest, Response } from "express"
import { getPreferredLanguages, setContentLanguageHeader } from "../lib/translations"

@Controller()
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get()
  public async getAll(
    @Request() req: ExpressRequest,
    @Res() res: Response,
    @Query("jsonpath") jsonpath?: string
  ) {
    const body = await this.listingsService.list(jsonpath, getPreferredLanguages(req))
    setContentLanguageHeader(
      res,
      body.listings.map(({ languageCode }) => languageCode)
    )
    return res.send(body)
  }
}
