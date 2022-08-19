import { BadRequestException, Inject, Injectable, NotFoundException, Scope } from "@nestjs/common"
import { InjectQueue } from "@nestjs/bull"
import { Queue } from "bull"
import { AuthzService } from "../auth/services/authz.service"
import { ApplicationFlaggedSet } from "./entities/application-flagged-set.entity"
import { InjectRepository } from "@nestjs/typeorm"
import { getManager, Repository } from "typeorm"
import { Application } from "../applications/entities/application.entity"
import { REQUEST } from "@nestjs/core"
import { Request as ExpressRequest } from "express"
import { User } from "../auth/entities/user.entity"
import { FlaggedSetStatus } from "./types/flagged-set-status-enum"
import { ApplicationFlaggedSetResolveDto } from "./dto/application-flagged-set-resolve.dto"
import { ApplicationFlaggedSetMeta } from "./dto/application-flagged-set-meta.dto"
import { PaginatedApplicationFlaggedSetQueryParams } from "./paginated-application-flagged-set-query-params"
import { ListingStatus } from "../listings/types/listing-status-enum"
import { AFSProcessingQueueNames } from "./constants/applications-flagged-sets-constants"

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
    const innerQuery = this.afsRepository
      .createQueryBuilder("afs")
      .select("afs.id")
      .where("afs.listingId = :listingId", { listingId: queryParams.listingId })
      .orderBy("afs.id", "DESC")
      .offset((queryParams.page - 1) * queryParams.limit)
      .limit(queryParams.limit)

    const outerQuery = this.afsRepository
      .createQueryBuilder("afs")
      .select([
        "afs.id",
        "afs.rule",
        "afs.status",
        "afs.listingId",
        "listing.id",
        "applications.id",
        "applicant.firstName",
        "applicant.lastName",
      ])
      .leftJoin("afs.listing", "listing")
      .leftJoin("afs.applications", "applications")
      .leftJoin("applications.applicant", "applicant")
      .orderBy("afs.id", "DESC")
      .where(`afs.id IN (` + innerQuery.getQuery() + ")")
      .setParameters(innerQuery.getParameters())

    const items = await outerQuery.getMany()
    const count = await innerQuery.getCount()

    const paginationInfo = {
      currentPage: queryParams.page,
      itemCount: items.length,
      itemsPerPage: queryParams.limit,
      totalItems: count,
      totalPages: Math.ceil(count / queryParams.limit),
    }

    innerQuery.andWhere("afs.status = :status", { status: FlaggedSetStatus.flagged })
    const countTotalFlagged = await innerQuery.getCount()

    return {
      items,
      meta: {
        ...paginationInfo,
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

  async meta(queryParams: PaginatedApplicationFlaggedSetQueryParams) {
    const constructQuery = (params: {
      listingId: string
      status?: FlaggedSetStatus
      rule?: Rule
    }): SelectQueryBuilder<ApplicationFlaggedSet> => {
      const query = this.afsRepository.createQueryBuilder("afs")
      query
        .select("SUM(1) as value")
        .where("afs.listing_id = :listingId", { listingId: params.listingId })
      if (params.status) {
        query.andWhere("afs.status = :status", { status: params.status })
      }
      if (params.rule) {
        query.andWhere("afs.rule = :rule", { rule: params.rule })
      }
      return query
    }
    const allQB = this.applicationsRepository.createQueryBuilder("afs")
    allQB.select("SUM(1) as value")
    allQB.where("afs.listing_id = :listingId", { listingId: queryParams.listingId })
    const resolvedQB = constructQuery({
      listingId: queryParams.listingId,
      status: FlaggedSetStatus.resolved,
    })
    const pendingQB = constructQuery({
      listingId: queryParams.listingId,
      status: FlaggedSetStatus.flagged,
    })
    const pendingNameQB = constructQuery({
      listingId: queryParams.listingId,
      status: FlaggedSetStatus.flagged,
      rule: Rule.nameAndDOB,
    })
    const pendingEmailQB = constructQuery({
      listingId: queryParams.listingId,
      status: FlaggedSetStatus.flagged,
      rule: Rule.email,
    })
    const [
      totalCount,
      totalResolvedCount,
      totalPendingCount,
      totalNamePendingCount,
      totalEmailPendingCount,
    ] = await Promise.all(
      [allQB, resolvedQB, pendingQB, pendingNameQB, pendingEmailQB].map(
        async (query) => await query.getRawOne()
      )
    )
    const res: ApplicationFlaggedSetMeta = {
      totalCount: totalCount.value,
      totalResolvedCount: totalResolvedCount.value,
      totalPendingCount: totalPendingCount.value,
      totalNamePendingCount: totalNamePendingCount.value,
      totalEmailPendingCount: totalEmailPendingCount.value,
    }
    return res
  }
}
