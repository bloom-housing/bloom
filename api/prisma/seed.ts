import { parseArgs } from 'node:util';
import { env } from 'node:process';
import { PrismaService } from '../src/services/prisma.service';
import { jurisdictionFactory } from './seed-helpers/jurisdiction-factory';
import { stagingSeed } from './seed-staging';
import { devSeeding } from './seed-dev';
import { unitTypeFactoryAll } from './seed-helpers/unit-type-factory';
import { reservedCommunityTypeFactoryAll } from './seed-helpers/reserved-community-type-factory';

const options: { [name: string]: { type: 'string' | 'boolean' } } = {
  environment: { type: 'string' },
  jurisdictionName: { type: 'string' },
};

const prisma = new PrismaService();
async function main() {
  const {
    values: { environment, jurisdictionName },
  } = parseArgs({ options });
  const publicSiteBaseURL = env.DBSEED_PUBLIC_SITE_BASE_URL;

  switch (environment) {
    case 'production':
      // Setting up a production database we would just need the bare minimum such as jurisdiction
      const jurisdictionId = await prisma.jurisdictions.create({
        data: jurisdictionFactory(jurisdictionName as string, {
          publicSiteBaseURL: publicSiteBaseURL,
        }),
      });
      await unitTypeFactoryAll(prisma);
      await reservedCommunityTypeFactoryAll(jurisdictionId.id, prisma);
      break;
    case 'staging':
      // Staging setup should have realistic looking data with a preset list of listings
      // along with all of the required tables (ami, users, etc)
      stagingSeed(prisma, jurisdictionName as string, publicSiteBaseURL);
      break;
    case 'development':
    default:
      // Development is less realistic data, but can be more experimental and also should
      // be partially randomized so we cover all bases
      devSeeding(prisma, jurisdictionName as string);
      break;
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
