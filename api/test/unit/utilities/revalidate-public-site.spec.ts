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
    process.env.API_PASS_KEY = 'test-passkey';
    delete process.env.PUBLIC_SITE_DISCOVERY_NAME;
    warn = jest
      .spyOn(Logger.prototype, 'warn')
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    warn.mockRestore();
  });

  it('posts to the jurisdiction url when no discovery name is set', async () => {
    const http = httpSucceeding();

    await revalidatePublicSite(http, 'http://localhost:3000');

    expect(http.post).toHaveBeenCalledTimes(1);
    expect(http.post).toHaveBeenCalledWith(
      'http://localhost:3000/api/revalidate',
      {},
      expect.objectContaining({ headers: { passkey: 'test-passkey' } }),
    );
    expect(resolve4).not.toHaveBeenCalled();
  });

  it('drops a trailing slash from the jurisdiction url', async () => {
    const http = httpSucceeding();

    await revalidatePublicSite(http, 'https://housing.example.org/');

    expect(http.post).toHaveBeenCalledWith(
      'https://housing.example.org/api/revalidate',
      {},
      expect.anything(),
    );
  });

  it('posts to every address behind the discovery name', async () => {
    process.env.PUBLIC_SITE_DISCOVERY_NAME = 'bloom-site-public.bloom.local';
    resolve4.mockResolvedValue(['10.0.1.7', '10.0.2.9']);
    const http = httpSucceeding();

    await revalidatePublicSite(http, 'https://housing.example.org');

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

    await expect(
      revalidatePublicSite(http, 'https://housing.example.org'),
    ).resolves.toBeUndefined();

    expect(post).toHaveBeenCalledTimes(2);
  });

  it('gives up quietly when the discovery name does not resolve', async () => {
    process.env.PUBLIC_SITE_DISCOVERY_NAME = 'bloom-site-public.bloom.local';
    resolve4.mockRejectedValue(new Error('queryA ENOTFOUND'));
    const http = httpSucceeding();

    await expect(
      revalidatePublicSite(http, 'https://housing.example.org'),
    ).resolves.toBeUndefined();

    expect(http.post).not.toHaveBeenCalled();
  });

  it('does nothing when the jurisdiction has no public url', async () => {
    const http = httpSucceeding();

    await revalidatePublicSite(http, null);
    await revalidatePublicSite(http, '   ');
    await revalidatePublicSite(http);

    expect(http.post).not.toHaveBeenCalled();
  });

  // The route on the public site refuses every call when it has no secret, so there is nothing to
  // gain by posting.
  it('does nothing when the api has no passkey', async () => {
    delete process.env.API_PASS_KEY;
    const http = httpSucceeding();

    await revalidatePublicSite(http, 'http://localhost:3000');

    expect(http.post).not.toHaveBeenCalled();
  });

  it('never throws when the public site rejects the call', async () => {
    const http = httpFailing({ response: { status: 401 } });

    await expect(
      revalidatePublicSite(http, 'http://localhost:3000'),
    ).resolves.toBeUndefined();
  });

  it('survives an error that is not an object', async () => {
    const http = httpFailing('socket hang up');

    await expect(
      revalidatePublicSite(http, 'http://localhost:3000'),
    ).resolves.toBeUndefined();
  });
});
