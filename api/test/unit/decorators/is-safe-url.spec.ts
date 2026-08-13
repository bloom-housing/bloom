import { IsSafeUrlConstraint } from '../../../src/decorators/is-safe-url.decorator';

describe('IsSafeUrlConstraint', () => {
  const constraint = new IsSafeUrlConstraint();
  const isSafe = (value: unknown) => constraint.validate(value);

  it('allows relative paths, fragments, and query-only values', () => {
    expect(isSafe('/')).toBe(true);
    expect(isSafe('/resources')).toBe(true);
    expect(isSafe('#section')).toBe(true);
    expect(isSafe('?q=1')).toBe(true);
    expect(isSafe('')).toBe(true);
  });

  it('allows http, https, mailto, and tel URLs', () => {
    expect(isSafe('https://example.gov')).toBe(true);
    expect(isSafe('http://example.gov/page')).toBe(true);
    expect(isSafe('HTTPS://EXAMPLE.GOV')).toBe(true);
    expect(isSafe('mailto:help@example.gov')).toBe(true);
    expect(isSafe('tel:+15555550100')).toBe(true);
  });

  it('rejects script-executing and other disallowed schemes', () => {
    expect(isSafe('javascript:alert(1)')).toBe(false);
    expect(isSafe('JavaScript:alert(1)')).toBe(false);
    expect(isSafe('data:text/html,<script>alert(1)</script>')).toBe(false);
    expect(isSafe('vbscript:msgbox(1)')).toBe(false);
    expect(isSafe('file:///etc/passwd')).toBe(false);
  });

  it('rejects schemes obfuscated with control characters or whitespace', () => {
    expect(isSafe('java\tscript:alert(1)')).toBe(false);
    expect(isSafe('java\nscript:alert(1)')).toBe(false);
    expect(isSafe(' javascript:alert(1)')).toBe(false);
    expect(isSafe('\x00javascript:alert(1)')).toBe(false);
  });

  it('defers non-string values to @IsString', () => {
    expect(isSafe(undefined)).toBe(true);
    expect(isSafe(42)).toBe(true);
  });
});
