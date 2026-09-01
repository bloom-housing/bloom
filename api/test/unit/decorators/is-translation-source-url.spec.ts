import {
  ALLOWED_TRANSLATION_SOURCE_HOSTS,
  IsTranslationSourceUrlConstraint,
} from '../../../src/decorators/is-translation-source-url.decorator';
import { DEFAULT_REPOSITORY_URL } from '../../../src/utilities/translation-override-migration';

describe('IsTranslationSourceUrl', () => {
  const constraint = new IsTranslationSourceUrlConstraint();

  it('allows a repository on the allowed host', () => {
    expect(
      constraint.validate('https://raw.githubusercontent.com/acme/fork'),
    ).toBe(true);
  });

  it('allows the default the migration ships with', () => {
    expect(constraint.validate(DEFAULT_REPOSITORY_URL)).toBe(true);
  });

  it('keeps the default and the allowed hosts from drifting apart', () => {
    expect(ALLOWED_TRANSLATION_SOURCE_HOSTS).toContain(
      new URL(DEFAULT_REPOSITORY_URL).host,
    );
  });

  it.each([
    ['a private address', 'https://10.0.4.12/x'],
    ['a private address on another port', 'https://10.0.4.12:9200/x'],
    [
      'the instance metadata address',
      'https://169.254.169.254/latest/meta-data',
    ],
    ['loopback', 'https://127.0.0.1:5432/x'],
    [
      'a host that only looks like the allowed one',
      'https://raw.githubusercontent.com.evil.example/x',
    ],
    [
      'the allowed host in the path',
      'https://evil.example/raw.githubusercontent.com/x',
    ],
    [
      'the allowed host as a subdomain of another',
      'https://raw.githubusercontent.com.a.evil.example/x',
    ],
    [
      'a port on the allowed host',
      'https://raw.githubusercontent.com:8443/acme/fork',
    ],
    ['plain http', 'http://raw.githubusercontent.com/acme/fork'],
    ['a non-url', 'not a url'],
  ])('rejects %s', (_label, value) => {
    expect(constraint.validate(value)).toBe(false);
  });

  it('rejects credentials, which change which host is contacted', () => {
    expect(
      constraint.validate(
        'https://evil.example@raw.githubusercontent.com/acme/fork',
      ),
    ).toBe(false);
  });

  it.each([
    ['a query', 'https://raw.githubusercontent.com/acme/fork?a=b'],
    ['a fragment', 'https://raw.githubusercontent.com/acme/fork#a'],
  ])(
    'rejects %s, which the appended path would land after',
    (_label, value) => {
      expect(constraint.validate(value)).toBe(false);
    },
  );

  it('leaves a non-string to IsString', () => {
    expect(constraint.validate(undefined)).toBe(true);
  });
});
