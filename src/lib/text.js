export const delTags = (content) => {
  const deleted = content.replace(/<[^>]*>|&nbsp;/g, " ");
  return deleted;
};

export const getFirstP = (content) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = content;

  // Extract text content from each <p> element
  const paragraphs = Array.from(tempDiv.querySelectorAll("p"))
    .map((p) => p.textContent.trim())
    .join(" ");
  console.log(paragraphs);
  return paragraphs;
};

export const getImgDirs = (content) => {
  const regex = /<img.*?src=["'](.*?)["']/g;
  const imgTags = content.match(regex);

  if (imgTags) {
    const imgSrcs = imgTags.map((tag) => {
      const regex = /image[^\s"']+/g;
      const match = tag.match(regex);

      return match[0];
    });

    return imgSrcs;
  } else {
    return null;
  }
};

export const isJson = (target) => {
  if (typeof target !== "string") return false;

  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }

  return true;
};

export function copyToClipboard(text) {
  navigator.clipboard.writeText(text);
}
