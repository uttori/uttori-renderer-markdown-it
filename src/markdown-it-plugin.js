const MarkdownIt = require('markdown-it');
const Token = require('markdown-it/lib/token');
const slugify = require('slugify');

/**
 * @param {Token} token - The MarkdownIt token we are reading.
 * @param {string} key - The key is the attribute name, like `src` or `href`.
 * @returns {*|undefined} The read value or undefined.
 */
const getValue = (token, key) => {
  let value;
  token.attrs.forEach((attribute) => {
    // Parameter is set, read it.
    /* istanbul ignore else */
    if (attribute[0] === key) {
      /* eslint-disable prefer-destructuring */
      value = attribute[1];
    }
  });
  // Parameter is not set, return undefined.
  return value;
};

/**
 * @param {Token} token - The MarkdownIt token we are updating.
 * @param {string} key - The key is the attribute name, like `src` or `href`.
 * @param {string} value - The value we want to set to the provided key.
 */
const updateValue = (token, key, value) => {
  let found;
  token.attrs.forEach((attribute) => {
    // Parameter is set, change it.
    if (attribute[0] === key) {
      attribute[1] = value;
      found = true;
    }
  });
  // Parameter is not set, add it.
  if (!found) {
    token.attrs.push([key, value]);
  }
};

/**
 * Extend MarkdownIt with Uttori specific items:
 * - Table of Contents with `[toc]`
 * - External Links with Domain Filters
 *
 * @param {MarkdownIt} md - The MarkdownIt instance.
 * @param {object} pluginOptions - Options for the plugin instance.
 * @returns {object} The instance of Plugin.
 */
