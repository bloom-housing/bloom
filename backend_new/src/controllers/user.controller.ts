import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  Request,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { User } from '../dtos/users/user.dto';
import { defaultValidationPipeOptions } from '../utilities/default-validation-pipe-options';
import { IdDTO } from '../dtos/shared/id.dto';
import { mapTo } from '../utilities/mapTo';
import { PaginatedUserDto } from '../dtos/users/paginated-user.dto';
import { UserQueryParams } from '../dtos/users/user-query-param.dto';
import { Request as ExpressRequest } from 'express';

@Controller('user')
@ApiTags('user')
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
@ApiExtraModels(IdDTO)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  profile(@Request() req: ExpressRequest): User {
    return mapTo(User, req.user);
  }

  @Get('/list')
  @UsePipes(new ValidationPipe(defaultValidationPipeOptions))
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: PaginatedUserDto })
  @ApiOperation({
    summary: 'Get a paginated set of users',
    operationId: 'list',
  })
  async list(
    @Request() req: ExpressRequest,
    @Query() queryParams: UserQueryParams,
  ): Promise<PaginatedUserDto> {
    return await this.userService.list(queryParams, mapTo(User, req.user));
  }

  @Get(`:id`)
  @ApiOperation({
    summary: 'Get user by id',
    operationId: 'retrieve',
  })
  @ApiOkResponse({ type: User })
  async retrieve(
    @Param('id', new ParseUUIDPipe({ version: '4' })) userId: string,
  ): Promise<User> {
    return this.userService.findOne(userId);
  }
}
