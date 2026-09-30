import { Transform, TransformFnParams } from 'class-transformer';
import sanitizeHtml from 'sanitize-html';

const ALLOWED_TAGS = ['b', 'strong', 'a', 'hr', 'p', 'ol', 'ul', 'li', 'br'];
const ALLOWED_ATTRIBUTES = { a: ['href'] };
const ALLOWED_SCHEMES = ['http', 'https', 'mailto', 'tel'];

export const sanitize = (content: string) => {
  return sanitizeHtml(content, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
    allowedSchemes: ALLOWED_SCHEMES,
  });
};

export function SanitizeHtml() {
  return Transform((params: TransformFnParams) => {
    return params.value ? sanitize(params.value) : null;
  });
}
