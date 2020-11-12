const debug = require('debug')('Uttori.Plugin.Render.MarkdownIt');
const MarkdownIt = require('markdown-it');
const slugify = require('slugify');
const markdownItPlugin = require('./markdown-it-plugin');
/**
 * Uttori MarkdownIt Renderer
 *
 * @example <caption>MarkdownItRenderer</caption>
 * const content = MarkdownItRenderer.render("...");
 * @class
 */
class MarkdownItRenderer {
  /**
   * The configuration key for plugin to look for in the provided configuration.
   *
   * @type {string}
   * @returns {string} The configuration key.
   * @example <caption>MarkdownItRenderer.configKey</caption>
   * const config = { ...MarkdownItRenderer.defaultConfig(), ...context.config[MarkdownItRenderer.configKey] };
   * @static
   */
  static get configKey() {
    return 'uttori-plugin-renderer-markdown-it';
  }

  /**
   * The default configuration.
   *
   * @returns {object} The configuration.
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

      // Custom Values for Uttori Specific Use
      uttori: {
        // Prefix for relative URLs, useful when the Express app is not at root.
        baseUrl: '',

        // Allowed External Domains, if a domain is not in this list, it is set to 'nofollow'.
        // Values should be strings of the hostname portion of the URL object, https://nodejs.org/api/url.html#url_url_hostname
        allowedExternalDomains: [],

        // Open external domains in a new window.
        openNewWindow: true,

        // Table of Contents
        toc: {
          // The opening DOM tag for the TOC container.
          openingTag: '<nav class="table-of-contents">',

          // The closing DOM tag for the TOC container.
          closingTag: '</nav>',

          // Slugify options for convering content to anchor links.
          slugify: {
            lower: true,
          },
        },
      },
    };
  }

  /**
   * Validates the provided configuration for required entries.
   *
   * @param {object} config - A configuration object.
   * @param {object} config.configKey - A configuration object specifically for this plugin.
   * @param {object} _context - Unused
   * @example <caption>MarkdownItRenderer.validateConfig(config, _context)</caption>
   * MarkdownItRenderer.validateConfig({ ... });
   * @static
   */
  static validateConfig(config, _context) {
    debug('Validating config...');
    if (!config || !config[MarkdownItRenderer.configKey]) {
      throw new Error(`MarkdownItRenderer Config Warning: '${MarkdownItRenderer.configKey}' configuration key is missing.`);
    }
    if (!config[MarkdownItRenderer.configKey].uttori) {
      throw new Error('MarkdownItRenderer Config Warning: \'uttori\' configuration key is missing.');
    }
    if (!Array.isArray(config[MarkdownItRenderer.configKey].uttori.allowedExternalDomains)) {
      throw new TypeError('MarkdownItRenderer Config Warning: \'uttori.allowedExternalDomains\' is missing or not an array.');
    }
    debug('Validated config.');
  }

  /**
   * Register the plugin with a provided set of events on a provided Hook system.
   *
   * @param {object} context - A Uttori-like context.
   * @param {object} context.hooks - An event system / hook system to use.
   * @param {Function} context.hooks.on - An event registration function.
   * @param {object} context.config - A provided configuration to use.
   * @param {object} context.config.events - An object whose keys correspong to methods, and contents are events to listen for.
   * @example <caption>MarkdownItRenderer.register(context)</caption>
   * const context = {
   *   hooks: {
   *     on: (event, callback) => { ... },
   *   },
   *   config: {
   *     [MarkdownItRenderer.configKey]: {
   *       ...,
   *       events: {
   *         renderContent: ['render-content', 'render-meta-description'],
   *         renderCollection: ['render-search-results'],
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
    const config = {
      ...MarkdownItRenderer.defaultConfig(),
      ...context.config[MarkdownItRenderer.configKey],
      uttori: {
        ...MarkdownItRenderer.defaultConfig().uttori,
        ...context.config[MarkdownItRenderer.configKey].uttori,
      },
    };
    if (!config.events) {
      throw new Error("Missing events to listen to for in 'config.events'.");
    }
    Object.keys(config.events).forEach((method) => {
      config.events[method].forEach((event) => {
        if (typeof MarkdownItRenderer[method] !== 'function') {
          debug(`Missing function "${method}" for key "${event}"`);
          return;
        }
        context.hooks.on(event, MarkdownItRenderer[method]);
      });
    });
  }

  /**
   * Renders Markdown for a provided string with a provided context.
   *
   * @param {string} content - Markdown content to be converted to HTML.
   * @param {object} context - A Uttori-like context.
   * @param {object} context.config - A provided configuration to use.
   * @returns {string} The rendered content.
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
    const config = {
      ...MarkdownItRenderer.defaultConfig(),
      ...context.config[MarkdownItRenderer.configKey],
      uttori: {
        ...MarkdownItRenderer.defaultConfig().uttori,
        ...context.config[MarkdownItRenderer.configKey].uttori,
      },
    };
    return MarkdownItRenderer.render(content, config);
  }

  /**
   * Renders Markdown for a collection of Uttori documents with a provided context.
   *
   * @param {object[]} collection - A collection of Uttori documents.
   * @param {object} context - A Uttori-like context.
   * @param {object} context.config - A provided configuration to use.
   * @returns {object[]}} The rendered documents.
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
    const config = {
      ...MarkdownItRenderer.defaultConfig(),
      ...context.config[MarkdownItRenderer.configKey],
      uttori: {
        ...MarkdownItRenderer.defaultConfig().uttori,
        ...context.config[MarkdownItRenderer.configKey].uttori,
      },
    };
    return collection.map((document) => {
      const html = MarkdownItRenderer.render(document.html, config);
      return { ...document, html };
    });
  }

  /**
   * Renders Markdown for a provided string with a provided MarkdownIt configuration.
   *
   * @param {string} content - Markdown content to be converted to HTML.
   * @param {object} config - A provided MarkdownIt configuration to use.
   * @returns {string} The rendered content.
   * @example <caption>MarkdownItRenderer.render(content, config)</caption>
   * const html = MarkdownItRenderer.render(content, config);
   * @static
   */
  static render(content, config) {
    if (!content) {
      debug('No input provided, returning a blank string.');
      return '';
    }

    const md = new MarkdownIt(config).use(markdownItPlugin);

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
