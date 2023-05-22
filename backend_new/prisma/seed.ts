import { PrismaClient } from '@prisma/client';
import { jurisdictionFactory } from './seed-helpers/jurisdiction-factory';
import { listingFactory } from './seed-helpers/listing-factory';

const prisma = new PrismaClient();
async function main() {
  const jurisdiction = await prisma.jurisdictions.create({
    data: jurisdictionFactory(0),
  });
  for (let i = 0; i < 5; i++) {
    await prisma.listings.create({
      data: listingFactory(i, jurisdiction.id),
    });
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
