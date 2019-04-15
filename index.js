const MarkdownIt = require('markdown-it');
const slugify = require('slugify');

class MarkdownItRenderer {
  constructor(config = {}) {
    this.md = new MarkdownIt(config);
  }

  render(input) {
    input = input || '';
    // Remove empty links.
    input = input.replace('[]()', '');
    const missingLinks = input.match(/\[(.*)]\(\s?\)/g) || [];
    if (missingLinks && missingLinks.length > 0) {
      missingLinks.forEach((match) => {
        const title = match.substr(1).slice(0, -3);
        const slug = slugify(title, { lower: true });
        input = input.replace(match, `[${title}](/${slug})`);
      });
    }
    return this.md.render(input).trim();
  }
}

module.exports = MarkdownItRenderer;
