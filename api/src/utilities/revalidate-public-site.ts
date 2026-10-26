import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';
import { promises as dns } from 'dns';
import { firstValueFrom } from 'rxjs';

const REVALIDATE_TIMEOUT_MS = 5000;

// The container port in infra/tofu_importable_modules/bloom_deployment/ecs_site_public_service.tf.
const DISCOVERY_PORT = 3000;

const logger = new Logger('RevalidatePublicSite');

const describe = (error: unknown): string =>
  String((error as Error)?.message ?? error);

// AWS runs several public site instances behind one load balancer, and each instance caches its
// own rendered pages. Each task registers an address under the discovery name, which gives one post
// per instance. The target comes only from the environment, since the secret is sent to it.
const instanceOrigins = async (): Promise<string[]> => {
  const discoveryName = process.env.PUBLIC_SITE_DISCOVERY_NAME;
  if (discoveryName) {
    const addresses = await dns.resolve4(discoveryName);
    return addresses.map((address) => `http://${address}:${DISCOVERY_PORT}`);
  }

  const configured = (process.env.PUBLIC_SITE_REVALIDATE_URLS ?? '')
    .split(',')
    .map(normalizeOrigin)
    .filter((origin): origin is string => !!origin);
  return [...new Set(configured)];
};

const usableOrigin = (value: string): boolean => {
  try {
    const url = new URL(value);
    return (
      (url.protocol === 'http:' || url.protocol === 'https:') &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
};

const normalizeOrigin = (value: string): string | undefined => {
  const trimmed = value.trim().replace(/\/+$/, '');
  if (!trimmed) return undefined;

  if (!usableOrigin(trimmed)) {
    logger.warn(`${trimmed} is not a usable public site url`);
    return undefined;
  }
  return trimmed;
};

export const revalidatePublicSite = async (
  http: HttpService,
): Promise<void> => {
  const secret = process.env.PUBLIC_SITE_REVALIDATE_SECRET;
  if (!secret) {
    logger.warn(
      'PUBLIC_SITE_REVALIDATE_SECRET is not set. The public site keeps the edit until its cache expires',
    );
    return;
  }

  let origins: string[];
  try {
    origins = await instanceOrigins();
  } catch (error) {
    logger.warn(
      `could not resolve ${process.env.PUBLIC_SITE_DISCOVERY_NAME}: ${describe(
        error,
      )}`,
    );
    return;
  }

  await Promise.all(
    origins.map(async (origin) => {
      try {
        await firstValueFrom(
          http.post(
            `${origin}/api/revalidate`,
            {},
            {
              timeout: REVALIDATE_TIMEOUT_MS,
              headers: { 'revalidate-secret': secret },
            },
          ),
        );
      } catch (error) {
        logger.warn(`could not revalidate ${origin}: ${describe(error)}`);
      }
    }),
  );
};
