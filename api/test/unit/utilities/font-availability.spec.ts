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

  it('checks a heading family stored without a body family', async () => {
    await expect(
      assertFontIsAvailable(
        httpReturning("font-family: 'Roboto';"),
        brand({ fontFamily: undefined, headingFontFamily: 'Playfair Display' }),
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('makes no request without both a url and a family', async () => {
    const http = httpReturning('');

    await assertFontIsAvailable(http, brand({ fontUrl: undefined }));
    await assertFontIsAvailable(
      http,
      brand({ fontFamily: undefined, headingFontFamily: undefined }),
    );
    await assertFontIsAvailable(http, null);

    expect(http.get).not.toHaveBeenCalled();
  });
});
