import { Transform, TransformFnParams } from 'class-transformer';
import sanitizeHtml from 'sanitize-html';

export function SanitizeHtml() {
  return Transform((params: TransformFnParams) => {
    return params.value
      ? sanitizeHtml(params.value, {
          allowedTags: [
            'b',
            'i',
            'em',
            'strong',
            'a',
            'hr',
            'p',
            'ol',
            'ul',
            'li',
          ],
          allowedAttributes: {
            a: ['href'],
          },
        })
      : null;
  });
}
