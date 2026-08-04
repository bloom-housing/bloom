import { BackgroundJobStatusEnum } from '@prisma/client';

export type BulkUploadJobNotification = {
  jobId: string;
  status: BackgroundJobStatusEnum;
  totalRecords?: number | null;
  errorMessage?: string | null;
  errorRow?: number | null;
  completedAt?: string | null;
};
