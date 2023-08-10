import {
  Body,
  Controller,
  Put,
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
import { UserUpdate } from '../dtos/users/user-update.dto';

@Controller('userProfile')
@ApiTags('userProfile')
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
@ApiExtraModels()
export class UserProfileController {
  constructor(private readonly userService: UserService) {}

  @Put(':id')
  @ApiOperation({ summary: 'Update profile user', operationId: 'update' })
  @ApiOkResponse({ type: User })
  async update(@Body() dto: UserUpdate): Promise<User> {
    return await this.userService.update(dto);
  }
}
