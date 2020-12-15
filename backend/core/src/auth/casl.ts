import { Ability, AbilityBuilder, AbilityClass } from "@casl/ability"
import { Injectable } from "@nestjs/common"
import { User } from "../entity/user.entity"
import { Application } from "../applications/entities/application.entity"

export enum Action {
  Manage = "manage",
  Create = "create",
  Read = "read",
  Update = "update",
  Delete = "delete",
}

type Subjects = typeof Application | "all"
export type AppAbility = Ability<[Action, Subjects]>

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User | null) {
    const { can, cannot, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(
      Ability as AbilityClass<AppAbility>
    )

    if (!user) {
      can(Action.Create, Application)
      return build()
    }

    if (user.isAdmin) {
      can(Action.Manage, "all")
    } else {
      can(Action.Read, "all")
    }

    can(Action.Read, Application, { listingId: 5 })
    can(Action.Update, Application, { listingId: 5 })

    return build()
  }
}
