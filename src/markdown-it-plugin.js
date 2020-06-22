/* eslint-disable prefer-destructuring */
const getValue = (token, key) => {
  let value;
  token.attrs.forEach((attribute) => {
    /* istanbul ignore else */
    if (attribute[0] === key) {
      value = attribute[1];
    }
  });
  return value;
};

const updateValue = (token, key, value) => {
  let found;
  token.attrs.forEach((attribute) => {
    if (attribute[0] === key) {
      attribute[1] = value;
      found = true;
    }
  });
  if (!found) {
    token.attrs.push([key, value]);
  }
};

const Plugin = (md, pluginOptions) => {
  md.core.ruler.after('inline', 'uttori', (state) => {
    let options;

    // Find Options, `new MarkdownIt({ ..., uttori: { ... } })` or `.use({ ... })`
    /* istanbul ignore next */
    if (md.options.uttori) {
      options = md.options.uttori;
    } else if (pluginOptions) {
      options = pluginOptions;
    } else {
      return false;
    }

    state.tokens.forEach((blockToken) => {
      if (blockToken.type === 'inline' && blockToken.children) {
        // https://markdown-it.github.io/markdown-it/#Token
        blockToken.children.forEach((token) => {
          switch (token.type) {
            // case 'image': {
            //   // set all images to 200px width except for foo.gif
            //   if (token.attrObj.src !== 'foo.gif') {
            //     token.attrObj.width = '200px';
            //   }
            //   break;
            // }
            case 'link_open': {
              const href = getValue(token, 'href');
              /* istanbul ignore else */
              if (href) {
                // Absolute URLs
                if (href.startsWith('http://') || href.startsWith('https://')) {
                  const url = new URL(href);
                  // If a domain is not in this list, it is set to 'nofollow'.
                  if (options.allowedExternalDomains.includes(url.hostname)) {
                    updateValue(token, 'rel', 'external');
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
};

module.exports = Plugin;
