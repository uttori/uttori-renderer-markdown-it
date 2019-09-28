const debug = require('debug')('Uttori.Plugin.Render.MarkdownIt');
const MarkdownIt = require('markdown-it');
const slugify = require('slugify');

class MarkdownItRenderer {
  static register(context) {
    if (!context || !context.hooks || typeof context.hooks.on !== 'function') {
      throw new Error("Missing event dispatcher in 'context.hooks.on(event, callback)' format.");
    }
    context.hooks.on('render-content', MarkdownItRenderer.renderContent); // UttoriWiki
    context.hooks.on('render-meta-description', MarkdownItRenderer.renderContent); // UttoriWiki
    context.hooks.on('render-search-results', MarkdownItRenderer.renderCollection); // UttoriWiki
    context.hooks.on('validate-config', MarkdownItRenderer.validateConfig); // UttoriWiki
  }

  static defaultConfig() {
    return {
      // Enable HTML tags in source
      html: false,

      // Use '/' to close single tags (<br />).
      xhtmlOut: false,

      // Convert '\n' in paragraphs into <br>, this is only for full CommonMark compatibility.
      breaks: false,

      // CSS language prefix for fenced blocks. Can be useful for external highlighters.
      langPrefix: 'language-',

      // Autoconvert URL-like text to links.
      linkify: false,

      // Enable some language-neutral replacement + quotes beautification.
      typographer: false,

      // Double + single quotes replacement pairs, when typographer enabled, and smartquotes on. Could be either a String or an Array.
      // For example, you can use '«»„“' for Russian, '„“‚‘' for German, and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
      quotes: '“”‘’',

      // Highlighter function. Should return escaped HTML, or '' if the source string is not changed and should be escaped externally.
      // If result starts with <pre... internal wrapper is skipped.
      // highlight: (/* str, lang */) => '',
    };
  }

  static validateConfig(config, _context) {
    debug('Validating config...');
    if (!config || !config.renderMarkdownIt) {
      debug('Config Warning: `renderMarkdownIt` configuration key is missing.');
    }
    debug('Validated config.');
  }

  static renderContent(content, context = { config: { renderMarkdownIt: {} } }) {
    debug('Rendering content');
    const config = { ...MarkdownItRenderer.defaultConfig(), ...context.config.renderMarkdownIt };
    return MarkdownItRenderer.render(content, config);
  }

  static renderCollection(collection, context = { config: { renderMarkdownIt: {} } }) {
    debug('Rendering collection:', collection.length);
    const config = { ...MarkdownItRenderer.defaultConfig(), ...context.config.renderMarkdownIt };
    return collection.map((document) => {
      const html = MarkdownItRenderer.render(document.html, config);
      return { ...document, html };
    });
  }

  static render(content, config) {
    if (!content) {
      debug('No input provided, returning a blank string.');
      return '';
    }

    const md = new MarkdownIt(config);

    // Remove empty links.
    content = content.replace('[]()', '');

    // Find missing links, and link them.
    const missingLinks = content.match(/\[(.*)]\(\s?\)/g) || [];
    if (missingLinks && missingLinks.length > 0) {
      debug('Found missing links:', missingLinks.length);
      missingLinks.forEach((match) => {
        const title = match.slice(1).slice(0, -3);
        const slug = slugify(title, { lower: true });
        content = content.replace(match, `[${title}](/${slug})`);
      });
    }

    return md.render(content).trim();
  }
}

module.exports = MarkdownItRenderer;