function Plugin(md, pluginOptions = {}) {
  const headings = [];

  // Find Options, `new MarkdownIt({ ..., uttori: { ... } })` or `.use({ ... })`
  let options = {};
  /* istanbul ignore next */
  if (md.options.uttori) {
    options = md.options.uttori;
  } else if (pluginOptions) {
    options = pluginOptions;
  } else {
    return false;
  }

  /**
   * Adds deep links to the opening of the heading tags with IDs.
   *
   * @param {Token[]} tokens - Collection of tokens.
   * @param {number} index  - The index of the current token in the Tokens array.
   * @returns {string} The modified header tag with ID.
   */
  md.renderer.rules.heading_open = (tokens, index) => {
    // The opening tag itself (#, ##, etc.)
    const { tag } = tokens[index];
    // The text content inside of that tag (# Heading, Heading in this example)
    const label = tokens[index + 1];
    // Guard against empty headers
    if (label.type === 'inline' && label.children[0]) {
      // We want to use slugify to provide nicer deep links
      const slug = slugify(label.children[0].content, options.toc.slugify);
      // Return the new tag HTML
      return `<${tag} id="${slug}-${label.map[0]}">`;
    }
    return `<${tag}>`;
  };

  /**
   * Creates the opening tag of the TOC.
   *
   * @param {Token[]} _tokens - Collection of tokens.
   * @param {number} _index  - The index of the current token in the Tokens array.
   * @returns {string} The opening tag of the TOC.
   */
  md.renderer.rules.toc_open = (_tokens, _index) => options.toc.openingTag;

  /**
   * Creates the closing tag of the TOC.
   *
   * @param {Token[]} _tokens - Collection of tokens.
   * @param {number} _index  - The index of the current token in the Tokens array.
   * @returns {string} The closing tag of the TOC.
   */
  md.renderer.rules.toc_close = (_tokens, _index) => options.toc.closingTag;

  /**
   * Creates the contents of the TOC.
   *
   * @param {Token[]} _tokens - Collection of tokens.
   * @param {number} _index  - The index of the current token in the Tokens array.
   * @returns {string} The contents tag of the TOC.
   */
  md.renderer.rules.toc_body = (_tokens, _index) => {
    let indent_level = 0;

    // Reduce the headers down into a string of the TOC
    const list = headings.reduce((accumulator, heading) => {
      // Increase / Decrease depth of nesting
      if (heading.level > indent_level) {
        const level_diff = (heading.level - indent_level);
        for (let i = 0; i < level_diff; i++) {
          accumulator += '<ul>';
          indent_level++;
        }
      } else if (heading.level < indent_level) {
        const level_diff = (indent_level - heading.level);
        for (let i = 0; i < level_diff; i++) {
          accumulator += '</ul>';
          indent_level--;
        }
      }
      // New item at the current level
      accumulator += `<li><a href="#${heading.slug}-${heading.index}" title="${heading.content}">${heading.content}</a></li>`;
      return accumulator;
    }, '');

    // Add the ending tags at the number of indent levels nested
    let output = `${list}${'</ul>'.repeat(indent_level)}`;

    // Remove empty nesting levels that result from missing levels, such as no H1 tags.
    while (output.includes('<ul><ul>')) {
      output = output.replace('<ul><ul>', '<ul>');
      output = output.replace('</ul></ul>', '</ul>');
    }
    return output;
  };

  /**
   * Caches the headers for use in building the TOC body.
   *
   * @param {object} state - State of MarkdownIt.
   */
  md.core.ruler.push('collect_headers', (state) => {
    // Create a mapping of all the headers, their indentation level, content and slug.
    state.tokens.forEach((token, i, tokens) => {
      if (token.type === 'heading_close') {
        const heading = tokens[i - 1];
        headings.push({
          content: heading.content,
          index: heading.map[0],
          level: +token.tag.slice(1, 2),
          slug: slugify(heading.content, options.toc.slugify),
        });
      }
    });
  });

  /**
   * Find and replace the TOC tag with the TOC itself.
   *
   * @param {object} state - State of MarkdownIt.
   * @param {boolean} silent - State of MarkdownIt.
   */
  md.inline.ruler.after('emphasis', 'toc', (state, silent) => {
    // Don't run any pairs in validation mode
    /* istanbul ignore next */
    if (silent) {
      return false;
    }

    // If the token does not start with `[` it cannot be `[toc]`
    if (state.src.charCodeAt(state.pos) !== 0x5B /* [ */) {
      return false;
    }

    const match = /^\[toc]$/im.exec(state.src) || [];
    if (!match || match.length === 0 || match[0] !== '[toc]') {
      return false;
    }

    let token;
    token = state.push('toc_open', 'toc', 1);
    token.markup = '[toc]';

    token = state.push('toc_body', '', 0);
    token.content = '';

    token = state.push('toc_close', 'toc', -1);

    // Update the position and continue parsing.
    const newline = state.src.indexOf('\n', state.pos);
    /* istanbul ignore next */
    state.pos = (newline !== -1) ? newline : state.pos + state.posMax + 1;

    return true;
  });

  /**
   * Uttori specific rules for manipulating the markup.
   *
   * External Domains are filtered for SEO and security.
   *
   * @param {object} state - State of MarkdownIt.
   */
  md.core.ruler.after('inline', 'uttori', (state) => {
    state.tokens.forEach((blockToken) => {
      if (blockToken.type === 'inline' && blockToken.children) {
        // https://markdown-it.github.io/markdown-it/#Token
        blockToken.children.forEach((token) => {
          switch (token.type) {
            case 'link_open': {
              const href = getValue(token, 'href');
              /* istanbul ignore else */
              if (href) {
                // Absolute URLs
                if (href.startsWith('http://') || href.startsWith('https://')) {
                  const url = new URL(href);
                  // If a domain is not in this list, it is set to 'nofollow'.
                  if (options.allowedExternalDomains.includes(url.hostname)) {
                    updateValue(token, 'rel', 'external noopener noreferrer');
                  } else {
                    updateValue(token, 'rel', 'external nofollow noreferrer');
                  }
                  // Open external domains in a new window.
                  if (options.openNewWindow) {
                    updateValue(token, 'target', '_blank');
                  }
                } else {
                  // Prefix for relative URLs
                  // eslint-disable-next-line no-lonely-if
                  if (options.baseUrl) {
                    updateValue(token, 'href', `${options.baseUrl}${href}`);
                  }
                }
              }
              break;
            }
            default:
              break;
          }
        });
      }
    });

    return false;
  });

  return this;
}

module.exports = Plugin;
