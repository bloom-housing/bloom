import { FindManyOptions, FindOneOptions, Repository } from "typeorm"
import { Inject, NotFoundException } from "@nestjs/common"
import { getRepositoryToken } from "@nestjs/typeorm"
import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type"
import { ClassType } from "class-transformer/ClassTransformer"
import { assignDefined } from "../utils/assign-defined"

export interface GenericUpdateDto {
  id?: string
}

export interface AbstractService<T, TCreateDto, TUpdateDto> {
  list(findConditions?: FindManyOptions<T>): Promise<T[]>
  create(dto: TCreateDto): Promise<T>
  findOne(findConditions: FindOneOptions<T>): Promise<T>
  delete(objId: string): Promise<void>
  update(dto: TUpdateDto): Promise<T>
}

export function AbstractServiceFactory<T, TCreateDto, TUpdateDto extends GenericUpdateDto>(
  entity: EntityClassOrSchema & ClassType<T>
): ClassType<AbstractService<T, TCreateDto, TUpdateDto>> {
  class AbstractServiceHost<T> implements AbstractService<T, TCreateDto, TUpdateDto> {
    @Inject(getRepositoryToken(entity)) repository: Repository<T>

    list(findConditions?: FindManyOptions<T>): Promise<T[]> {
      return this.repository.find(findConditions)
    }

    async create(dto: TCreateDto): Promise<T> {
      return await this.repository.save(dto)
    }

    async findOne(findConditions: FindOneOptions<T>): Promise<T> {
      const obj = await this.repository.findOne(findConditions)
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
