import { BadRequestException, Inject, Injectable, NotFoundException, Scope } from "@nestjs/common"
import { AuthzService } from "../auth/services/authz.service"
import { ApplicationFlaggedSet } from "./entities/application-flagged-set.entity"
import { InjectRepository } from "@nestjs/typeorm"
import {
  Brackets,
  DeepPartial,
  EntityManager,
  getManager,
  getMetadataArgsStorage,
  In,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from "typeorm"
import { paginate } from "nestjs-typeorm-paginate"
import { Application } from "../applications/entities/application.entity"
import { REQUEST } from "@nestjs/core"
import { Request as ExpressRequest } from "express"
import { User } from "../auth/entities/user.entity"
import { FlaggedSetStatus } from "./types/flagged-set-status-enum"
import { Rule } from "./types/rule-enum"
import { ApplicationFlaggedSetResolveDto } from "./dto/application-flagged-set-resolve.dto"
import { ApplicationFlaggedSetMeta } from "./dto/application-flagged-set-meta.dto"
import { PaginatedApplicationFlaggedSetQueryParams } from "./paginated-application-flagged-set-query-params"
import { ListingStatus } from "../listings/types/listing-status-enum"

@Injectable({ scope: Scope.REQUEST })
export class ApplicationFlaggedSetsService {
  constructor(
    @Inject(REQUEST) private request: ExpressRequest,
    private readonly authzService: AuthzService,
    @InjectRepository(Application)
    private readonly applicationsRepository: Repository<Application>,
    @InjectRepository(ApplicationFlaggedSet)
    private readonly afsRepository: Repository<ApplicationFlaggedSet>
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

  async onApplicationSave(newApplication: Application, transactionalEntityManager: EntityManager) {
    for (const rule of [Rule.email, Rule.nameAndDOB]) {
      await this.updateApplicationFlaggedSetsForRule(
        transactionalEntityManager,
        newApplication,
        rule
      )
    }
  }

  private async _getAfsesContainingApplicationId(
    queryRunnery: QueryRunner,
    applicationId: string
  ): Promise<Array<{ application_flagged_set_id: string }>> {
    const metadataArgsStorage = getMetadataArgsStorage().findJoinTable(
      ApplicationFlaggedSet,
      "applications"
    )
    const applicationsJunctionTableName = metadataArgsStorage.name
    const query = `
      SELECT DISTINCT application_flagged_set_id FROM ${applicationsJunctionTableName}
      WHERE applications_id = $1
  `
    return await queryRunnery.query(query, [applicationId])
  }

  async onApplicationUpdate(
    newApplication: Application,
    transactionalEntityManager: EntityManager
  ) {
    const transApplicationsRepository = transactionalEntityManager.getRepository(Application)
    newApplication.markedAsDuplicate = false
    await transApplicationsRepository.save(newApplication)

    const transAfsRepository = transactionalEntityManager.getRepository(ApplicationFlaggedSet)

    const afsIds = await this._getAfsesContainingApplicationId(
      transAfsRepository.queryRunner,
      newApplication.id
    )
    const afses = await transAfsRepository.find({
      where: { id: In(afsIds.map((afs) => afs.application_flagged_set_id)) },
      relations: ["applications"],
    })
    const afsesToBeSaved: Array<ApplicationFlaggedSet> = []
    const afsesToBeRemoved: Array<ApplicationFlaggedSet> = []
    for (const afs of afses) {
      afs.status = FlaggedSetStatus.flagged
      afs.resolvedTime = null
      afs.resolvingUser = null
      const applicationIndex = afs.applications.findIndex(
        (application) => application.id === newApplication.id
      )
      afs.applications.splice(applicationIndex, 1)
      if (afs.applications.length > 1) {
        afsesToBeSaved.push(afs)
      } else {
        afsesToBeRemoved.push(afs)
      }
    }
    await transAfsRepository.save(afsesToBeSaved)
    await transAfsRepository.remove(afsesToBeRemoved)

    await this.onApplicationSave(newApplication, transactionalEntityManager)
  }

  async fetchDuplicatesMatchingRule(
    transactionalEntityManager: EntityManager,
    application: Application,
    rule: Rule
  ) {
    switch (rule) {
      case Rule.nameAndDOB:
        return await this.fetchDuplicatesMatchingNameAndDOBRule(
          transactionalEntityManager,
          application
        )
      case Rule.email:
        return await this.fetchDuplicatesMatchingEmailRule(transactionalEntityManager, application)
    }
  }

  async updateApplicationFlaggedSetsForRule(
    transactionalEntityManager: EntityManager,
    newApplication: Application,
    rule: Rule
  ) {
    const applicationsMatchingRule = await this.fetchDuplicatesMatchingRule(
      transactionalEntityManager,
      newApplication,
      rule
    )
    const transAfsRepository = transactionalEntityManager.getRepository(ApplicationFlaggedSet)
    const visitedAfses = []
    const afses = await transAfsRepository
      .createQueryBuilder("afs")
      .leftJoin("afs.applications", "applications")
      .select(["afs", "applications.id"])
      .where(`afs.listing_id = :listingId`, { listingId: newApplication.listing.id })
      .andWhere(`rule = :rule`, { rule })
      .getMany()

    for (const matchedApplication of applicationsMatchingRule) {
      const afsesMatchingRule = afses.filter((afs) =>
        afs.applications.map((app) => app.id).includes(matchedApplication.id)
      )

      if (afsesMatchingRule.length === 0) {
        const newAfs: DeepPartial<ApplicationFlaggedSet> = {
          rule: rule,
          resolvedTime: null,
          resolvingUser: null,
          status: FlaggedSetStatus.flagged,
          applications: [newApplication, matchedApplication],
          listing: newApplication.listing,
        }
        await transAfsRepository.save(newAfs)
      } else if (afsesMatchingRule.length === 1) {
        for (const afs of afsesMatchingRule) {
          if (visitedAfses.includes(afs.id)) {
            return
          }
          visitedAfses.push(afs.id)
          afs.applications.push(newApplication)
          await transAfsRepository.save(afs)
        }
      } else {
        console.error(
          "There should be up to one AFS matching a rule for given application, " +
            "probably a logic error when creating AFSes"
        )
      }
    }
  }

  private async fetchDuplicatesMatchingEmailRule(
    transactionalEntityManager: EntityManager,
    newApplication: Application
  ) {
    const transApplicationsRepository = transactionalEntityManager.getRepository(Application)
    return await transApplicationsRepository.find({
      select: ["id"],
      where: (qb: SelectQueryBuilder<Application>) => {
        qb.where("Application.id != :id", {
          id: newApplication.id,
        })
          .andWhere("Application.listing.id = :listingId", {
            listingId: newApplication.listing.id,
          })
          .andWhere("Application__applicant.emailAddress = :emailAddress", {
            emailAddress: newApplication.applicant.emailAddress,
          })
          .andWhere("Application.status = :status", { status: "submitted" })
      },
    })
  }

  private async fetchDuplicatesMatchingNameAndDOBRule(
    transactionalEntityManager: EntityManager,
    newApplication: Application
  ) {
    const transApplicationsRepository = transactionalEntityManager.getRepository(Application)
    const firstNames = [
      newApplication.applicant.firstName,
      ...newApplication.householdMembers.map((householdMember) => householdMember.firstName),
    ]

    const lastNames = [
      newApplication.applicant.lastName,
      ...newApplication.householdMembers.map((householdMember) => householdMember.lastName),
    ]

    const birthMonths = [
      newApplication.applicant.birthMonth,
      ...newApplication.householdMembers.map((householdMember) => householdMember.birthMonth),
    ]

    const birthDays = [
      newApplication.applicant.birthDay,
      ...newApplication.householdMembers.map((householdMember) => householdMember.birthDay),
    ]

    const birthYears = [
      newApplication.applicant.birthYear,
      ...newApplication.householdMembers.map((householdMember) => householdMember.birthYear),
    ]

    return await transApplicationsRepository.find({
      select: ["id"],
      where: (qb: SelectQueryBuilder<Application>) => {
        qb.where("Application.id != :id", {
          id: newApplication.id,
        })
          .andWhere("Application.listing.id = :listingId", {
            listingId: newApplication.listing.id,
          })
          .andWhere("Application.status = :status", { status: "submitted" })
          .andWhere(
            new Brackets((subQb) => {
              subQb.where("Application__householdMembers.firstName IN (:...firstNames)", {
                firstNames: firstNames,
              })
              subQb.orWhere("Application__applicant.firstName IN (:...firstNames)", {
                firstNames: firstNames,
              })
            })
          )
          .andWhere(
            new Brackets((subQb) => {
              subQb.where("Application__householdMembers.lastName IN (:...lastNames)", {
                lastNames: lastNames,
              })
              subQb.orWhere("Application__applicant.lastName IN (:...lastNames)", {
                lastNames: lastNames,
              })
            })
          )
          .andWhere(
            new Brackets((subQb) => {
              subQb.where("Application__householdMembers.birthMonth IN (:...birthMonths)", {
                birthMonths: birthMonths,
              })
              subQb.orWhere("Application__applicant.birthMonth IN (:...birthMonths)", {
                birthMonths: birthMonths,
              })
            })
          )
          .andWhere(
            new Brackets((subQb) => {
              subQb.where("Application__householdMembers.birthDay IN (:...birthDays)", {
                birthDays: birthDays,
              })
              subQb.orWhere("Application__applicant.birthDay IN (:...birthDays)", {
                birthDays: birthDays,
              })
            })
          )
          .andWhere(
            new Brackets((subQb) => {
              subQb.where("Application__householdMembers.birthYear IN (:...birthYears)", {
                birthYears: birthYears,
              })
              subQb.orWhere("Application__applicant.birthYear IN (:...birthYears)", {
                birthYears: birthYears,
              })
            })
          )
      },
    })
  }

  async meta(queryParams: PaginatedApplicationFlaggedSetQueryParams) {
    const allQB = this.applicationsRepository.createQueryBuilder("afs")
    allQB.select("SUM(1) as totalCount")
    allQB.where("afs.listing_id = :listingId", { listingId: queryParams.listingId })

    const resolvedQB = this.afsRepository.createQueryBuilder("afs")
    resolvedQB.select("SUM(1) as totalResolvedCount")
    resolvedQB.where("afs.listingId = :listingId", { listingId: queryParams.listingId })
    resolvedQB.andWhere("afs.status = :status", { status: FlaggedSetStatus.resolved })

    const pendingQB = this.afsRepository.createQueryBuilder("afs")
    pendingQB.select("SUM(1) as totalPendingCount")
    pendingQB.where("afs.listingId = :listingId", { listingId: queryParams.listingId })
    pendingQB.andWhere("afs.status = :status", { status: FlaggedSetStatus.flagged })

    const pendingNameQB = this.afsRepository.createQueryBuilder("afs")
    pendingNameQB.select("SUM(1) as totalNamePendingCount")
    pendingNameQB.where("afs.listingId = :listingId", { listingId: queryParams.listingId })
    pendingNameQB.andWhere("afs.status = :status", { status: FlaggedSetStatus.flagged })
    pendingNameQB.andWhere("afs.rule = :rule", { rule: Rule.nameAndDOB })

    const pendingEmailQB = this.afsRepository.createQueryBuilder("afs")
    pendingEmailQB.select("SUM(1) as totalEmailPendingCount")
    pendingEmailQB.where("afs.listingId = :listingId", { listingId: queryParams.listingId })
    pendingEmailQB.andWhere("afs.status = :status", { status: FlaggedSetStatus.flagged })
    pendingEmailQB.andWhere("afs.rule = :rule", { rule: Rule.email })

    const results = await Promise.all(
      [allQB, resolvedQB, pendingQB, pendingNameQB, pendingEmailQB].map(
        async (query) => await query.getRawOne()
      )
    )

    const res: ApplicationFlaggedSetMeta = {}

    results.forEach((elem) => {
      if ("totalcount" in elem) {
        res.totalCount = elem.totalcount
      }
      if ("totalresolvedcount" in elem) {
        res.totalResolvedCount = elem.totalresolvedcount
      }
      if ("totalpendingcount" in elem) {
        res.totalPendingCount = elem.totalpendingcount
      }
      if ("totalnamependingcount" in elem) {
        res.totalNamePendingCount = elem.totalnamependingcount
      }
      if ("totalemailpendingcount" in elem) {
        res.totalEmailPendingCount = elem.totalemailpendingcount
      }
    })

    return res
  }
}
