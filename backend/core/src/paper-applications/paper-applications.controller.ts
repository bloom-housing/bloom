import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger"
import { DefaultAuthGuard } from "../auth/guards/default.guard"
import { AuthzGuard } from "../auth/guards/authz.guard"
import { ResourceType } from "../auth/decorators/resource-type.decorator"
import { mapTo } from "../shared/mapTo"
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common"
import { defaultValidationPipeOptions } from "../shared/default-validation-pipe-options"
import {
  PaperApplicationCreateDto,
  PaperApplicationDto,
  PaperApplicationUpdateDto,
} from "./dto/paper-application.dto"
import { PaperApplicationsService } from "./paper-applications.service"
import { IdDto } from "../shared/dto/id.dto"

@Controller("paperApplications")
@ApiTags("paperApplications")
@ApiBearerAuth()
@ResourceType("paperApplication")
@UseGuards(DefaultAuthGuard, AuthzGuard)
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
export class PaperApplicationsController {
  constructor(private readonly paperApplicationsService: PaperApplicationsService) {}

  @Get()
  @ApiOperation({ summary: "List paperApplications", operationId: "list" })
  async list(): Promise<PaperApplicationDto[]> {
    return mapTo(PaperApplicationDto, await this.paperApplicationsService.list())
  }

  @Post()
  @ApiOperation({ summary: "Create paperApplication", operationId: "create" })
  async create(@Body() paperApplication: PaperApplicationCreateDto): Promise<PaperApplicationDto> {
    return mapTo(PaperApplicationDto, await this.paperApplicationsService.create(paperApplication))
  }

  @Put(`:paperApplicationId`)
  @ApiOperation({ summary: "Update paperApplication", operationId: "update" })
  async update(@Body() paperApplication: PaperApplicationUpdateDto): Promise<PaperApplicationDto> {
    return mapTo(PaperApplicationDto, await this.paperApplicationsService.update(paperApplication))
  }

  @Get(`:paperApplicationId`)
  @ApiOperation({ summary: "Get paperApplication by id", operationId: "retrieve" })
  async retrieve(
    @Param("paperApplicationId") paperApplicationId: string
  ): Promise<PaperApplicationDto> {
    return mapTo(
      PaperApplicationDto,
      await this.paperApplicationsService.findOne({ where: { id: paperApplicationId } })
    )
  }

  @Delete()
  @ApiOperation({ summary: "Delete paperApplication by id", operationId: "delete" })
  async delete(@Body() dto: IdDto): Promise<void> {
    return await this.paperApplicationsService.delete(dto.id)
  }
}
