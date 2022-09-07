import { BadRequestException, Inject, Injectable, Scope } from "@nestjs/common"
import { InjectQueue } from "@nestjs/bull"
import { Queue } from "bull"
import { AuthzService } from "../auth/services/authz.service"
import { ApplicationFlaggedSet } from "./entities/application-flagged-set.entity"
import { InjectRepository } from "@nestjs/typeorm"
import { getManager, Repository, SelectQueryBuilder } from "typeorm"
import { Application } from "../applications/entities/application.entity"
import { REQUEST } from "@nestjs/core"
import { Request as ExpressRequest } from "express"
import { User } from "../auth/entities/user.entity"
import { FlaggedSetStatus } from "./types/flagged-set-status-enum"
import { ApplicationFlaggedSetResolveDto } from "./dto/application-flagged-set-resolve.dto"
import { ApplicationFlaggedSetMeta } from "./dto/application-flagged-set-meta.dto"
import { PaginatedApplicationFlaggedSetQueryParams } from "./paginated-application-flagged-set-query-params"
import { ListingStatus } from "../listings/types/listing-status-enum"
import { View } from "./types/view-enum"
import { AFSProcessingQueueNames } from "./constants/applications-flagged-sets-constants"
import { Rule } from "./types/rule-enum"
import { IdDto } from "../../src/shared/dto/id.dto"

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
      .leftJoin("afs.applications", "applications")
      .where("afs.listingId = :listingId", { listingId: queryParams.listingId })
      .orderBy("afs.id", "DESC")
      .offset((queryParams.page - 1) * queryParams.limit)
      .limit(queryParams.limit)

    if (queryParams.view) {
      if (queryParams.view === View.pending) {
        innerQuery.andWhere("applications.reviewStatus = :status", {
          status: FlaggedSetStatus.flagged,
        })
      } else if (queryParams.view === View.pendingNameAndDoB) {
        innerQuery.andWhere("applications.reviewStatus = :status", {
          status: FlaggedSetStatus.flagged,
        })
        innerQuery.andWhere("rule = :rule", { rule: Rule.nameAndDOB })
      } else if (queryParams.view === View.pendingEmail) {
        innerQuery.andWhere("applications.reviewStatus = :status", {
          status: FlaggedSetStatus.flagged,
        })
        innerQuery.andWhere("rule = :rule", { rule: Rule.email })
      } else if (queryParams.view === View.resolved) {
        innerQuery.andWhere("applications.reviewStatus = :status", {
          status: FlaggedSetStatus.resolved,
        })
      }
    }

    const outerQuery = this.afsRepository
      .createQueryBuilder("afs")
      .select([
        "afs.id",
        "afs.rule",
        "applications.reviewStatus",
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

    innerQuery.andWhere("applications.reviewStatus = :status", { status: FlaggedSetStatus.flagged })
    const countTotalFlagged = await innerQuery.getCount()

    return {
      items,
      meta: {
        ...paginationInfo,
        totalFlagged: countTotalFlagged,
      },
    }
  }

  async findOneById(afsId: string, applicationIdList?: IdDto[]) {
    const qb = this.afsRepository
      .createQueryBuilder("afs")
      .select([
        "afs.id",
        "applications.id",
        "applications.submissionType",
        "applications.confirmationCode",
        "applicant.firstName",
        "applicant.lastName",
        "applicant.birthDay",
        "applicant.birthMonth",
        "applicant.birthYear",
        "listing.id",
        "listing.status",
      ])
      .leftJoin("afs.applications", "applications")
      .leftJoin("applications.applicant", "applicant")
      .leftJoin("afs.listing", "listing")
      .orderBy("applications.confirmationCode", "DESC")
      .where("afs.id = :id", { id: afsId })
    if (applicationIdList) {
      qb.andWhere("applications.id IN (:...applicationIdList)", {
        applicationIdList: applicationIdList.map((elem) => elem.id),
      })
    }

    return await qb.getOneOrFail()
  }

  async resolve(dto: ApplicationFlaggedSetResolveDto) {
    return await getManager().transaction("SERIALIZABLE", async (transactionalEntityManager) => {
      const transApplicationsRepository = transactionalEntityManager.getRepository(Application)
      const afs = await this.findOneById(dto.afsId, dto.applications)

      if (afs.listing.status !== ListingStatus.closed) {
        throw new BadRequestException("Listing must be closed before resolving any duplicates.")
      }

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      afs.resolvingUser = this.request.user as User
      afs.resolvedTime = new Date()

      await Promise.all(
        afs.applications.map(async (appToBeResolved) => {
          await transApplicationsRepository.update(appToBeResolved.id, {
            markedAsDuplicate: dto.reviewStatus === FlaggedSetStatus.resolved,
            reviewStatus: dto.reviewStatus,
          })
        })
      )
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
      const innerQuery = this.afsRepository
        .createQueryBuilder("afs")
        .select("afs.id")
        .leftJoin("afs.applications", "applications")
      innerQuery.where("afs.listing_id = :listingId", { listingId: params.listingId })
      if (params.status) {
        innerQuery.andWhere("applications.reviewStatus = :status", { status: params.status })
      }
      if (params.rule) {
        innerQuery.andWhere("afs.rule = :rule", { rule: params.rule })
      }

      const outerQuery = this.afsRepository
        .createQueryBuilder("afs")
        .select("SUM(1) as value")
        .where(`afs.id IN (` + innerQuery.getQuery() + ")")
        .setParameters(innerQuery.getParameters())

      return outerQuery
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
