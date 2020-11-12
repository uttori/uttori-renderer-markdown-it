const fs = require('fs');
const MarkdownItRenderer = require('./src');

const config = {
  events: {
    renderContent: ['render-content'],
    renderCollection: ['render-search-results'],
    validateConfig: ['validate-config'],
  },

  // Uttori Specific Configuration
  uttori: {
    // Prefix for relative URLs, useful when the Express app is not at root.
    baseUrl: '',

    // Good Noodle List, f a domain is not in this list, it is set to 'external nofollow noreferrer'.
    allowedExternalDomains: [
      'eludevisibility.org',
      'sfc.fm',
      'snes.in',
      'superfamicom.org',
      'wiki.superfamicom.org',
    ],

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

try {
  const data = fs.readFileSync('./test.md', 'utf8');
  const output = MarkdownItRenderer.render(data, config);
  fs.writeFile('./test.html', output, () => {});
} catch (err) {
  console.error(err);
}
