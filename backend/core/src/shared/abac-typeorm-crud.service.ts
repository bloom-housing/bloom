import { TypeOrmCrudService } from "@nestjsx/crud-typeorm"
import { DeepPartial, Repository } from "typeorm"
import { authzActions, AuthzService } from "../auth/authz.service"
import { CreateManyDto, CrudRequest, GetManyDefaultResponse } from "@nestjsx/crud"

import { User } from "../entity/user.entity"

export interface UserRelation {
  user?: User
}

export abstract class ABACTypeOrmCrudService<T extends UserRelation> extends TypeOrmCrudService<T> {
  readonly findOne: Repository<T>["findOne"]
  readonly find: Repository<T>["find"]
  readonly count: Repository<T>["count"]

  protected constructor(
    public readonly repo: Repository<T>,
    public readonly req,
    public readonly authzService: AuthzService,
    public readonly type: string
  ) {
    super(repo)
  }

  getAccessObject(req, obj: T): any {
    return {
      ...obj,
      // eslint-disable-next-line @typescript-eslint/camelcase
      user_id: obj.user?.id,
    }
  }

  private async assertPermissions(req, obj, type, action) {
    return await this.authzService.canOrThrow(
      req.user,
      type,
      action,
      this.getAccessObject(req, obj)
    )
  }

  addUserEagerJoin(crudReq: CrudRequest): CrudRequest {
    crudReq.parsed.join.push({
      field: "user",
    })
    return crudReq
  }

  async getMany(crudReq: CrudRequest): Promise<GetManyDefaultResponse<T> | T[]> {
    crudReq = this.addUserEagerJoin(crudReq)
    const objects = await super.getMany(crudReq)
    if (Array.isArray(objects)) {
      await Promise.all(
        objects.map(async (obj) =>
          this.assertPermissions(this.req, obj, this.type, authzActions.read)
        )
      )
    } else {
      await Promise.all(
        objects.data.map(
          async (obj) => await this.assertPermissions(this.req, obj, this.type, authzActions.read)
        )
      )
    }
    return objects
  }

  async getOne(crudReq: CrudRequest): Promise<T> {
    crudReq = this.addUserEagerJoin(crudReq)
    const obj = await super.getOne(crudReq)
    await this.assertPermissions(this.req, obj, this.type, authzActions.read)
    return obj
  }

  createOne(crudReq: CrudRequest, dto: DeepPartial<T>): Promise<T> {
    crudReq = this.addUserEagerJoin(crudReq)
    return super.createOne(crudReq, dto)
  }

  createMany(crudReq: CrudRequest, dto: CreateManyDto<DeepPartial<T>>): Promise<T[]> {
    crudReq = this.addUserEagerJoin(crudReq)
    return super.createMany(crudReq, dto)
  }

  async updateOne(crudReq: CrudRequest, dto: DeepPartial<T>): Promise<T> {
    crudReq = this.addUserEagerJoin(crudReq)
    const obj = await super.getOne(crudReq)
    await this.assertPermissions(this.req, obj, this.type, authzActions.update)
    return super.updateOne(crudReq, dto)
  }

  async replaceOne(crudReq: CrudRequest, dto: DeepPartial<T>): Promise<T> {
    crudReq = this.addUserEagerJoin(crudReq)
    const obj = await super.getOne(crudReq)
    await this.assertPermissions(this.req, obj, this.type, authzActions.update)
    return super.replaceOne(crudReq, dto)
  }

  async deleteOne(crudReq: CrudRequest): Promise<void | T> {
    crudReq = this.addUserEagerJoin(crudReq)
    const obj = await super.getOne(crudReq)
    await this.assertPermissions(this.req, obj, this.type, authzActions.delete)
    return super.deleteOne(crudReq)
  }
}
