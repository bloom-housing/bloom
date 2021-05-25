import { Repository } from "typeorm"
import { Inject, NotFoundException } from "@nestjs/common"
import { FindConditions } from "typeorm/find-options/FindConditions"
import { ObjectLiteral } from "typeorm/common/ObjectLiteral"
import { getRepositoryToken } from "@nestjs/typeorm"
import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type"
import { assignDefined } from "../assign-defined"
import { ClassType } from "class-transformer/ClassTransformer"

export interface GenericUpdateDto {
  id?: string
}

export interface QueryOneOptions<T> {
  where: FindConditions<T>[] | FindConditions<T> | ObjectLiteral | string
}

export interface QueryManyOptions<T = any> extends QueryOneOptions<T> {
  skip?: number
  take?: number
}

export interface AbstractService<T, TCreateDto, TUpdateDto> {
  list(queryManyOptions?: QueryManyOptions<T>): Promise<T[]>
  create(dto: TCreateDto): Promise<T>
  findOne(queryOneOptions: QueryOneOptions<T>): Promise<T>
  delete(objId: string): Promise<void>
  update(dto: TUpdateDto): Promise<T>
}

export function AbstractServiceFactory<T, TCreateDto, TUpdateDto extends GenericUpdateDto>(
  entity: EntityClassOrSchema & ClassType<T>
): ClassType<AbstractService<T, TCreateDto, TUpdateDto>> {
  class AbstractServiceHost<T> implements AbstractService<T, TCreateDto, TUpdateDto> {
    @Inject(getRepositoryToken(entity)) repository: Repository<T>

    list(queryManyOptions?: QueryManyOptions<T>): Promise<T[]> {
      return this.repository.find(queryManyOptions)
    }

    async create(dto: TCreateDto): Promise<T> {
      return await this.repository.save(dto)
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
      assignDefined(obj, dto)
      await this.repository.save(obj)
      return obj
    }
  }
  return AbstractServiceHost
}
