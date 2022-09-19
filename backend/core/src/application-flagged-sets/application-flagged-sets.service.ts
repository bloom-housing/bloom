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
import { ApplicationReviewStatus } from "../applications/types/application-review-status-enum"

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

    if (queryParams.view) {
      if (queryParams.view === View.pending) {
        innerQuery.andWhere("afs.status = :status", {
          status: FlaggedSetStatus.pending,
        })
      } else if (queryParams.view === View.pendingNameAndDoB) {
        innerQuery.andWhere("afs.status = :status", {
          status: FlaggedSetStatus.pending,
        })
        innerQuery.andWhere("rule = :rule", { rule: Rule.nameAndDOB })
      } else if (queryParams.view === View.pendingEmail) {
        innerQuery.andWhere("afs.status = :status", {
          status: FlaggedSetStatus.pending,
        })
        innerQuery.andWhere("rule = :rule", { rule: Rule.email })
      } else if (queryParams.view === View.resolved) {
        innerQuery.andWhere("afs.status = :status", {
          status: FlaggedSetStatus.resolved,
        })
      }
    }
    // status
    const outerQuery = this.afsRepository
      .createQueryBuilder("afs")
      .select([
        "afs.id",
        "afs.rule",
        "afs.status",
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

    innerQuery.andWhere("afs.status = :status", {
      status: FlaggedSetStatus.pending,
    })
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
        "afs.rule",
        "afs.status",
        "applications.id",
        "applications.submissionType",
        "applications.confirmationCode",
        "applications.reviewStatus",
        "applications.submissionDate",
        "applicant.firstName",
        "applicant.lastName",
        "applicant.birthDay",
        "applicant.birthMonth",
        "applicant.birthYear",
        "applicant.emailAddress",
        "listing.id",
        "listing.status",
      ])
      .leftJoin("afs.applications", "applications")
      .leftJoin("applications.applicant", "applicant")
      .leftJoin("afs.listing", "listing")
      .orderBy("applications.confirmationCode", "DESC")
      .where("afs.id = :id", { id: afsId })
    if (applicationIdList?.length) {
      qb.andWhere("applications.id IN (:...applicationIdList)", {
        applicationIdList: applicationIdList.map((elem) => elem.id),
      })
    }

    return await qb.getOneOrFail()
  }

  async resolve(dto: ApplicationFlaggedSetResolveDto) {
    return await getManager().transaction("SERIALIZABLE", async (transactionalEntityManager) => {
      const transAfsRepository = transactionalEntityManager.getRepository(ApplicationFlaggedSet)
      const transApplicationsRepository = transactionalEntityManager.getRepository(Application)
      const afs = await this.findOneById(dto.afsId, dto.applications)

      if (afs.listing.status !== ListingStatus.closed) {
        throw new BadRequestException("Listing must be closed before resolving any duplicates.")
      }

      const selectedApps = dto.applications.length ? afs.applications.map((app) => app.id) : []

      if (dto.status === FlaggedSetStatus.pending) {
        // mark selected as pendingAndValid
        if (selectedApps.length) {
          await transApplicationsRepository
            .createQueryBuilder()
            .update(Application)
            .set({ reviewStatus: ApplicationReviewStatus.pendingAndValid })
            .where("id IN (:...selectedApps)", {
              selectedApps,
            })
            .execute()
        }

        // mark those that were not selected as duplicate
        const qb = transApplicationsRepository
          .createQueryBuilder()
          .update(Application)
          .set({ reviewStatus: ApplicationReviewStatus.pending })
          .where(
            "exists (SELECT 1 FROM application_flagged_set_applications_applications WHERE applications_id = id AND application_flagged_set_id = :afsId)",
            { afsId: dto.afsId }
          )

        if (selectedApps.length) {
          qb.andWhere("id NOT IN (:...selectedApps)", {
            selectedApps,
          })
        }
        await qb.execute()

        // mark the flagged set as pending
        await transAfsRepository
          .createQueryBuilder()
          .update(ApplicationFlaggedSet)
          .set({
            resolvedTime: new Date(),
            status: FlaggedSetStatus.pending,
            resolvingUser: this.request.user as User,
          })
          .where("id = :afsId", { afsId: dto.afsId })
          .execute()
      } else if (dto.status === FlaggedSetStatus.resolved) {
        // mark selected a valid
        if (selectedApps.length) {
          await transApplicationsRepository
            .createQueryBuilder()
            .update(Application)
            .set({ reviewStatus: ApplicationReviewStatus.valid })
            .where("id IN (:...selectedApps)", {
              selectedApps,
            })
            .execute()
        }

        // mark those that were not selected as duplicate
        const qb = transApplicationsRepository
          .createQueryBuilder()
          .update(Application)
          .set({ reviewStatus: ApplicationReviewStatus.duplicate })
          .where(
            "exists (SELECT 1 FROM application_flagged_set_applications_applications WHERE applications_id = id AND application_flagged_set_id = :afsId)",
            { afsId: dto.afsId }
          )
        if (selectedApps.length) {
          qb.andWhere("id NOT IN (:...selectedApps)", {
            selectedApps,
          })
        }
        await qb.execute()

        // mark the flagged set as resolved
        await transAfsRepository
          .createQueryBuilder()
          .update(ApplicationFlaggedSet)
          .set({
            resolvedTime: new Date(),
            status: FlaggedSetStatus.resolved,
            resolvingUser: this.request.user as User,
          })
          .where("id = :afsId", { afsId: dto.afsId })
          .execute()
      }
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
      const innerQuery = this.afsRepository.createQueryBuilder("afs").select("afs.id")
      innerQuery.where("afs.listing_id = :listingId", { listingId: params.listingId })
      if (params.status) {
        innerQuery.andWhere("afs.status = :status", { status: params.status })
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
      status: FlaggedSetStatus.pending,
    })

    const pendingNameQB = constructQuery({
      listingId: queryParams.listingId,
      status: FlaggedSetStatus.pending,
      rule: Rule.nameAndDOB,
    })

    const pendingEmailQB = constructQuery({
      listingId: queryParams.listingId,
      status: FlaggedSetStatus.pending,
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
