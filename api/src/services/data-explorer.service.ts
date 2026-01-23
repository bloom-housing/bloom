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
import { GenerateInsightParams } from '../dtos/applications/data-explorer/generate-insight-params.dto';
import { GenerateInsightResponse } from '../dtos/applications/data-explorer/generate-insight-response.dto';
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

    const reportData = await this.getReportDataFastAPI(params);
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

    // Preserve all frequency arrays that might get stripped by class-transformer
    if (reportData.products && mappedData.products) {
      mappedData.products.raceFrequencies = reportData.products.raceFrequencies;
      mappedData.products.ethnicityFrequencies =
        reportData.products.ethnicityFrequencies;
      mappedData.products.subsidyOrVoucherTypeFrequencies =
        reportData.products.subsidyOrVoucherTypeFrequencies;
      mappedData.products.accessibilityTypeFrequencies =
        reportData.products.accessibilityTypeFrequencies;
      mappedData.products.ageFrequencies = reportData.products.ageFrequencies;
      mappedData.products.residentialLocationFrequencies =
        reportData.products.residentialLocationFrequencies;
      mappedData.products.languageFrequencies =
        reportData.products.languageFrequencies;
    }

    // Ensure isSufficient matches validResponse
    if (mappedData.validResponse !== undefined) {
      mappedData.isSufficient = mappedData.validResponse;
    }

    return mappedData;
  }

  async getReportDataFastAPI(
    params?: DataExplorerParams,
  ): Promise<DataExplorerReport> {
    try {
      const API_BASE_URL = process.env.FAST_API_URL;
      if (!process.env.FAST_API_KEY || !process.env.FAST_API_URL) {
        throw new BadRequestException(
          'FastAPI key or URL is not configured in environment variables',
        );
      }

      // Build filter object from params (exclude jurisdictionId and userId)
      // The params already have the nested structure from the DTO
      let filters = null;
      if (params) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { jurisdictionId, userId, ...filterParams } = params;

        // Only build filters if there are actual filter parameters
        if (Object.keys(filterParams).length > 0) {
          filters = {
            date_range: filterParams.date_range || null,
            household: filterParams.household || null,
            demographics: filterParams.demographics || null,
            geography: filterParams.geography || null,
          };
        }
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/v1/secure/generate-report`,
        filters,
        {
          headers: {
            'X-API-Key': process.env.FAST_API_KEY,
          },
        },
      );

      // Map FastAPI response to NestJS DataExplorerReport structure
      const fastApiData = response.data;

      // Helper to extract value array from metric objects
      const extractMetricValue = (metric: any): any[] => {
        if (!metric) return [];
        // If metric has a 'value' property, return it; otherwise return the metric itself
        return metric.value || metric;
      };

      // Transform the response to match our DTO structure
      const transformedData = {
        dateRange: fastApiData.date_range || 'N/A',
        totalProcessedApplications:
          fastApiData.total_processed_applications || 0,
        totalApplicants: fastApiData.total_applicants,
        totalListings: fastApiData.total_listings,
        validResponse: fastApiData.is_sufficient || false,
        isSufficient: fastApiData.is_sufficient || false,
        kAnonScore: fastApiData.k_anonymity_score || 0,
        reportErrors: fastApiData.report_errors || [],
        products: {
          // Extract the value from the cross-tab metric
          incomeHouseholdSizeCrossTab:
            fastApiData.metrics?.income_household_size_cross_tab?.value ||
            fastApiData.metrics?.income_household_size_cross_tab ||
            {},
          // Use race_frequency_inclusive by default (could also use exclusive)
          raceFrequencies: extractMetricValue(
            fastApiData.metrics?.race_frequency_inclusive,
          ),
          ethnicityFrequencies: extractMetricValue(
            fastApiData.metrics?.ethnicity_frequency,
          ),
          subsidyOrVoucherTypeFrequencies: extractMetricValue(
            fastApiData.metrics?.voucher_usage_frequency,
          ),
          accessibilityTypeFrequencies: extractMetricValue(
            fastApiData.metrics?.accessibility_frequency,
          ),
          ageFrequencies: extractMetricValue(
            fastApiData.metrics?.age_frequency,
          ),
          residentialLocationFrequencies: extractMetricValue(
            fastApiData.metrics?.city_frequency,
          ),
          languageFrequencies: extractMetricValue(
            fastApiData.metrics?.language_frequency,
          ),
        },
      };

      return transformedData as DataExplorerReport;
    } catch (error) {
      console.error('Error fetching report data from FastAPI:', error);
      if (axios.isAxiosError(error)) {
        // Log detailed validation errors if it's a 422
        if (error.response?.status === 422 && error.response?.data?.detail) {
          console.error(
            'FastAPI validation errors:',
            JSON.stringify(error.response.data.detail, null, 2),
          );
        }
      }
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

  /*
   this will call the FastAPI endpoint to generate an AI insight
   and return the markdown response
   it will also check if the user has permission to access the data
   if the user does not have permission, it will throw a ForbiddenException
   if the user is not authenticated, it will throw a ForbiddenException
  */
  async generateInsight(
    params: GenerateInsightParams,
    req: ExpressRequest,
  ): Promise<GenerateInsightResponse> {
    const user = mapTo(User, req['user']);
    if (!user) {
      throw new ForbiddenException();
    }

    if (params.jurisdictionId) {
      await this.authorizeAction(
        user,
        permissionActions.read,
        params.jurisdictionId,
      );
    }

    const insightData = await this.getInsightFromFastAPI(params);
    if (!insightData) {
      console.error('No insight data returned from API');
      throw new NotFoundException('No insight data found');
    }

    return mapTo(GenerateInsightResponse, insightData);
  }

  async getInsightFromFastAPI(
    params: GenerateInsightParams,
  ): Promise<GenerateInsightResponse> {
    try {
      const API_BASE_URL = process.env.FAST_API_URL;
      if (!process.env.FAST_API_KEY || !process.env.FAST_API_URL) {
        throw new BadRequestException(
          'FastAPI key or URL is not configured in environment variables',
        );
      }
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/secure/generate-insight`,
        {
          data: params.data,
        },
        {
          headers: {
            'X-API-Key': process.env.FAST_API_KEY,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data as GenerateInsightResponse;
    } catch (error) {
      console.error('Error calling FastAPI generate-insight:', error);
      throw new NotFoundException('Failed to generate insight');
    }
  }
}
