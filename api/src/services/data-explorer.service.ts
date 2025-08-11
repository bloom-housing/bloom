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

  //TODO: Add Unit tests for bloom api
  async getReportDataFastAPI(): Promise<DataExplorerReport> {
    try {
      const API_BASE_URL = process.env.FAST_API_URL;
      if (!process.env.FAST_API_KEY || !process.env.FAST_API_URL) {
        throw new BadRequestException(
          'FastAPI key or URL is not configured in environment variables',
        );
      }
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/secure/generate-report`,
        {
          headers: {
            'X-API-Key': process.env.FAST_API_KEY,
          },
        },
      );

      return response.data as DataExplorerReport;
    } catch (error) {
      console.error('Error returning data:', error);
      console.log('Falling back to default report data');

      // Return mock data for development/testing
      const now = new Date();
      return {
        id: 'mock-report-id',
        createdAt: now,
        updatedAt: now,
        totalProcessedApplications: 100,
        totalApplicants: 95,
        totalListings: 5,
        validResponse: true,
        kAnonScore: 10,
        products: {
          incomeHouseholdSizeCrossTab: {
            '1': {
              '0-30 AMI': 45,
              '31-50 AMI': 78,
              '51-80 AMI': 92,
              '81-120 AMI': 34,
            },
            '2': {
              '0-30 AMI': 67,
              '31-50 AMI': 89,
              '51-80 AMI': 112,
              '81-120 AMI': 56,
            },
            '3': {
              '0-30 AMI': 82,
              '31-50 AMI': 95,
              '51-80 AMI': 78,
              '81-120 AMI': 45,
            },
            '4+': {
              '0-30 AMI': 93,
              '31-50 AMI': 88,
              '51-80 AMI': 65,
              '81-120 AMI': 40,
            },
          },
          raceFrequencies: [
            { count: 120, percentage: 25.5, race: 'Asian' },
            { count: 85, percentage: 18.1, race: 'Black or African American' },
            { count: 200, percentage: 42.6, race: 'White' },
            { count: 65, percentage: 13.8, race: 'Other' },
          ],
          ethnicityFrequencies: [
            { count: 150, percentage: 31.9, ethnicity: 'Hispanic or Latino' },
            {
              count: 320,
              percentage: 68.1,
              ethnicity: 'Not Hispanic or Latino',
            },
          ],
          subsidyOrVoucherTypeFrequencies: [
            { count: 75, percentage: 16.0, subsidyType: 'Section 8' },
            { count: 25, percentage: 5.3, subsidyType: 'VASH' },
            { count: 370, percentage: 78.7, subsidyType: 'None' },
          ],
          accessibilityTypeFrequencies: [
            {
              count: 45,
              percentage: 9.6,
              accessibilityType: 'Wheelchair Accessible',
            },
            {
              count: 30,
              percentage: 6.4,
              accessibilityType: 'Hearing Impaired',
            },
            {
              count: 20,
              percentage: 4.3,
              accessibilityType: 'Vision Impaired',
            },
            { count: 375, percentage: 79.8, accessibilityType: 'None' },
          ],
          ageFrequencies: [
            { count: 85, percentage: 18.1, age: '18-24' },
            { count: 120, percentage: 25.5, age: '25-34' },
            { count: 110, percentage: 23.4, age: '35-44' },
            { count: 90, percentage: 19.1, age: '45-54' },
            { count: 65, percentage: 13.8, age: '55+' },
          ],
          residentialLocationFrequencies: [
            { count: 180, percentage: 38.3, location: 'Oakland' },
            { count: 120, percentage: 25.5, location: 'Berkeley' },
            { count: 95, percentage: 20.2, location: 'San Francisco' },
            { count: 75, percentage: 16.0, location: 'Other' },
          ],
          languageFrequencies: [
            { count: 350, percentage: 74.5, language: 'English' },
            { count: 85, percentage: 18.1, language: 'Spanish' },
            { count: 25, percentage: 5.3, language: 'Chinese' },
            { count: 10, percentage: 2.1, language: 'Other' },
          ],
        },
        reportErrors: [],
      } as DataExplorerReport;
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
