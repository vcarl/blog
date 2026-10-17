// Posts live at /<filename>/, matching the old gatsby createFilePath slugs.
export default {
  layout: 'post.njk',
  permalink: (data) => `/${data.page.fileSlug}/`,
};
