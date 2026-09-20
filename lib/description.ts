import sanitizeHtml from "sanitize-html";

const options: sanitizeHtml.IOptions = {
  allowedTags: [
    "p",
    "h2",
    "h3",
    "strong",
    "em",
    "u",
    "s",
    "ul",
    "ol",
    "li",
    "blockquote",
    "a",
    "br",
  ],
  allowedAttributes: { a: ["href"] },
  allowedSchemes: ["https", "http", "mailto"],
  allowProtocolRelative: false,
};

export function cleanDescription(value: string) {
  return sanitizeHtml(value, options).trim();
}

export function hasDescriptionText(value: string) {
  return (
    plainDescription(value)
      .replace(/&nbsp;|&#160;|&#xa0;/gi, " ")
      .trim().length > 0
  );
}

export function plainDescription(value: string) {
  return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }).trim();
}
