import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { Request as ExpressRequest } from 'express';
import { ScriptRunnerService } from '../../../src/services/script-runner.service';
import { PrismaService } from '../../../src/services/prisma.service';
import { User } from '../../../src/dtos/users/user.dto';
import { AppModule } from '../../../src/modules/app.module';
import { EmailService } from '../../../src/services/email.service';

describe('Testing script runner service', () => {
  let service: ScriptRunnerService;
  let prisma: PrismaService;

  const testEmailService = {
    /* eslint-disable @typescript-eslint/no-empty-function */
    applicationScriptRunner: async () => {},
  };

  const mockApplicationScriptRunner = jest.spyOn(
    testEmailService,
    'applicationScriptRunner',
  );

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(EmailService)
      .useValue(testEmailService)
      .compile();

    service = module.get<ScriptRunnerService>(ScriptRunnerService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should transfer data', async () => {
    prisma.scriptRuns.findUnique = jest.fn().mockResolvedValue(null);
    prisma.scriptRuns.create = jest.fn().mockResolvedValue(null);
    prisma.scriptRuns.update = jest.fn().mockResolvedValue(null);

    const id = randomUUID();
    const scriptName = 'data transfer';

    const res = await service.dataTransfer(
      {
        user: {
          id,
        } as unknown as User,
      } as unknown as ExpressRequest,
      {
        connectionString: process.env.TEST_CONNECTION_STRING,
      },
    );

    expect(res.success).toBe(true);

    expect(prisma.scriptRuns.findUnique).toHaveBeenCalledWith({
      where: {
        scriptName,
      },
    });
    expect(prisma.scriptRuns.create).toHaveBeenCalledWith({
      data: {
        scriptName,
        triggeringUser: id,
      },
    });
    expect(prisma.scriptRuns.update).toHaveBeenCalledWith({
      data: {
        didScriptRun: true,
        triggeringUser: id,
      },
      where: {
        scriptName,
      },
    });
  });

  it('should bulk resend application confirmations', async () => {
    const id = randomUUID();
    const scriptName = 'bulk application resend';
    const listingId = randomUUID();
    const jurisdictionId = randomUUID();
    const applicationId = randomUUID();

    prisma.scriptRuns.findUnique = jest.fn().mockResolvedValue(null);
    prisma.scriptRuns.create = jest.fn().mockResolvedValue(null);
    prisma.scriptRuns.update = jest.fn().mockResolvedValue(null);
    prisma.listings.findUnique = jest.fn().mockResolvedValue({
      id: listingId,
      jurisdictions: {
        id: jurisdictionId,
      },
    });
    prisma.applications.findMany = jest.fn().mockResolvedValue([
      {
        id: applicationId,
        language: 'en',
        confirmationCode: 'conf code',
        applicant: {
          id: randomUUID(),
          emailAddress: 'example email address',
          firstName: 'example first name',
          middleName: 'example middle name',
          lastName: 'example last name',
        },
      },
    ]);

    const res = await service.bulkApplicationResend(
      {
        user: {
          id,
        } as unknown as User,
      } as unknown as ExpressRequest,
      {
        listingId,
      },
    );

    expect(res.success).toBe(true);

    expect(prisma.scriptRuns.findUnique).toHaveBeenCalledWith({
      where: {
        scriptName,
      },
    });
    expect(prisma.scriptRuns.create).toHaveBeenCalledWith({
      data: {
        scriptName,
        triggeringUser: id,
      },
    });
    expect(prisma.scriptRuns.update).toHaveBeenCalledWith({
      data: {
        didScriptRun: true,
        triggeringUser: id,
      },
      where: {
        scriptName,
      },
    });
    expect(prisma.listings.findUnique).toHaveBeenCalledWith({
      select: {
        id: true,
        jurisdictions: {
          select: {
            id: true,
          },
        },
      },
      where: {
        id: listingId,
      },
    });
    expect(prisma.applications.findMany).toHaveBeenCalledWith({
      select: {
        id: true,
        language: true,
        confirmationCode: true,
        applicant: {
          select: {
            id: true,
            emailAddress: true,
            firstName: true,
            middleName: true,
            lastName: true,
          },
        },
      },
      where: {
        listingId: listingId,
        deletedAt: null,
        applicant: {
          emailAddress: {
            not: null,
          },
        },
      },
    });
    expect(mockApplicationScriptRunner).toHaveBeenCalledWith(
      {
        id: applicationId,
        language: 'en',
        confirmationCode: 'conf code',
        applicant: {
          id: expect.anything(),
          emailAddress: 'example email address',
          firstName: 'example first name',
          middleName: 'example middle name',
          lastName: 'example last name',
        },
      },
      { id: jurisdictionId },
    );
  });

  // | ---------- HELPER TESTS BELOW ---------- | //
  it('should mark script run as started if no script run present in db', async () => {
    prisma.scriptRuns.findUnique = jest.fn().mockResolvedValue(null);
    prisma.scriptRuns.create = jest.fn().mockResolvedValue(null);

    const id = randomUUID();
    const scriptName = 'new run attempt';

    await service.markScriptAsRunStart(scriptName, {
      id,
    } as unknown as User);

    expect(prisma.scriptRuns.findUnique).toHaveBeenCalledWith({
      where: {
        scriptName,
      },
    });
    expect(prisma.scriptRuns.create).toHaveBeenCalledWith({
      data: {
        scriptName,
        triggeringUser: id,
      },
    });
  });

  it('should error if script run is in progress or failed', async () => {
    prisma.scriptRuns.findUnique = jest.fn().mockResolvedValue({
      id: randomUUID(),
      didScriptRun: false,
    });
    prisma.scriptRuns.create = jest.fn().mockResolvedValue(null);

    const id = randomUUID();
    const scriptName = 'new run attempt 2';

    await expect(
      async () =>
        await service.markScriptAsRunStart(scriptName, {
          id,
        } as unknown as User),
    ).rejects.toThrowError(
      `${scriptName} has an attempted run and it failed, or is in progress. If it failed, please delete the db entry and try again`,
    );

    expect(prisma.scriptRuns.findUnique).toHaveBeenCalledWith({
      where: {
        scriptName,
      },
    });
    expect(prisma.scriptRuns.create).not.toHaveBeenCalled();
  });

  it('should error if script run already succeeded', async () => {
    prisma.scriptRuns.findUnique = jest.fn().mockResolvedValue({
      id: randomUUID(),
      didScriptRun: true,
    });
    prisma.scriptRuns.create = jest.fn().mockResolvedValue(null);

    const id = randomUUID();
    const scriptName = 'new run attempt 3';

    await expect(
      async () =>
        await service.markScriptAsRunStart(scriptName, {
          id,
        } as unknown as User),
    ).rejects.toThrowError(`${scriptName} has already been run and succeeded`);

    expect(prisma.scriptRuns.findUnique).toHaveBeenCalledWith({
      where: {
        scriptName,
      },
    });
    expect(prisma.scriptRuns.create).not.toHaveBeenCalled();
  });

  it('should mark script run as started if no script run present in db', async () => {
    prisma.scriptRuns.update = jest.fn().mockResolvedValue(null);

    const id = randomUUID();
    const scriptName = 'new run attempt 4';

    await service.markScriptAsComplete(scriptName, {
      id,
    } as unknown as User);

    expect(prisma.scriptRuns.update).toHaveBeenCalledWith({
      data: {
        didScriptRun: true,
        triggeringUser: id,
      },
      where: {
        scriptName,
      },
    });
  });
});
