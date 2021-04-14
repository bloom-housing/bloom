import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common"
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiTags } from "@nestjs/swagger"
import { ResourceType } from "../auth/resource_type.decorator"
import { OptionalAuthGuard } from "../auth/optional-auth.guard"
import { ApplicationsService } from "./applications.service"
import { ApplicationCreateDto, ApplicationDto } from "./dto/application.dto"
import { mapTo } from "../shared/mapTo"
import { defaultValidationPipeOptions } from "../shared/default-validation-pipe-options"
import { ResourceAction } from "../auth/resource_action.decorator"
import { authzActions } from "../auth/authz.service"
import { AuthzGuard } from "../auth/authz.guard"
import { ValidationsGroupsEnum } from "../shared/validations-groups.enum"
import { applicationPreferenceExtraModels } from "./entities/application-preferences.entity"

@Controller("applications")
@ApiTags("applications")
@ApiBearerAuth()
@ResourceType("application")
@UseGuards(OptionalAuthGuard, AuthzGuard)
@UsePipes(
  new ValidationPipe({
    ...defaultValidationPipeOptions,
    groups: [ValidationsGroupsEnum.default, ValidationsGroupsEnum.applicants],
  })
)
@ApiExtraModels(...applicationPreferenceExtraModels)
export class ApplicationsSubmissionController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post(`submit`)
  @ApiOperation({ summary: "Submit application", operationId: "submit" })
  @ResourceAction(authzActions.submit)
  async submit(@Body() applicationCreateDto: ApplicationCreateDto): Promise<ApplicationDto> {
    const application = await this.applicationsService.submit(applicationCreateDto)
    return mapTo(ApplicationDto, application)
  }
}
