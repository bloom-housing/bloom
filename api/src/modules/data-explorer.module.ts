import { Module } from '@nestjs/common';
import { PermissionModule } from './permission.module';
import { DataExplorerController } from 'src/controllers/data-explorer.controller';
import { DataExplorerService } from 'src/services/data-explorer.service';

@Module({
  imports: [PermissionModule],
  controllers: [DataExplorerController],
  providers: [DataExplorerService],
  exports: [DataExplorerService],
})
export class DataExplorerModule {}
