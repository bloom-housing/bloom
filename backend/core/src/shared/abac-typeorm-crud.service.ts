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
    protected readonly repo: Repository<T>,
    public readonly req,
    private readonly authzService: AuthzService,
    private readonly type: string
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

  private assertPermissions(req, obj, type, action) {
    return this.authzService.canOrThrow(req.user, type, action, this.getAccessObject(req, obj))
  }

  async getMany(crudReq: CrudRequest): Promise<GetManyDefaultResponse<T> | T[]> {
    const objects = await super.getMany(crudReq)
    if (Array.isArray(objects)) {
      objects.map((obj) => this.assertPermissions(this.req, obj, this.type, authzActions.read))
    } else {
      objects.data.map((obj) => this.assertPermissions(this.req, obj, this.type, authzActions.read))
    }
    return objects
  }

  async getOne(crudReq: CrudRequest): Promise<T> {
    const obj = await super.getOne(crudReq)
    this.assertPermissions(this.req, obj, this.type, authzActions.read)
    return obj
  }

  createOne(crudReq: CrudRequest, dto: DeepPartial<T>): Promise<T> {
    return super.createOne(crudReq, dto)
  }

  createMany(crudReq: CrudRequest, dto: CreateManyDto<DeepPartial<T>>): Promise<T[]> {
    return super.createMany(crudReq, dto)
  }

  async updateOne(crudReq: CrudRequest, dto: DeepPartial<T>): Promise<T> {
    const obj = await super.getOne(crudReq)
    this.assertPermissions(this.req, obj, this.type, authzActions.update)
    return super.updateOne(crudReq, dto)
  }

  async replaceOne(crudReq: CrudRequest, dto: DeepPartial<T>): Promise<T> {
    const obj = await super.getOne(crudReq)
    this.assertPermissions(this.req, obj, this.type, authzActions.update)
    return super.replaceOne(crudReq, dto)
  }

  async deleteOne(crudReq: CrudRequest): Promise<void | T> {
    const obj = await super.getOne(crudReq)
    this.assertPermissions(this.req, obj, this.type, authzActions.delete)
    return super.deleteOne(crudReq)
  }
}
