import { DefaultAuthGuard } from "./default.guard"
import { Injectable } from "@nestjs/common"

@Injectable()
export class OptionalAuthGuard extends DefaultAuthGuard {
  handleRequest(err, user, info) {
    return user
  }
}
