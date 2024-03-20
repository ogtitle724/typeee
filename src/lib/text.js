export const delTags = (content) => {
  const deleted = content.replace(/<[^>]*>|&nbsp;/g, " ");
  return deleted;
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
