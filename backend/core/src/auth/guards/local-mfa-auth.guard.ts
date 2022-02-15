import { Injectable } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"

@Injectable()
export class LocalMfaAuthGuard extends AuthGuard("localMfa") {}
