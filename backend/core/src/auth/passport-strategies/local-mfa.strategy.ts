import { Strategy } from "passport-custom"
import { PassportStrategy } from "@nestjs/passport"
import { Injectable, UnauthorizedException, ValidationPipe } from "@nestjs/common"
import { User } from "../entities/user.entity"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { PasswordService } from "../services/password.service"
import { defaultValidationPipeOptions } from "../../shared/default-validation-pipe-options"
import { LoginDto } from "../dto/login.dto"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class LocalMfaStrategy extends PassportStrategy(Strategy, "localMfa") {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly passwordService: PasswordService,
    private readonly configService: ConfigService
  ) {
    super()
  }
  async validate(req: Request): Promise<any> {
    const validationPipe = new ValidationPipe(defaultValidationPipeOptions)
    const loginDto: LoginDto = await validationPipe.transform(req.body, {
      type: "body",
      metatype: LoginDto,
    })

    const user = await this.userRepository.findOne({
      where: { email: loginDto.email.toLowerCase() },
      relations: ["leasingAgentInListings"],
    })

    if (!user) {
      throw new UnauthorizedException()
    }

    const validPassword = await this.passwordService.verifyUserPassword(user, loginDto.password)
    if (!validPassword || !user.confirmedAt) {
      throw new UnauthorizedException()
    }

    if (user.mfaEnabled) {
      if (!loginDto.mfaCode || !user.mfaCode || !user.mfaCodeUpdatedAt) {
        throw new UnauthorizedException()
      }
      if (
        new Date(
          user.mfaCodeUpdatedAt.getTime() + this.configService.get<number>("MFA_CODE_VALID_MS")
        ) < new Date() ||
        user.mfaCode !== loginDto.mfaCode
      ) {
        throw new UnauthorizedException()
      }
      user.mfaCode = null
      user.mfaCodeUpdatedAt = new Date()
      await this.userRepository.save(user)
    }

    return user
  }
}
