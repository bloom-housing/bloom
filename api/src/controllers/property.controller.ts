import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PermissionTypeDecorator } from 'src/decorators/permission-type.decorator';
import { PropertyService } from 'src/services/property.service';
@Controller('properties')
@ApiTags('properties')
@PermissionTypeDecorator('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}
}
