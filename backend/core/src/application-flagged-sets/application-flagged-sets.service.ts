import { BadRequestException, Inject, Injectable, NotFoundException, Scope } from "@nestjs/common"
import { AuthzService } from "../auth/services/authz.service"
import { ApplicationFlaggedSet } from "./entities/application-flagged-set.entity"
import { InjectRepository } from "@nestjs/typeorm"
import { getManager, Repository } from "typeorm"
import { paginate } from "nestjs-typeorm-paginate"
import { Application } from "../applications/entities/application.entity"
import { REQUEST } from "@nestjs/core"
import { Request as ExpressRequest } from "express"
import { User } from "../auth/entities/user.entity"
import { FlaggedSetStatus } from "./types/flagged-set-status-enum"
import { ApplicationFlaggedSetResolveDto } from "./dto/application-flagged-set-resolve.dto"
import { PaginatedApplicationFlaggedSetQueryParams } from "./paginated-application-flagged-set-query-params"
import { ListingStatus } from "../listings/types/listing-status-enum"
import { InjectQueue } from "@nestjs/bull"
import { AFSProcessingQueueNames } from "./constants/applications-flagged-sets-constants"
import { Queue } from "bull"

@Injectable({ scope: Scope.REQUEST })
export class ApplicationFlaggedSetsService {
  constructor(
    @Inject(REQUEST) private request: ExpressRequest,
    private readonly authzService: AuthzService,
    @InjectRepository(Application)
    private readonly applicationsRepository: Repository<Application>,
    @InjectRepository(ApplicationFlaggedSet)
    private readonly afsRepository: Repository<ApplicationFlaggedSet>,
    @InjectQueue(AFSProcessingQueueNames.afsProcessing) private afsProcessingQueue: Queue
  ) {}
  async listPaginated(queryParams: PaginatedApplicationFlaggedSetQueryParams) {
    const results = await paginate<ApplicationFlaggedSet>(
      this.afsRepository,
      { limit: queryParams.limit, page: queryParams.page },
      {
        relations: ["listing", "applications"],
        where: {
          ...(queryParams.listingId && { listingId: queryParams.listingId }),
        },
      }
    )
    const countTotalFlagged = await this.afsRepository.count({
      where: {
        status: FlaggedSetStatus.flagged,
        ...(queryParams.listingId && { listingId: queryParams.listingId }),
      },
    })
    return {
      ...results,
      meta: {
        ...results.meta,
        totalFlagged: countTotalFlagged,
      },
    }
  }

  async findOneById(afsId: string) {
    return await this.afsRepository.findOneOrFail({
      relations: ["listing", "applications"],
      where: {
        id: afsId,
      },
    })
  }

  async resolve(dto: ApplicationFlaggedSetResolveDto) {
    return await getManager().transaction("SERIALIZABLE", async (transactionalEntityManager) => {
      const transAfsRepository = transactionalEntityManager.getRepository(ApplicationFlaggedSet)
      const transApplicationsRepository = transactionalEntityManager.getRepository(Application)
      const afs = await transAfsRepository.findOne({
        where: { id: dto.afsId },
        relations: ["applications", "listing"],
      })
      if (!afs) {
        throw new NotFoundException()
      }

      if (afs.listing.status !== ListingStatus.closed) {
        throw new BadRequestException("Listing must be closed before resolving any duplicates.")
      }

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      afs.resolvingUser = this.request.user as User
      afs.resolvedTime = new Date()
      afs.status = FlaggedSetStatus.resolved
      const appsToBeResolved = afs.applications.filter((afsApp) =>
        dto.applications.map((appIdDto) => appIdDto.id).includes(afsApp.id)
      )

      const appsNotToBeResolved = afs.applications.filter(
        (afsApp) => !dto.applications.map((appIdDto) => appIdDto.id).includes(afsApp.id)
      )

      for (const appToBeResolved of appsToBeResolved) {
        appToBeResolved.markedAsDuplicate = true
      }

      for (const appNotToBeResolved of appsNotToBeResolved) {
        appNotToBeResolved.markedAsDuplicate = false
      }

      await transApplicationsRepository.save([...appsToBeResolved, ...appsNotToBeResolved])

      appsToBeResolved.forEach((app) => (app.markedAsDuplicate = true))
      await transAfsRepository.save(afs)

      return afs
    })
  }

  public async scheduleAfsProcessing() {
    return this.afsProcessingQueue.add(null, {})
  }
}
