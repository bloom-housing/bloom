import { Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PermissionService } from './permission.service';

/**
  this is the service for external listings
  it handles all the backend's business logic for exposing and ingesting listings
*/
@Injectable()
export class ExternalListingService {
  constructor(
    private prisma: PrismaService,
    private permissionService: PermissionService,
    @Inject(Logger)
    private logger = new Logger(ExternalListingService.name),
  ) {}
}
