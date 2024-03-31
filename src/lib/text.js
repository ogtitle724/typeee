export const delTags = (content) => {
  const deleted = content.replace(/<[^>]*>|&nbsp;/g, " ");
  return deleted;
};

export const getFirstP = (content) => {
  const regex = /<p[^>]*>(.*?)<\/p>/s;
  const match = regex.exec(content);

  return match && match[1].trim();
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
