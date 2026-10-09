import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ApiKeyGuard } from '../../../src/guards/api-key.guard';

const contextWith = (headers: Record<string, unknown>): ExecutionContext =>
  ({
    switchToHttp: () => ({ getRequest: () => ({ headers }) }),
  } as unknown as ExecutionContext);

describe('ApiKeyGuard', () => {
  const guard = new ApiKeyGuard();

  afterEach(() => {
    delete process.env.API_PASS_KEY;
  });

  it('allows a matching passkey', () => {
    process.env.API_PASS_KEY = 'a-secret';

    expect(guard.canActivate(contextWith({ passkey: 'a-secret' }))).toBe(true);
  });

  it.each([
    ['no passkey', {}],
    ['a different passkey of the same length', { passkey: 'b-secret' }],
    ['a shorter passkey', { passkey: 'a-secre' }],
    ['a longer passkey', { passkey: 'a-secrets' }],
    ['a passkey that is not a string', { passkey: ['a-secret'] }],
  ])('rejects %s', (_label, headers) => {
    process.env.API_PASS_KEY = 'a-secret';

    expect(() => guard.canActivate(contextWith(headers))).toThrow(
      UnauthorizedException,
    );
  });

  // Every deployment set no key until recently, so the api has always answered without one.
  it('allows every request when no key is configured', () => {
    expect(guard.canActivate(contextWith({}))).toBe(true);
    expect(guard.canActivate(contextWith({ passkey: 'anything' }))).toBe(true);
  });
});
