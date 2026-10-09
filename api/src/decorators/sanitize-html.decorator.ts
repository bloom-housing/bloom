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

// keepEmpty stores an emptied field as "" rather than null, so content can hide a section.
export function SanitizeHtml({ keepEmpty = false } = {}) {
  return Transform((params: TransformFnParams) => {
    if (typeof params.value !== 'string') return null;
    return params.value || keepEmpty ? sanitize(params.value) : null;
  });
}
