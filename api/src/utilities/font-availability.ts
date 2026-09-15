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
  const families = [brand?.fontFamily, brand?.headingFontFamily].filter(
    (family): family is string => !!family,
  );
  if (!brand?.fontUrl || !families.length) return;

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
      `could not reach ${brand.fontUrl} to confirm ${families.join(' and ')}: ${
        error.message
      }`,
    );
    return;
  }

  const missing = families.filter(
    (family) => !css.includes(`font-family: '${family}'`),
  );
  if (missing.length) {
    throw new BadRequestException(
      `${brand.fontUrl} does not serve the font family ${missing.join(' or ')}`,
    );
  }
};
