import { Inject, Injectable, Scope } from "@nestjs/common"
import { REQUEST } from "@nestjs/core"
import { Request as ExpressRequest } from "express"
import { CountyCode } from "../types/county-code"

@Injectable({ scope: Scope.REQUEST })
export class CountyCodeResolverService {
  constructor(@Inject(REQUEST) private req: ExpressRequest) {}

  getCountyCode(): CountyCode {
    const countyCode: CountyCode | undefined = CountyCode[this.req.get("county-code")]
    if (!countyCode) {
      return CountyCode.detroit
    }
    return countyCode
  }
}
