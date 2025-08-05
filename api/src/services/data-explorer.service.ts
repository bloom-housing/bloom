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
import { DataExplorerParams } from '../dtos/applications/data-explorer-params.dto';
import { DataExplorerReport } from '../dtos/applications/data-explorer-report.dto';
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

    const reportData = await this.getReportDataFastAPI();
    if (!reportData) {
      console.error('No report data returned from API');
      throw new NotFoundException('No report data found');
    }
    return mapTo(DataExplorerReport, reportData);
  }

  //Unit tests for bloom api
  async getReportDataFastAPI(): Promise<DataExplorerReport> {
    try {
      const API_BASE_URL = 'http://127.0.0.1:8000';
      //"x-forwarded-for": req.headers["x-forwarded-for"] || "",

      // DO an API Key Header check, allow list, custom header
      // passkey: process.env.API_PASS_KEY,
      // Check for header with ip
      const response = await axios.get(`${API_BASE_URL}/generate-report`);
      return response.data as DataExplorerReport;
    } catch (error) {
      console.error('Error returning data:', error);
      console.log('Falling back to default report data');
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
