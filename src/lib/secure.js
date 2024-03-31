import sanitizeHtml from "sanitize-html";

export const sanitize = (dirty) => {
  return sanitizeHtml(dirty, sanitizeOptions);
};

const sanitizeOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "oembed"]),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    img: ["src", "srcset", "alt", "title", "width", "height", "loading"],
    iframe: ["src", "width", "height"],
    span: ["style", "class"],
    p: ["style"],
    code: ["class"],
    oembed: ["width", "height"],
  },
  allowedClasses: {
    code: [
      "language-c",
      "language-cpp",
      "language-css",
      "language-html",
      "language-java",
      "language-javascript",
      "language-python",
      "language-typescript",
      "language-plaintext",
    ],
  },
  allowedIframeHostnames: ["www.youtube.com"],
};
