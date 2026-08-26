import { NoExecutableMarkupConstraint } from '../../../src/decorators/no-executable-markup.decorator';

describe('NoExecutableMarkupConstraint', () => {
  const constraint = new NoExecutableMarkupConstraint();
  const isAllowed = (value: unknown) => constraint.validate(value);

  it('allows the markup the bundled base values already contain', () => {
    expect(isAllowed('Call <a href="tel:+15555550100">the office</a>')).toBe(
      true,
    );
    expect(isAllowed('Enter your <strong>client</strong> details')).toBe(true);
    expect(
      isAllowed("placed on a <span class='t-italic'>waitlist</span>"),
    ).toBe(true);
    expect(isAllowed('Do you work in <REGION>?')).toBe(true);
  });

  it('allows plain text, interpolation tokens, and pluralization', () => {
    expect(isAllowed('Hello %{name}')).toBe(true);
    expect(isAllowed('%{smart_count} unit |||| %{smart_count} units')).toBe(
      true,
    );
    expect(isAllowed('')).toBe(true);
    expect(isAllowed('5 < 6 and 7 > 6')).toBe(true);
  });

  it('rejects tags that execute by existing', () => {
    expect(isAllowed('<script>alert(1)</script>')).toBe(false);
    expect(isAllowed('<style>body{display:none}</style>')).toBe(false);
    expect(isAllowed('before <SCRIPT src="//evil"></SCRIPT> after')).toBe(
      false,
    );
    expect(isAllowed('</script>')).toBe(false);
  });

  it('rejects tags that load remote content', () => {
    expect(isAllowed('<iframe src="//evil"></iframe>')).toBe(false);
    expect(isAllowed('<object data="//evil"></object>')).toBe(false);
    expect(isAllowed('<embed src="//evil">')).toBe(false);
    expect(isAllowed('<link rel="stylesheet" href="//evil">')).toBe(false);
    expect(
      isAllowed('<meta http-equiv="refresh" content="0;url=//evil">'),
    ).toBe(false);
    expect(isAllowed('<base href="//evil">')).toBe(false);
    expect(isAllowed('<form action="//evil"></form>')).toBe(false);
    expect(isAllowed('<img src=x onerror=alert(1)>')).toBe(false);
    expect(isAllowed('<svg onload=alert(1)></svg>')).toBe(false);
  });

  it('rejects a tag name split by characters a browser ignores', () => {
    expect(isAllowed('<scr\u0000ipt>alert(1)</scr\u0000ipt>')).toBe(false);
    expect(isAllowed('<scr\tipt>alert(1)</scr\tipt>')).toBe(false);
    expect(isAllowed('< script>alert(1)</script>')).toBe(false);
  });

  it('allows a word that merely starts with a blocked tag name', () => {
    expect(isAllowed('<scripted>')).toBe(true);
    expect(isAllowed('See the <formal> notice')).toBe(true);
  });

  it('leaves type checking to IsString', () => {
    expect(isAllowed(undefined)).toBe(true);
    expect(isAllowed(null)).toBe(true);
    expect(isAllowed(42)).toBe(true);
  });
});
