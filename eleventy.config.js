import syntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight';

// Same id scheme the old Gatsby renderer used (src/helpers/{strings,htmlAst}.js),
// so existing #fragment links to paragraphs and headings keep working.
const toId = (text) =>
  text
    .substr(0, 40)
    .trim()
    .replace(/[“‘”’'",.<>/?\[\]\\|\{\}=\+\(\)]/g, '')
    .replace(/ /g, '-')
    .toLowerCase();

const inlineText = (children = []) =>
  children
    .map((t) =>
      t.type === 'text' || t.type === 'code_inline'
        ? t.content
        : t.type === 'softbreak'
        ? '\n'
        : '',
    )
    .join('');

const ymd = (d) => (d ? new Date(d).toISOString().slice(0, 10) : '');
const stripHtml = (html = '') =>
  html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
const tagList = (tags = []) =>
  [].concat(tags).join(',').split(/,\s*/).filter(Boolean);
const byDate = (a, b) => b.date - a.date;

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.amendLibrary('md', (md) => {
    // Bare URLs were autolinked by remark's GFM mode (protocol URLs only).
    md.set({ linkify: true });
    md.linkify.set({ fuzzyLink: false, fuzzyEmail: false });

    const anchored = (tokens, idx, options, env, self) => {
      const token = tokens[idx];
      if (token.hidden) return '';
      const id = toId(inlineText(tokens[idx + 1].children));
      token.attrSet('id', id);
      return (
        self.renderToken(tokens, idx, options) +
        `<a class="anchor" href="#${md.utils.escapeHtml(id)}" aria-hidden="true" tabindex="-1"></a>`
      );
    };
    md.renderer.rules.paragraph_open = anchored;
    md.renderer.rules.heading_open = (tokens, idx, ...rest) => {
      // The post title is the page's h1, so markdown headings shift down a level.
      const level = Math.min(Number(tokens[idx].tag[1]) + 1, 6);
      tokens[idx].tag = `h${level}`;
      return anchored(tokens, idx, ...rest);
    };
    md.renderer.rules.heading_close = (tokens, idx) =>
      `</h${Math.min(Number(tokens[idx].tag[1]) + 1, 6)}>\n`;
  });

  // remark accepted ATX headings without a space ("##Heading"); CommonMark
  // doesn't. Insert the space (outside code fences) so they stay headings.
  eleventyConfig.addPreprocessor('atx-headings', 'md', (data, content) => {
    let fenced = false;
    return content
      .split('\n')
      .map((line) => {
        if (/^\s*(```|~~~)/.test(line)) fenced = !fenced;
        return fenced ? line : line.replace(/^(#{1,6})(?=[^#\s])/, '$1 ');
      })
      .join('\n');
  });

  // ponytail: Prism's diff grammar emits the "<" line prefix unescaped; patch
  // the output until eleventy-plugin-syntaxhighlight/Prism fixes it.
  eleventyConfig.addTransform('escape-diff-prefix', (content) =>
    content.replaceAll(
      '<span class="token prefix deleted"><</span>',
      '<span class="token prefix deleted">&lt;</span>',
    ),
  );

  eleventyConfig.addPassthroughCopy({ static: '/' });
  eleventyConfig.addPassthroughCopy({ 'src/images': 'images' });
  eleventyConfig.addPassthroughCopy('src/fonts');
  eleventyConfig.addPassthroughCopy('src/styles.css');
  eleventyConfig.addPassthroughCopy('src/manifest.webmanifest');
  eleventyConfig.addPassthroughCopy('src/_headers');

  eleventyConfig.addCollection('posts', (api) =>
    api
      .getFilteredByGlob('src/pages/*.md')
      .filter((p) => p.data.published !== false)
      .sort(byDate),
  );

  eleventyConfig.addFilter('ymd', ymd);
  eleventyConfig.addFilter('rfc822', (d) => (d ? new Date(d) : new Date()).toUTCString());
  eleventyConfig.addFilter('tagList', tagList);
  // gatsby-transformer-remark's estimate: 265 words per minute, at least 1.
  eleventyConfig.addFilter('timeToRead', (html) =>
    Math.max(1, Math.round((stripHtml(html).match(/[\p{L}\p{N}]+/gu) || []).length / 265)),
  );
  eleventyConfig.addFilter('excerpt', (html, length = 140) => {
    const text = stripHtml(html);
    if (text.length <= length) return text;
    return text.slice(0, text.lastIndexOf(' ', length)) + '…';
  });
  eleventyConfig.addFilter('authors', (authors) =>
    new Intl.ListFormat('en', { style: 'long', type: 'conjunction' }).format(
      authors && authors.length ? authors : ['Carl Vitullo'],
    ),
  );

  // Index: standalone posts plus series grouped together, newest first.
  eleventyConfig.addFilter('indexEntries', (posts) => {
    const series = new Map();
    const entries = [];
    for (const post of posts) {
      const name = post.data.series;
      if (!name) {
        entries.push({ type: 'post', date: post.date, post });
      } else if (series.has(name)) {
        series.get(name).posts.push(post);
      } else {
        const entry = { type: 'series', title: name, date: post.date, posts: [post] };
        series.set(name, entry);
        entries.push(entry);
      }
    }
    for (const entry of series.values()) entry.posts.reverse();
    return entries.sort(byDate);
  });

  eleventyConfig.addFilter('indexOfUrl', (posts, url) =>
    posts.findIndex((p) => p.url === url),
  );
  eleventyConfig.addShortcode('year', () => String(new Date().getFullYear()));
  eleventyConfig.addFilter('inSeries', (posts, name) =>
    posts.filter((p) => p.data.series === name).reverse(),
  );

  // Same rules as the old RelatedPosts: the 10 newest other posts outside this
  // series, kept if they share a tag.
  eleventyConfig.addFilter('relatedPosts', (posts, url, series, currentTags) => {
    const tags = tagList(currentTags);
    return posts
      .filter((p) => p.url !== url && (!series || p.data.series !== series))
      .slice(0, 10)
      .map((post) => ({
        post,
        tag: tagList(post.data.tags).find((t) => tags.includes(t)),
      }))
      .filter((r) => r.tag);
  });

  return {
    dir: { input: 'src', output: 'public' },
    templateFormats: ['md', 'njk'],
    // Posts are plain markdown; don't run code samples through a template engine.
    markdownTemplateEngine: false,
  };
}
