import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
@Injectable()
export class PropertyService {
  constructor(private prisma: PrismaService) {}
}
