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
