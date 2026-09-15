import { HttpService } from '@nestjs/axios';
import { BadRequestException, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { BrandDTO } from '../dtos/jurisdictions/brand.dto';

const FONT_TIMEOUT_MS = 5000;

const logger = new Logger('FontAvailability');

export const assertFontIsAvailable = async (
  http: HttpService,
  brand?: BrandDTO | null,
): Promise<void> => {
  if (!brand?.fontUrl || !brand.fontFamily) return;

  let css: string;
  try {
    const response = await firstValueFrom(
      http.get<string>(brand.fontUrl, {
        timeout: FONT_TIMEOUT_MS,
        responseType: 'text',
      }),
    );
    css = String(response.data);
  } catch (error) {
    if ((error as AxiosError).response) {
      throw new BadRequestException(
        `${brand.fontUrl} does not serve a font: ${
          (error as AxiosError).response.status
        }`,
      );
    }

    logger.warn(
      `could not reach ${brand.fontUrl} to confirm ${brand.fontFamily}: ${error.message}`,
    );
    return;
  }

  if (!css.includes(`font-family: '${brand.fontFamily}'`)) {
    throw new BadRequestException(
      `${brand.fontUrl} does not serve the font family ${brand.fontFamily}`,
    );
  }
};
