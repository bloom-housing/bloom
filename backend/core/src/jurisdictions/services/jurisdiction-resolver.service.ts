import { Inject, Injectable, NotFoundException, Scope } from "@nestjs/common"
import { REQUEST } from "@nestjs/core"
import { InjectRepository } from "@nestjs/typeorm"
import { Request as ExpressRequest } from "express"
import { Repository } from "typeorm"
import { Jurisdiction } from "../entities/jurisdiction.entity"

@Injectable({ scope: Scope.REQUEST })
export class JurisdictionResolverService {
  constructor(
    @Inject(REQUEST) private req: ExpressRequest,
    @InjectRepository(Jurisdiction)
    private readonly jurisdictionRepository: Repository<Jurisdiction>
  ) {}

  async getJurisdiction(): Promise<Jurisdiction> {
    const jurisdictionName = this.req.get("jurisdictionName")
    const jurisdiction = await this.jurisdictionRepository.findOne({
      where: { name: jurisdictionName },
    })

    if (jurisdiction === undefined) {
      throw new NotFoundException("The jurisdiction is not configured.")
    }

    return jurisdiction
  }
}
