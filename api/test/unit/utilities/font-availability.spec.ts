import { HttpService } from '@nestjs/axios';
import { BadRequestException } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { assertFontIsAvailable } from '../../../src/utilities/font-availability';
import { BrandDTO } from '../../../src/dtos/jurisdictions/brand.dto';

const brand = (overrides: Partial<BrandDTO> = {}): BrandDTO =>
  ({
    primary: { base: '#773E98' },
    fontFamily: 'Inter',
    fontUrl: 'https://fonts.googleapis.com/css2?family=Inter&display=swap',
    ...overrides,
  } as BrandDTO);

const httpReturning = (css: string): HttpService =>
  ({
    get: jest.fn().mockReturnValue(of({ data: css })),
  } as unknown as HttpService);

const httpFailing = (error: unknown): HttpService =>
  ({
    get: jest.fn().mockReturnValue(throwError(() => error)),
  } as unknown as HttpService);

describe('assertFontIsAvailable', () => {
  it('accepts css that names the family', async () => {
    await expect(
      assertFontIsAvailable(
        httpReturning("@font-face {\n  font-family: 'Inter';\n}"),
        brand(),
      ),
    ).resolves.toBeUndefined();
  });

  it('rejects css that names a different family', async () => {
    await expect(
      assertFontIsAvailable(httpReturning("font-family: 'Roboto';"), brand()),
    ).rejects.toThrow(BadRequestException);
  });

  it('rejects the 400 google returns for a family it does not have', async () => {
    await expect(
      assertFontIsAvailable(
        httpFailing({ response: { status: 400 } }),
        brand(),
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('accepts when google itself is failing', async () => {
    await expect(
      assertFontIsAvailable(
        httpFailing({ response: { status: 503 } }),
        brand(),
      ),
    ).resolves.toBeUndefined();
  });

  it('survives an error that is not an object', async () => {
    await expect(
      assertFontIsAvailable(httpFailing('socket hang up'), brand()),
    ).resolves.toBeUndefined();
  });

  it('accepts when the font host cannot be reached', async () => {
    const unreachable = { message: 'getaddrinfo ENOTFOUND' };

    await expect(
      assertFontIsAvailable(httpFailing(unreachable), brand()),
    ).resolves.toBeUndefined();
  });

  it('requires every family the brand names', async () => {
    const twoFamilies = brand({ headingFontFamily: 'Playfair Display' });

    await expect(
      assertFontIsAvailable(
        httpReturning("font-family: 'Inter'; font-family: 'Playfair Display';"),
        twoFamilies,
      ),
    ).resolves.toBeUndefined();

    await expect(
      assertFontIsAvailable(
        httpReturning("font-family: 'Inter';"),
        twoFamilies,
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('checks the serif family against the stylesheet', async () => {
    const withSerif = brand({ serifFontFamily: 'Noto Serif' });

    await expect(
      assertFontIsAvailable(
        httpReturning("font-family: 'Inter'; font-family: 'Noto Serif';"),
        withSerif,
      ),
    ).resolves.toBeUndefined();

    await expect(
      assertFontIsAvailable(httpReturning("font-family: 'Inter';"), withSerif),
    ).rejects.toThrow(BadRequestException);
  });

  it('accepts a brand whose only family is the serif one', async () => {
    await expect(
      assertFontIsAvailable(
        httpReturning("font-family: 'Noto Serif';"),
        brand({
          fontFamily: undefined,
          serifFontFamily: 'Noto Serif',
          fontUrl: 'https://fonts.googleapis.com/css2?family=Noto+Serif',
        }),
      ),
    ).resolves.toBeUndefined();
  });

  it('checks a heading family stored without a body family', async () => {
    await expect(
      assertFontIsAvailable(
        httpReturning("font-family: 'Roboto';"),
        brand({ fontFamily: undefined, headingFontFamily: 'Playfair Display' }),
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it.each([
    ['a port', 'https://fonts.googleapis.com:1/css2?family=Inter'],
    ['credentials', 'https://user:pass@fonts.googleapis.com/css2?family=Inter'],
    ['another host', 'https://fonts.example.test/css2?family=Inter'],
  ])(
    'refuses a url with %s rather than fetching it',
    async (_label, fontUrl) => {
      const http = httpReturning("font-family: 'Inter';");

      await expect(
        assertFontIsAvailable(http, brand({ fontUrl })),
      ).rejects.toThrow(BadRequestException);
      expect(http.get).not.toHaveBeenCalled();
    },
  );

  it('accepts a brand with no font at all', async () => {
    const http = httpReturning('');

    await assertFontIsAvailable(
      http,
      brand({ fontUrl: undefined, fontFamily: undefined }),
    );
    await assertFontIsAvailable(http, null);

    expect(http.get).not.toHaveBeenCalled();
  });

  it('rejects half a font', async () => {
    const http = httpReturning("font-family: 'Inter';");

    await expect(
      assertFontIsAvailable(http, brand({ fontUrl: undefined })),
    ).rejects.toThrow(BadRequestException);
    await expect(
      assertFontIsAvailable(
        http,
        brand({ fontFamily: undefined, headingFontFamily: undefined }),
      ),
    ).rejects.toThrow(BadRequestException);
    expect(http.get).not.toHaveBeenCalled();
  });
});
