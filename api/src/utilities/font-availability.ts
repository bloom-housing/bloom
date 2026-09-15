import { HttpService } from '@nestjs/axios';
import { BadRequestException, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { BrandDTO, FONT_HOSTS } from '../dtos/jurisdictions/brand.dto';

const FONT_TIMEOUT_MS = 5000;

const logger = new Logger('FontAvailability');

const usableFontUrl = (value: string): boolean => {
  try {
    const url = new URL(value);
    return (
      url.protocol === 'https:' &&
      FONT_HOSTS.includes(url.hostname) &&
      !url.port &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
};

export const assertFontIsAvailable = async (
  http: HttpService,
  brand?: BrandDTO | null,
): Promise<void> => {
  const families = [brand?.fontFamily, brand?.headingFontFamily].filter(
    (family): family is string => !!family,
  );
  if (!brand?.fontUrl && !families.length) return;

  if (!brand?.fontUrl || !families.length) {
    throw new BadRequestException(
      'a brand font needs both a fontUrl and a fontFamily',
    );
  }

  if (!usableFontUrl(brand.fontUrl)) {
    throw new BadRequestException(
      `${brand.fontUrl} is not a usable google fonts url`,
    );
  }

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
    const status = (error as AxiosError).response?.status;
    if (status && status < 500) {
      throw new BadRequestException(
        `${brand.fontUrl} does not serve a font: ${status}`,
      );
    }

    logger.warn(
      `could not reach ${brand.fontUrl} to confirm ${families.join(
        ' and ',
      )}: ${String((error as Error)?.message ?? error)}`,
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
