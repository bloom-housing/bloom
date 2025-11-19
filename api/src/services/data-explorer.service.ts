import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';

import { mapTo } from '../utilities/mapTo';

import { PermissionService } from './permission.service';
import { User } from '../dtos/users/user.dto';
import { permissionActions } from '../enums/permissions/permission-actions-enum';
import { DataExplorerParams } from '../dtos/applications/data-explorer/params/data-explorer-params.dto';
import { DataExplorerReport } from '../dtos/applications/data-explorer/products/data-explorer-report.dto';
import axios from 'axios';
/*
  this is the service for calling the FastAPI housing-reports endpoint
  this simply passes along the parameters to the FastAPI endpoint
  and returns the response from the FastAPI endpoint
  We place this call here so we can use the permission service to check if the user is allowed to access the data reports
*/
@Injectable()
export class DataExplorerService {
  constructor(private permissionService: PermissionService) {}

  /*
   this will call the FastAPI endpoint to generate a report
   and return the report data
   it will also check if the user has permission to access the report data
   if the user does not have permission, it will throw a ForbiddenException
   if the user is not authenticated, it will throw a ForbiddenException
  */
  async generateReport(
    params: DataExplorerParams,
    req: ExpressRequest,
  ): Promise<DataExplorerReport> {
    const user = mapTo(User, req['user']);
    if (!user) {
      throw new ForbiddenException();
    }

    await this.authorizeAction(
      user,
      permissionActions.read,
      params.jurisdictionId,
    );

    const reportData = await this.getReportDataFastAPI(params.filters);
    if (!reportData) {
      console.error('No report data returned from API');
      throw new NotFoundException('No report data found');
    }

    const mappedData = mapTo(DataExplorerReport, reportData);

    // Fix: class-transformer strips out complex nested objects with dynamic keys
    // Manually preserve the incomeHouseholdSizeCrossTab data
    if (
      reportData.products?.incomeHouseholdSizeCrossTab &&
      mappedData.products
    ) {
      mappedData.products.incomeHouseholdSizeCrossTab =
        reportData.products.incomeHouseholdSizeCrossTab;
    }

    return mappedData;
  }

  async getReportDataFastAPI(filters?: any): Promise<DataExplorerReport> {
    try {
      const API_BASE_URL = process.env.FAST_API_URL;
      if (!process.env.FAST_API_KEY || !process.env.FAST_API_URL) {
        throw new BadRequestException(
          'FastAPI key or URL is not configured in environment variables',
        );
      }
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/secure/generate-report`,
        { filters: filters || {} }, // Pass filters in request body
        {
          headers: {
            'X-API-Key': process.env.FAST_API_KEY,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data as DataExplorerReport;
    } catch (error) {
      console.error('Error fetching report data from FastAPI:', error);
      throw new NotFoundException('No report data found');
    }
  }

  async authorizeAction(
    user: User,
    action: permissionActions,
    jurisdictionId: string,
  ): Promise<void> {
    await this.permissionService.canOrThrow(user, 'application', action, {
      jurisdictionId: jurisdictionId,
    });
  }
}
