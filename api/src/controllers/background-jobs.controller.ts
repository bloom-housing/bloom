import { Controller } from '@nestjs/common';
import { BackgroundJobsService } from 'src/services/background-jobs.service';

@Controller('jobs')
export class BackgroundJobsController {
  constructor(private readonly backgroundJobsService: BackgroundJobsService) {}
}
