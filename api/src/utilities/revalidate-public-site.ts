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
// own rendered pages. A single post to publicUrl would leave the others stale. Each task also
// registers an address under the discovery name, which gives one post per instance.
const instanceOrigins = async (
  publicUrl?: string | null,
): Promise<string[]> => {
  const discoveryName = process.env.PUBLIC_SITE_DISCOVERY_NAME;
  if (discoveryName) {
    const addresses = await dns.resolve4(discoveryName);
    return addresses.map((address) => `http://${address}:${DISCOVERY_PORT}`);
  }

  const trimmed = normalizeOrigin(publicUrl);
  return trimmed ? [trimmed] : [];
};

const normalizeOrigin = (publicUrl?: string | null): string | undefined =>
  publicUrl?.trim().replace(/\/+$/, '') || undefined;

export const revalidatePublicSite = async (
  http: HttpService,
  publicUrl?: string | null,
): Promise<void> => {
  const passkey = process.env.API_PASS_KEY;
  if (!passkey) {
    logger.warn(
      'API_PASS_KEY is not set. The public site keeps the edit until its cache expires',
    );
    return;
  }

  let origins: string[];
  try {
    origins = await instanceOrigins(publicUrl);
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
              headers: { passkey },
            },
          ),
        );
      } catch (error) {
        logger.warn(`could not revalidate ${origin}: ${describe(error)}`);
      }
    }),
  );
};

export const revalidatePublicSites = async (
  http: HttpService,
  publicUrls: (string | null | undefined)[],
): Promise<void> => {
  if (process.env.PUBLIC_SITE_DISCOVERY_NAME) {
    await revalidatePublicSite(http);
    return;
  }

  const distinct = [...new Set(publicUrls.map(normalizeOrigin))].filter(
    (origin): origin is string => !!origin,
  );
  await Promise.all(
    distinct.map((origin) => revalidatePublicSite(http, origin)),
  );
};
