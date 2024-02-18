export const delTags = (content) => {
  const deleted = content.replace(/<[^>]*>|&nbsp;/g, " ");
  return deleted;
};
