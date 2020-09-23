import { DefaultAuthGuard } from "./default.guard"
import { Injectable } from "@nestjs/common"

@Injectable()
export class OptionalAuthGuard extends DefaultAuthGuard {
  handleRequest(err, user) {
    // User is literally "false" here when not logged in - return `undefined` instead so that req.user will be
    // undefined in the not-logged-in case.
    return user ? user : undefined
  }
}
