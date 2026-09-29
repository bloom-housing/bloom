import { ExecutionContext } from '@nestjs/common';
import { ThrottleGuard } from '../../../src/guards/throttler.guard';

/*
  shouldSkip and getTracker are protected, so this reaches them the way Nest does rather than
  through a public surface.
*/
type Reachable = {
  shouldSkip: (context: ExecutionContext) => Promise<boolean>;
  getTracker: (req: Record<string, unknown>) => Promise<string>;
};

const contextWith = (headers: Record<string, unknown>): ExecutionContext =>
  ({
    switchToHttp: () => ({
      getRequest: () => ({ headers, ips: [], ip: '10.0.0.1' }),
      getResponse: () => ({}),
    }),
  } as unknown as ExecutionContext);

describe('ThrottleGuard', () => {
  const guard = new ThrottleGuard(
    { throttlers: [] } as never,
    {} as never,
    {} as never,
  );
  const reachable = guard as unknown as Reachable;

  beforeEach(() => {
    process.env.API_PASS_KEY = 'a-secret';
  });

  afterEach(() => {
    delete process.env.API_PASS_KEY;
  });

  // One content save rebuilds every page, so these reads arrive in a burst that would otherwise
  // spend the whole per-IP budget and leave the site unable to read its own data.
  it('skips a first-party read made outside a visitor request', async () => {
    expect(
      await reachable.shouldSkip(contextWith({ passkey: 'a-secret' })),
    ).toBe(true);
  });

  it('limits a read made for a visitor, even with the passkey', async () => {
    const forVisitor = {
      passkey: 'a-secret',
      'x-forwarded-for': '203.0.113.9',
    };

    expect(await reachable.shouldSkip(contextWith(forVisitor))).toBe(false);
  });

  it.each([
    ['no passkey', {}],
    ['a wrong passkey', { passkey: 'b-secret' }],
    ['a passkey that is not a string', { passkey: ['a-secret'] }],
  ])('limits a call with %s', async (_label, headers) => {
    expect(await reachable.shouldSkip(contextWith(headers))).toBe(false);
  });

  it('limits everything when no key is configured', async () => {
    delete process.env.API_PASS_KEY;

    expect(
      await reachable.shouldSkip(contextWith({ passkey: 'a-secret' })),
    ).toBe(false);
  });

  it('tracks a visitor by the forwarded address rather than the proxy', async () => {
    const tracker = await reachable.getTracker({
      headers: { 'x-forwarded-for': '203.0.113.9, 10.0.0.1' },
      ips: [],
      ip: '10.0.0.1',
    });

    expect(tracker).toEqual('203.0.113.9');
  });
});
