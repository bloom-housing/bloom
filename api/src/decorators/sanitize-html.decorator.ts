import { Transform, TransformFnParams } from 'class-transformer';
import sanitizeHtml from 'sanitize-html';

export const sanitize = (content: string) => {
  return sanitizeHtml(content, {
    allowedTags: ['b', 'strong', 'a', 'hr', 'p', 'ol', 'ul', 'li', 'br'],
    allowedAttributes: {
      a: ['href'],
    },
  });
};

export function SanitizeHtml() {
  return Transform((params: TransformFnParams) => {
    return params.value ? sanitize(params.value) : null;
  });
}
