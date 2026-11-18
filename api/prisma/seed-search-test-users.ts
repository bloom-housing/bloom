/*
  TEMPORARY helper for manually testing first + last name user search.
  Not meant to be committed.

  Seed:    npx ts-node prisma/seed-search-test-users.ts
  Cleanup: npx ts-node prisma/seed-search-test-users.ts --cleanup
*/
import { PrismaClient } from '@prisma/client';
import { userFactory } from './seed-helpers/user-factory';

const EMAIL_DOMAIN = 'search-test.example.com';

const people: { firstName: string; lastName: string }[] = [
  { firstName: 'Jane', lastName: 'Doe' },
  { firstName: 'Jane', lastName: 'Smith' },
  { firstName: 'John', lastName: 'Doe' },
  { firstName: 'John', lastName: 'Smith' },
  { firstName: 'Mary Jane', lastName: 'Watson' },
  { firstName: 'Anna', lastName: 'Johnson' },
  { firstName: 'Doris', lastName: 'Janeway' },
  { firstName: 'Smithy', lastName: 'Doeberg' },
];

const prisma = new PrismaClient();

const run = async () => {
  const removed = await prisma.userAccounts.deleteMany({
    where: { email: { endsWith: `@${EMAIL_DOMAIN}` } },
  });
  console.log(`Removed ${removed.count} existing search-test users`);

  if (process.argv.includes('--cleanup')) return;

  const jurisdictions = await prisma.jurisdictions.findMany({
    select: { id: true },
  });

  for (const person of people) {
    const email = `${person.firstName.replace(/\s+/g, '.')}.${
      person.lastName
    }@${EMAIL_DOMAIN}`.toLowerCase();
    await prisma.userAccounts.create({
      data: await userFactory({
        ...person,
        email,
        roles: { isPartner: true },
        confirmedAt: new Date(),
        acceptedTerms: true,
        jurisdictionIds: jurisdictions.map((j) => j.id),
      }),
    });
    console.log(`Created ${person.firstName} ${person.lastName} <${email}>`);
  }
};

run()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
