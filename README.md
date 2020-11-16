[![view on npm](https://img.shields.io/npm/v/uttori-plugin-renderer-markdown-it.svg)](https://www.npmjs.org/package/uttori-plugin-renderer-markdown-it)
[![npm module downloads](https://img.shields.io/npm/dt/uttori-plugin-renderer-markdown-it.svg)](https://www.npmjs.org/package/uttori-plugin-renderer-markdown-it)
[![Build Status](https://travis-ci.org/uttori/uttori-plugin-renderer-markdown-it.svg?branch=master)](https://travis-ci.org/uttori/uttori-plugin-renderer-markdown-it)
[![Dependency Status](https://david-dm.org/uttori/uttori-plugin-renderer-markdown-it.svg)](https://david-dm.org/uttori/uttori-plugin-renderer-markdown-it)
[![Coverage Status](https://coveralls.io/repos/uttori/uttori-plugin-renderer-markdown-it/badge.svg?branch=master)](https://coveralls.io/r/uttori/uttori-plugin-renderer-markdown-it?branch=master)

# Uttori Renderer - Markdown - MarkdownIt

Uttori renderer support for Markdown powered by [MarkdownIt](https://markdown-it.github.io/).

It uses an internal plugin to allow adding a prefix, and properly handle external domains with `noreferrer nofollow`.

## Install

```bash
npm install --save @uttori/plugin-renderer-markdown-it
```

## Config

Configuration outside of registration events and Uttori specific items is avaliable by passing in [MarkdownIt](https://github.com/markdown-it/markdown-it#init-with-presets-and-options) config.

```js
{
  // Registration Events
  events: {
    renderContent: [],
    renderCollection: [],
    validateConfig: [],
  },

  // MarkdownIt Configuration
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

  // Any other supported MarkdownIt configuration
  ...,

  // Custom Values for Uttori Specific Use
  uttori: {
    // Prefix for relative URLs, useful when the Express app is not at root.
    baseUrl: '',

    // Good Noodle List, f a domain is not in this list, it is set to 'external nofollow noreferrer'.
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
}
```

* * *

## API Reference

<a name="MarkdownItRenderer"></a>

## MarkdownItRenderer
Uttori MarkdownIt Renderer

**Kind**: global class  

* [MarkdownItRenderer](#MarkdownItRenderer)
    * [.configKey](#MarkdownItRenderer.configKey) ⇒ <code>string</code>
    * [.defaultConfig()](#MarkdownItRenderer.defaultConfig) ⇒ <code>object</code>
    * [.validateConfig(config, _context)](#MarkdownItRenderer.validateConfig)
    * [.register(context)](#MarkdownItRenderer.register)
    * [.renderContent(content, context)](#MarkdownItRenderer.renderContent) ⇒ <code>string</code>
    * [.renderCollection(collection, context)](#MarkdownItRenderer.renderCollection) ⇒ <code>Array.&lt;object&gt;</code>
    * [.render(content, config)](#MarkdownItRenderer.render) ⇒ <code>string</code>

<a name="MarkdownItRenderer.configKey"></a>

### MarkdownItRenderer.configKey ⇒ <code>string</code>
The configuration key for plugin to look for in the provided configuration.

**Kind**: static property of [<code>MarkdownItRenderer</code>](#MarkdownItRenderer)  
**Returns**: <code>string</code> - The configuration key.  
**Example** *(MarkdownItRenderer.configKey)*  
```js
const config = { ...MarkdownItRenderer.defaultConfig(), ...context.config[MarkdownItRenderer.configKey] };
```
<a name="MarkdownItRenderer.defaultConfig"></a>

### MarkdownItRenderer.defaultConfig() ⇒ <code>object</code>
The default configuration.

**Kind**: static method of [<code>MarkdownItRenderer</code>](#MarkdownItRenderer)  
**Returns**: <code>object</code> - The configuration.  
**Example** *(MarkdownItRenderer.defaultConfig())*  
```js
const config = { ...MarkdownItRenderer.defaultConfig(), ...context.config[MarkdownItRenderer.configKey] };
```
<a name="MarkdownItRenderer.validateConfig"></a>

### MarkdownItRenderer.validateConfig(config, _context)
Validates the provided configuration for required entries.

**Kind**: static method of [<code>MarkdownItRenderer</code>](#MarkdownItRenderer)  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>object</code> | A configuration object. |
| config.configKey | <code>object</code> | A configuration object specifically for this plugin. |
| _context | <code>object</code> | Unused |

**Example** *(MarkdownItRenderer.validateConfig(config, _context))*  
```js
MarkdownItRenderer.validateConfig({ ... });
```
<a name="MarkdownItRenderer.register"></a>

### MarkdownItRenderer.register(context)
Register the plugin with a provided set of events on a provided Hook system.

**Kind**: static method of [<code>MarkdownItRenderer</code>](#MarkdownItRenderer)  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>object</code> | A Uttori-like context. |
| context.hooks | <code>object</code> | An event system / hook system to use. |
| context.hooks.on | <code>function</code> | An event registration function. |
| context.config | <code>object</code> | A provided configuration to use. |
| context.config.events | <code>object</code> | An object whose keys correspong to methods, and contents are events to listen for. |

**Example** *(MarkdownItRenderer.register(context))*  
```js
const context = {
  hooks: {
    on: (event, callback) => { ... },
  },
  config: {
    [MarkdownItRenderer.configKey]: {
      ...,
      events: {
        renderContent: ['render-content', 'render-meta-description'],
        renderCollection: ['render-search-results'],
        validateConfig: ['validate-config'],
      },
    },
  },
};
MarkdownItRenderer.register(context);
```
<a name="MarkdownItRenderer.renderContent"></a>

### MarkdownItRenderer.renderContent(content, context) ⇒ <code>string</code>
Renders Markdown for a provided string with a provided context.

**Kind**: static method of [<code>MarkdownItRenderer</code>](#MarkdownItRenderer)  
**Returns**: <code>string</code> - The rendered content.  

| Param | Type | Description |
| --- | --- | --- |
| content | <code>string</code> | Markdown content to be converted to HTML. |
| context | <code>object</code> | A Uttori-like context. |
| context.config | <code>object</code> | A provided configuration to use. |

**Example** *(MarkdownItRenderer.renderContent(content, context))*  
```js
const context = {
  config: {
    [MarkdownItRenderer.configKey]: {
      ...,
    },
  },
};
MarkdownItRenderer.renderContent(content, context);
```
<a name="MarkdownItRenderer.renderCollection"></a>

### MarkdownItRenderer.renderCollection(collection, context) ⇒ <code>Array.&lt;object&gt;</code>
Renders Markdown for a collection of Uttori documents with a provided context.

**Kind**: static method of [<code>MarkdownItRenderer</code>](#MarkdownItRenderer)  
**Returns**: <code>Array.&lt;object&gt;</code> - } The rendered documents.  

| Param | Type | Description |
| --- | --- | --- |
| collection | <code>Array.&lt;object&gt;</code> | A collection of Uttori documents. |
| context | <code>object</code> | A Uttori-like context. |
| context.config | <code>object</code> | A provided configuration to use. |

**Example** *(MarkdownItRenderer.renderCollection(collection, context))*  
```js
const context = {
  config: {
    [MarkdownItRenderer.configKey]: {
      ...,
    },
  },
};
MarkdownItRenderer.renderCollection(collection, context);
```
<a name="MarkdownItRenderer.render"></a>

### MarkdownItRenderer.render(content, config) ⇒ <code>string</code>
Renders Markdown for a provided string with a provided MarkdownIt configuration.

**Kind**: static method of [<code>MarkdownItRenderer</code>](#MarkdownItRenderer)  
**Returns**: <code>string</code> - The rendered content.  

| Param | Type | Description |
| --- | --- | --- |
| content | <code>string</code> | Markdown content to be converted to HTML. |
| config | <code>object</code> | A provided MarkdownIt configuration to use. |

**Example** *(MarkdownItRenderer.render(content, config))*  
```js
const html = MarkdownItRenderer.render(content, config);
```

* * *

## Tests

To run the test suite, first install the dependencies, then run `npm test`:

```bash
npm install
npm test
DEBUG=Uttori* npm test
```

## Contributors

* [Matthew Callis](https://github.com/MatthewCallis)

## License

* [MIT](LICENSE)
