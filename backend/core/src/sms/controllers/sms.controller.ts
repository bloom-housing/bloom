import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger"
import { ResourceType } from "src/auth/decorators/resource-type.decorator"
import { User } from "src/auth/entities/user.entity"
import { AuthzGuard } from "src/auth/guards/authz.guard"
import { OptionalAuthGuard } from "src/auth/guards/optional-auth.guard"
import { AuthContext } from "src/auth/types/auth-context"
import { defaultValidationPipeOptions } from "src/shared/default-validation-pipe-options"
import { StatusDto } from "src/shared/dto/status.dto"
import { SmsDto } from "../dto/sms.dto"
import { SmsService } from "../services/sms.service"

@Controller("sms")
@ApiBearerAuth()
@ApiTags("sms")
@ResourceType("user")
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post()
  @UseGuards(OptionalAuthGuard, AuthzGuard)
  @ApiOperation({ summary: "Send an SMS", operationId: "send-sms" })
  async send(@Request() req, @Body() dto: SmsDto): Promise<StatusDto> {
    // Only admins are allowed to send SMS messages.
    if (!new AuthContext(req.user as User).user.roles?.isAdmin) {
      throw new HttpException("Only administrators can sent SMS messages.", HttpStatus.FORBIDDEN)
    }
    return await this.smsService.send(dto)
  }
}
