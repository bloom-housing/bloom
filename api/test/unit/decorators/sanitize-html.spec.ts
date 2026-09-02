import { sanitize } from '../../../src/decorators/sanitize-html.decorator';

describe('sanitize()', () => {
  it('should keep text content', () => {
    expect(sanitize('Custom content')).toEqual('Custom content');
  });
  it('should keep accepted tags', () => {
    expect(
      sanitize(
        `<strong>Bold text<br /><a href='https://www.exygy.com'>Link</a><hr><p>Paragraph</p><ul><li>Unordered list</li></ul><br /><ol><li>Ordered list</li></ol>`,
      ),
    ).toEqual(
      `<strong>Bold text<br /><a href=\"https://www.exygy.com\">Link</a><hr /><p>Paragraph</p><ul><li>Unordered list</li></ul><br /><ol><li>Ordered list</li></ol></strong>`,
    );
  });
  it('completes unfinished tags', () => {
    expect(sanitize(`<strong>Bold text`)).toEqual(`<strong>Bold text</strong>`);
  });
  it('removes event handler attributes', () => {
    expect(sanitize(`<p onclick="alert(1)">text</p>`)).toEqual(`<p>text</p>`);
    expect(sanitize(`<img src="x" onerror="alert(1)">`)).toEqual(``);
  });
  it('removes a link target that would run script', () => {
    expect(sanitize(`<a href="javascript:alert(1)">link</a>`)).toEqual(
      `<a>link</a>`,
    );
    expect(sanitize(`<a href="JaVaScRiPt:alert(1)">link</a>`)).toEqual(
      `<a>link</a>`,
    );
    expect(sanitize(`<a href="java\tscript:alert(1)">link</a>`)).toEqual(
      `<a>link</a>`,
    );
    expect(sanitize(`<a href="&#106;avascript:alert(1)">link</a>`)).toEqual(
      `<a>link</a>`,
    );
    expect(
      sanitize(`<a href="data:text/html;base64,PHNjcmlwdD4=">link</a>`),
    ).toEqual(`<a>link</a>`);
  });
  it('keeps the link schemes the editor offers', () => {
    expect(sanitize(`<a href="https://www.exygy.com">site</a>`)).toEqual(
      `<a href="https://www.exygy.com">site</a>`,
    );
    expect(sanitize(`<a href="mailto:help@bloom.gov">mail</a>`)).toEqual(
      `<a href="mailto:help@bloom.gov">mail</a>`,
    );
    expect(sanitize(`<a href="tel:+15555555555">call</a>`)).toEqual(
      `<a href="tel:+15555555555">call</a>`,
    );
  });
  it('removes script content along with the tag', () => {
    expect(
      sanitize(`<p>before</p><script>alert(1)</script><p>after</p>`),
    ).toEqual(`<p>before</p><p>after</p>`);
    expect(sanitize(`<style>body{display:none}</style><p>keep</p>`)).toEqual(
      `<p>keep</p>`,
    );
    expect(sanitize(`<svg><script>alert(1)</script></svg>`)).toEqual(``);
  });
  it('removes markup that loads or submits to another origin', () => {
    expect(
      sanitize(`<iframe src="https://evil.example"></iframe><p>keep</p>`),
    ).toEqual(`<p>keep</p>`);
    expect(
      sanitize(
        `<form action="https://evil.example"><input /></form><p>keep</p>`,
      ),
    ).toEqual(`<p>keep</p>`);
  });
  it('removes presentation attributes and stored text direction', () => {
    expect(sanitize(`<p class="x" style="color:red">text</p>`)).toEqual(
      `<p>text</p>`,
    );
    expect(sanitize(`<a href="https://x.gov" target="_blank">x</a>`)).toEqual(
      `<a href="https://x.gov">x</a>`,
    );
    expect(sanitize(`<p dir="rtl">text</p>`)).toEqual(`<p>text</p>`);
  });
  it('removes disallowed tags and attributes', () => {
    expect(
      sanitize(
        `<h1>Header</h1><br /><div><strong>Content</strong></div><br /><button>Button</button><br /><a href='https://www.exygy.com' target='_blank'>Link</a>`,
      ),
    ).toEqual(
      `Header<br /><strong>Content</strong><br />Button<br /><a href=\"https://www.exygy.com\">Link</a>`,
    );
  });
});
