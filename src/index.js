const debug = require('debug')('Uttori.Plugin.Render.MarkdownIt');
const MarkdownIt = require('markdown-it');
const slugify = require('slugify');

/**
 * Uttori MarkdownIt Renderer
 * @example <caption>MarkdownItRenderer</caption>
 * const content = MarkdownItRenderer.render("...");
 * @class
 */
class MarkdownItRenderer {
  /**
   * The configuration key for plugin to look for in the provided configuration.
   * @return {String} The configuration key.
   * @example <caption>MarkdownItRenderer.configKey</caption>
   * const config = { ...MarkdownItRenderer.defaultConfig(), ...context.config[MarkdownItRenderer.configKey] };
   * @static
   */
  static get configKey() {
    return 'uttori-plugin-renderer-markdown-it';
  }

  /**
   * The default configuration.
   * @return {Object} The configuration.
   * @example <caption>MarkdownItRenderer.defaultConfig()</caption>
   * const config = { ...MarkdownItRenderer.defaultConfig(), ...context.config[MarkdownItRenderer.configKey] };
   * @static
   */
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

  /**
   * Validates the provided configuration for required entries.
   * @param {Object} config - A configuration object.
   * @param {Object} config[MarkdownItRenderer.configKey] - A configuration object specifically for this plugin.
   * @example <caption>MarkdownItRenderer.validateConfig(config, _context)</caption>
   * SitemapGenerator.validateConfig({ ... });
   * @static
   */
  static validateConfig(config, _context) {
    debug('Validating config...');
    if (!config || !config[MarkdownItRenderer.configKey]) {
      debug('Config Warning: `renderMarkdownIt` configuration key is missing.');
    }
    debug('Validated config.');
  }

  /**
   * Register the plugin with a provided set of events on a provided Hook system.
   * @param {Object} context - A Uttori-like context.
   * @param {Object} context.hooks - An event system / hook system to use.
   * @param {Function} context.hooks.on - An event registration function.
   * @param {Object} context.config - A provided configuration to use.
   * @param {Object} context.config.events - An object whose keys correspong to methods, and contents are events to listen for.
   * @example <caption>MarkdownItRenderer.register(context)</caption>
   * const context = {
   *   hooks: {
   *     on: (event, callback) => { ... },
   *   },
   *   config: {
   *     [MarkdownItRenderer.configKey]: {
   *       ...,
   *       events: {
   *         callback: ['render-content', 'render-meta-description', 'render-search-results'],
   *         validateConfig: ['validate-config'],
   *       },
   *     },
   *   },
   * };
   * MarkdownItRenderer.register(context);
   * @static
   */
  static register(context) {
    if (!context || !context.hooks || typeof context.hooks.on !== 'function') {
      throw new Error("Missing event dispatcher in 'context.hooks.on(event, callback)' format.");
    }
    const config = { ...MarkdownItRenderer.defaultConfig(), ...context.config[MarkdownItRenderer.configKey] };
    if (!config.events) {
      throw new Error("Missing events to listen to for in 'config.events'.");
    }
    Object.keys(config.events).forEach((method) => {
      config.events[method].forEach((event) => context.hooks.on(event, MarkdownItRenderer[method]));
    });
  }

  /**
   * Renders Markdown for a provided string with a provided context.
   * @param {String} content - Markdown content to be converted to HTML.
   * @param {Object} context - A Uttori-like context.
   * @param {Object} context.config - A provided configuration to use.
   * @return {String} The rendered content.
   * @example <caption>MarkdownItRenderer.renderContent(content, context)</caption>
   * const context = {
   *   config: {
   *     [MarkdownItRenderer.configKey]: {
   *       ...,
   *     },
   *   },
   * };
   * MarkdownItRenderer.renderContent(content, context);
   * @static
   */
  static renderContent(content, context) {
    debug('renderContent');
    if (!context || !context.config || !context.config[MarkdownItRenderer.configKey]) {
      throw new Error('Missing configuration.');
    }
    const config = { ...MarkdownItRenderer.defaultConfig(), ...context.config[MarkdownItRenderer.configKey] };
    return MarkdownItRenderer.render(content, config);
  }

  /**
   * Renders Markdown for a collection of Uttori documents with a provided context.
   * @param {Object[]} collection - A collection of Uttori documents.
   * @param {Object} context - A Uttori-like context.
   * @param {Object} context.config - A provided configuration to use.
   * @return {Object[]}} The rendered documents.
   * @example <caption>MarkdownItRenderer.renderCollection(collection, context)</caption>
   * const context = {
   *   config: {
   *     [MarkdownItRenderer.configKey]: {
   *       ...,
   *     },
   *   },
   * };
   * MarkdownItRenderer.renderCollection(collection, context);
   * @static
   */
  static renderCollection(collection, context) {
    debug('renderCollection:', collection.length);
    if (!context || !context.config || !context.config[MarkdownItRenderer.configKey]) {
      throw new Error('Missing configuration.');
    }
    const config = { ...MarkdownItRenderer.defaultConfig(), ...context.config[MarkdownItRenderer.configKey] };
    return collection.map((document) => {
      const html = MarkdownItRenderer.render(document.html, config);
      return { ...document, html };
    });
  }

  /**
   * Renders Markdown for a provided string with a provided MarkdownIt configuration.
   * @param {String} content - Markdown content to be converted to HTML.
   * @param {Object} config - A provided MarkdownIt configuration to use.
   * @return {String} The rendered content.
   * @example <caption>MarkdownItRenderer.render(content, config)</caption>
   * const html = MarkdownItRenderer.render(content, config);
   * @static
   */
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
