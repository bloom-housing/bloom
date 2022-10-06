import { MultiselectQuestion } from "./entities/multiselect-question.entity"
import { MultiselectQuestionCreateDto } from "../multiselect-question/dto/multiselect-question-create.dto"
import { MultiselectQuestionUpdateDto } from "../multiselect-question/dto/multiselect-question-update.dto"
import { NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { FindOneOptions, Repository } from "typeorm"
import { addFilters } from "../shared/query-filter"
import { MultiselectQuestionsListQueryParams } from "../multiselect-question/dto/multiselect-question-list-query-params"
import { MultiselectQuestionsFilterParams } from "../multiselect-question/dto/multiselect-question-filter-params"
import { jurisdictionFilterTypeToFieldMap } from "./dto/jurisdictionFilterTypeToFieldMap"
import { assignDefined } from "../shared/utils/assign-defined"
import { Listing } from "../listings/entities/listing.entity"

export class MultiselectQuestionsService {
  constructor(
    @InjectRepository(MultiselectQuestion)
    private readonly repository: Repository<MultiselectQuestion>,
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>
  ) {}

  list(params?: MultiselectQuestionsListQueryParams): Promise<MultiselectQuestion[]> {
    const qb = this.repository
      .createQueryBuilder("multiselectQuestions")
      .leftJoin("multiselectQuestions.jurisdictions", "multiselectQuestionJurisdictions")
      .select([
        "multiselectQuestions",
        "multiselectQuestionJurisdictions.id",
        "multiselectQuestionJurisdictions.name",
      ])

    if (params.filter) {
      addFilters<Array<MultiselectQuestionsFilterParams>, typeof jurisdictionFilterTypeToFieldMap>(
        params.filter,
        jurisdictionFilterTypeToFieldMap,
        qb
      )
    }

    return qb.getMany()
  }

  async create(dto: MultiselectQuestionCreateDto): Promise<MultiselectQuestion> {
    return await this.repository.save(dto)
  }

  async findOne(findOneOptions: FindOneOptions<MultiselectQuestion>): Promise<MultiselectQuestion> {
    const obj = await this.repository.findOne(findOneOptions)
    if (!obj) {
      throw new NotFoundException()
    }
    return obj
  }

  async delete(objId: string) {
    await this.repository.delete(objId)
  }

  async update(dto: MultiselectQuestionUpdateDto) {
    const obj = await this.repository.findOne({
      where: {
        id: dto.id,
      },
    })
    if (!obj) {
      throw new NotFoundException()
    }
    assignDefined(obj, dto)
    await this.repository.save(obj)
    return obj
  }

  async findListingsWithMultiSelectQuestion(multiSelectQuestionId: string): Promise<Listing[]> {
    const qb = this.listingRepository
      .createQueryBuilder("listings")
      .select(["listings.id", "listings.name"])
      .leftJoin("listings.listingMultiselectQuestions", "listingMultiselectQuestions")
      .leftJoin("listingMultiselectQuestions.multiselectQuestion", "multiselectQuestion")
      .where("multiselectQuestion.id = :multiSelectQuestionId", {
        multiSelectQuestionId: multiSelectQuestionId,
      })

    return qb.getMany()
  }
}
