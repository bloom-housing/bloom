import { Repository } from "typeorm"
import { ClassType } from "class-transformer/ClassTransformer"
import { plainToClass } from "class-transformer"
import { NotFoundException } from "@nestjs/common"
import { FindConditions } from "typeorm/find-options/FindConditions"
import { ObjectLiteral } from "typeorm/common/ObjectLiteral"

export interface GenericUpdateDto {
  id: string
}

export interface QueryOneOptions<T> {
  where: FindConditions<T>[] | FindConditions<T> | ObjectLiteral | string
}

export interface QueryManyOptions<T = any> extends QueryOneOptions<T> {
  skip?: number
  take?: number
}

export abstract class AbstractService<T, TCreateDto, TUpdateDto extends GenericUpdateDto> {
  protected constructor(protected repository: Repository<T>) {}

  protected get entityType(): ClassType<T> {
    return this.repository.target as ClassType<T>
  }

  async list(queryManyOptions?: QueryManyOptions<T>): Promise<T[]> {
    return this.repository.find(queryManyOptions)
  }

  async create(dto: TCreateDto): Promise<T> {
    const obj = plainToClass(this.entityType, dto)
    return await this.repository.save(obj)
  }

  async findOne(queryOneOptions: QueryOneOptions<T>): Promise<T> {
    const obj = await this.repository.findOne(queryOneOptions)
    if (!obj) {
      throw new NotFoundException()
    }
    return obj
  }

  async delete(objId: string) {
    await this.repository.delete(objId)
  }

  async update(dto: TUpdateDto) {
    const obj = await this.repository.findOne({
      where: {
        id: dto.id,
      },
    })
    if (!obj) {
      throw new NotFoundException()
    }
    Object.assign(obj, dto)
    await this.repository.save(obj)
    return obj
  }
}
