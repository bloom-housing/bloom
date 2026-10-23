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
    process.env.PUBLIC_SITE_REVALIDATE_SECRET = 'a-secret';
    process.env.API_PASS_KEY = 'api-passkey';
  });

  afterEach(() => {
    delete process.env.PUBLIC_SITE_REVALIDATE_SECRET;
    delete process.env.API_PASS_KEY;
  });

  // One content save rebuilds every page, so these reads arrive in a burst that would otherwise
  // spend the whole per-IP budget and leave the site unable to read its own data.
  it('skips a read that has the revalidate secret', async () => {
    expect(
      await reachable.shouldSkip(
        contextWith({ 'revalidate-secret': 'a-secret' }),
      ),
    ).toBe(true);
  });

  // The listing page's own read sends only the passkey, so a visitor varying the listing path is
  // still limited.
  it('limits a read that has only the api passkey', async () => {
    expect(
      await reachable.shouldSkip(contextWith({ passkey: 'api-passkey' })),
    ).toBe(false);
  });

  it.each([
    ['no secret', {}],
    ['a wrong secret', { 'revalidate-secret': 'b-secret' }],
    ['a secret that is not a string', { 'revalidate-secret': ['a-secret'] }],
  ])('limits a call with %s', async (_label, headers) => {
    expect(await reachable.shouldSkip(contextWith(headers))).toBe(false);
  });

  it('limits everything when no secret is configured', async () => {
    delete process.env.PUBLIC_SITE_REVALIDATE_SECRET;

    expect(
      await reachable.shouldSkip(
        contextWith({ 'revalidate-secret': 'a-secret' }),
      ),
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
