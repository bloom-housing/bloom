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
import { ResourceType } from "../../auth/decorators/resource-type.decorator"
import { User } from "../../auth/entities/user.entity"
import { AuthzGuard } from "../../auth/guards/authz.guard"
import { OptionalAuthGuard } from "../../auth/guards/optional-auth.guard"
import { AuthContext } from "../../auth/types/auth-context"
import { defaultValidationPipeOptions } from "../../shared/default-validation-pipe-options"
import { StatusDto } from "../../shared/dto/status.dto"
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
      throw new HttpException("Only administrators can send SMS messages.", HttpStatus.FORBIDDEN)
    }
    return await this.smsService.send(dto)
  }
}
