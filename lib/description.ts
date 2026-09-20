import sanitizeHtml from "sanitize-html";

const localUploadPattern = /^\/api\/uploads\/[a-f0-9-]{36}\.(jpg|png|webp)$/;

export function isLocalUploadUrl(value: string) {
  return localUploadPattern.test(value);
}

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
    "img",
  ],
  allowedAttributes: { a: ["href"], img: ["src", "alt"] },
  allowedSchemes: ["https", "http", "mailto"],
  allowedSchemesByTag: { img: ["https"] },
  allowProtocolRelative: false,
  exclusiveFilter: (frame) =>
    frame.tag === "img" && !isAllowedImageUrl(frame.attribs.src || ""),
};

export function isAllowedImageUrl(value: string) {
  if (/^\/images\/(conference|workshop|collaboration)\.jpg$/.test(value))
    return true;
  if (isLocalUploadUrl(value)) return true;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

export function uploadedDescriptionImages(value: string) {
  const urls = new Set<string>();
  sanitizeHtml(value, {
    allowedTags: ["img"],
    allowedAttributes: { img: ["src"] },
    transformTags: {
      img: (tagName, attribs) => {
        if (isLocalUploadUrl(attribs.src || "")) urls.add(attribs.src);
        return { tagName, attribs };
      },
    },
  });
  return urls;
}

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
