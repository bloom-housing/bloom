import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';
import { of, throwError } from 'rxjs';

const resolve4 = jest.fn();
jest.mock('dns', () => ({
  promises: { resolve4: (name: string) => resolve4(name) },
}));

import { revalidatePublicSite } from '../../../src/utilities/revalidate-public-site';

const httpSucceeding = (): HttpService =>
  ({
    post: jest.fn().mockReturnValue(of({ data: { revalidated: 13 } })),
  } as unknown as HttpService);

const httpFailing = (error: unknown): HttpService =>
  ({
    post: jest.fn().mockReturnValue(throwError(() => error)),
  } as unknown as HttpService);

describe('revalidatePublicSite', () => {
  let warn: jest.SpyInstance;

  beforeEach(() => {
    resolve4.mockReset();
    process.env.PUBLIC_SITE_REVALIDATE_SECRET = 'test-secret';
    process.env.PUBLIC_SITE_REVALIDATE_URLS = 'http://localhost:3000';
    delete process.env.PUBLIC_SITE_DISCOVERY_NAME;
    warn = jest
      .spyOn(Logger.prototype, 'warn')
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    warn.mockRestore();
    delete process.env.PUBLIC_SITE_REVALIDATE_SECRET;
    delete process.env.PUBLIC_SITE_REVALIDATE_URLS;
  });

  it('posts the secret to the configured url when no discovery name is set', async () => {
    const http = httpSucceeding();

    await revalidatePublicSite(http);

    expect(http.post).toHaveBeenCalledTimes(1);
    expect(http.post).toHaveBeenCalledWith(
      'http://localhost:3000/api/revalidate',
      {},
      expect.objectContaining({
        headers: { 'revalidate-secret': 'test-secret' },
      }),
    );
    expect(resolve4).not.toHaveBeenCalled();
  });

  it('posts once to each distinct configured url, without a trailing slash', async () => {
    process.env.PUBLIC_SITE_REVALIDATE_URLS =
      'https://one.example.org/, https://two.example.org,https://one.example.org';
    const http = httpSucceeding();

    await revalidatePublicSite(http);

    expect(http.post).toHaveBeenCalledTimes(2);
    expect(http.post).toHaveBeenCalledWith(
      'https://one.example.org/api/revalidate',
      {},
      expect.anything(),
    );
    expect(http.post).toHaveBeenCalledWith(
      'https://two.example.org/api/revalidate',
      {},
      expect.anything(),
    );
  });

  it('posts to every address behind the discovery name, ignoring the configured urls', async () => {
    process.env.PUBLIC_SITE_DISCOVERY_NAME = 'bloom-site-public.bloom.local';
    resolve4.mockResolvedValue(['10.0.1.7', '10.0.2.9']);
    const http = httpSucceeding();

    await revalidatePublicSite(http);

    expect(resolve4).toHaveBeenCalledWith('bloom-site-public.bloom.local');
    expect(http.post).toHaveBeenCalledTimes(2);
    expect(http.post).toHaveBeenCalledWith(
      'http://10.0.1.7:3000/api/revalidate',
      {},
      expect.anything(),
    );
    expect(http.post).toHaveBeenCalledWith(
      'http://10.0.2.9:3000/api/revalidate',
      {},
      expect.anything(),
    );
  });

  it('keeps going when one instance is unreachable', async () => {
    process.env.PUBLIC_SITE_DISCOVERY_NAME = 'bloom-site-public.bloom.local';
    resolve4.mockResolvedValue(['10.0.1.7', '10.0.2.9']);
    const post = jest
      .fn()
      .mockReturnValueOnce(throwError(() => ({ message: 'ECONNREFUSED' })))
      .mockReturnValueOnce(of({ data: {} }));
    const http = { post } as unknown as HttpService;

    await expect(revalidatePublicSite(http)).resolves.toBeUndefined();

    expect(post).toHaveBeenCalledTimes(2);
  });

  // The save awaits this call, so an instance that accepts the connection and never answers must
  // not hold it open.
  it('gives the post a timeout', async () => {
    const http = httpSucceeding();

    await revalidatePublicSite(http);

    expect(http.post).toHaveBeenCalledWith(
      'http://localhost:3000/api/revalidate',
      {},
      expect.objectContaining({ timeout: 5000 }),
    );
  });

  // A service that has just scaled, or whose tasks have not registered yet, resolves to nothing.
  it('posts nothing when the discovery name resolves to no addresses', async () => {
    process.env.PUBLIC_SITE_DISCOVERY_NAME = 'bloom-site-public.bloom.local';
    resolve4.mockResolvedValue([]);
    const http = httpSucceeding();

    await revalidatePublicSite(http);

    expect(http.post).not.toHaveBeenCalled();
  });

  it.each([
    ['no scheme', 'housing.example.org'],
    ['a scheme that is not http', 'file:///etc/passwd'],
    ['credentials in the url', 'http://user:pass@housing.example.org'],
  ])(
    'refuses to send the secret to a configured url with %s',
    async (_label, url) => {
      process.env.PUBLIC_SITE_REVALIDATE_URLS = url;
      const http = httpSucceeding();

      await revalidatePublicSite(http);

      expect(http.post).not.toHaveBeenCalled();
    },
  );

  it('gives up quietly when the discovery name does not resolve', async () => {
    process.env.PUBLIC_SITE_DISCOVERY_NAME = 'bloom-site-public.bloom.local';
    resolve4.mockRejectedValue(new Error('queryA ENOTFOUND'));
    const http = httpSucceeding();

    await expect(revalidatePublicSite(http)).resolves.toBeUndefined();

    expect(http.post).not.toHaveBeenCalled();
  });

  it('does nothing when no public site url is configured', async () => {
    const http = httpSucceeding();

    delete process.env.PUBLIC_SITE_REVALIDATE_URLS;
    await revalidatePublicSite(http);
    process.env.PUBLIC_SITE_REVALIDATE_URLS = ' , ';
    await revalidatePublicSite(http);

    expect(http.post).not.toHaveBeenCalled();
  });

  // The route on the public site refuses every call when it has no secret, so there is nothing to
  // gain by posting.
  it('does nothing when the api has no revalidate secret', async () => {
    delete process.env.PUBLIC_SITE_REVALIDATE_SECRET;
    const http = httpSucceeding();

    await revalidatePublicSite(http);

    expect(http.post).not.toHaveBeenCalled();
  });

  it('never sends the api passkey', async () => {
    process.env.API_PASS_KEY = 'api-passkey';
    const http = httpSucceeding();

    await revalidatePublicSite(http);

    expect(JSON.stringify((http.post as jest.Mock).mock.calls)).not.toContain(
      'api-passkey',
    );
    delete process.env.API_PASS_KEY;
  });

  it('never throws when the public site rejects the call', async () => {
    const http = httpFailing({ response: { status: 401 } });

    await expect(revalidatePublicSite(http)).resolves.toBeUndefined();
  });

  it('survives an error that is not an object', async () => {
    const http = httpFailing('socket hang up');

    await expect(revalidatePublicSite(http)).resolves.toBeUndefined();
  });
});
