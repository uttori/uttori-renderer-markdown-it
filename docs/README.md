# Uttori Renderer - Markdown - MarkdownIt

Uttori renderer support for Markdown powered by [MarkdownIt](https://markdown-it.github.io/).

## Install

```bash
npm install --save uttori-plugin-generator-sitemap
```

## Config

The only supported config is passing in [MarkdownIt](https://github.com/markdown-it/markdown-it#init-with-presets-and-options) config.

* * *

## API Reference

<a name="MarkdownItRenderer"></a>

## MarkdownItRenderer
Uttori MarkdownIt Renderer

**Kind**: global class  

* [MarkdownItRenderer](#MarkdownItRenderer)
    * [.configKey](#MarkdownItRenderer.configKey) ⇒ <code>String</code>
    * [.defaultConfig()](#MarkdownItRenderer.defaultConfig) ⇒ <code>Object</code>
    * [.validateConfig(config)](#MarkdownItRenderer.validateConfig)
    * [.register(context)](#MarkdownItRenderer.register)
    * [.renderContent(content, context)](#MarkdownItRenderer.renderContent) ⇒ <code>String</code>
    * [.renderCollection(collection, context)](#MarkdownItRenderer.renderCollection) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.render(content, config)](#MarkdownItRenderer.render) ⇒ <code>String</code>

<a name="MarkdownItRenderer.configKey"></a>

### MarkdownItRenderer.configKey ⇒ <code>String</code>
The configuration key for plugin to look for in the provided configuration.

**Kind**: static property of [<code>MarkdownItRenderer</code>](#MarkdownItRenderer)  
**Returns**: <code>String</code> - The configuration key.  
**Example** *(MarkdownItRenderer.configKey)*  
```js
const config = { ...MarkdownItRenderer.defaultConfig(), ...context.config[MarkdownItRenderer.configKey] };
```
<a name="MarkdownItRenderer.defaultConfig"></a>

### MarkdownItRenderer.defaultConfig() ⇒ <code>Object</code>
The default configuration.

**Kind**: static method of [<code>MarkdownItRenderer</code>](#MarkdownItRenderer)  
**Returns**: <code>Object</code> - The configuration.  
**Example** *(MarkdownItRenderer.defaultConfig())*  
```js
const config = { ...MarkdownItRenderer.defaultConfig(), ...context.config[MarkdownItRenderer.configKey] };
```
<a name="MarkdownItRenderer.validateConfig"></a>

### MarkdownItRenderer.validateConfig(config)
Validates the provided configuration for required entries.

**Kind**: static method of [<code>MarkdownItRenderer</code>](#MarkdownItRenderer)  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> | A configuration object. |
| config[MarkdownItRenderer.configKey | <code>Object</code> | A configuration object specifically for this plugin. |

**Example** *(MarkdownItRenderer.validateConfig(config, _context))*  
```js
SitemapGenerator.validateConfig({ ... });
```
<a name="MarkdownItRenderer.register"></a>

### MarkdownItRenderer.register(context)
Register the plugin with a provided set of events on a provided Hook system.

**Kind**: static method of [<code>MarkdownItRenderer</code>](#MarkdownItRenderer)  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Object</code> | A Uttori-like context. |
| context.hooks | <code>Object</code> | An event system / hook system to use. |
| context.hooks.on | <code>function</code> | An event registration function. |
| context.config | <code>Object</code> | A provided configuration to use. |
| context.config.events | <code>Object</code> | An object whose keys correspong to methods, and contents are events to listen for. |

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
        callback: ['render-content', 'render-meta-description', 'render-search-results'],
        validateConfig: ['validate-config'],
      },
    },
  },
};
MarkdownItRenderer.register(context);
```
<a name="MarkdownItRenderer.renderContent"></a>

### MarkdownItRenderer.renderContent(content, context) ⇒ <code>String</code>
Renders Markdown for a provided string with a provided context.

**Kind**: static method of [<code>MarkdownItRenderer</code>](#MarkdownItRenderer)  
**Returns**: <code>String</code> - The rendered content.  

| Param | Type | Description |
| --- | --- | --- |
| content | <code>String</code> | Markdown content to be converted to HTML. |
| context | <code>Object</code> | A Uttori-like context. |
| context.config | <code>Object</code> | A provided configuration to use. |

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

### MarkdownItRenderer.renderCollection(collection, context) ⇒ <code>Array.&lt;Object&gt;</code>
Renders Markdown for a collection of Uttori documents with a provided context.

**Kind**: static method of [<code>MarkdownItRenderer</code>](#MarkdownItRenderer)  
**Returns**: <code>Array.&lt;Object&gt;</code> - } The rendered documents.  

| Param | Type | Description |
| --- | --- | --- |
| collection | <code>Array.&lt;Object&gt;</code> | A collection of Uttori documents. |
| context | <code>Object</code> | A Uttori-like context. |
| context.config | <code>Object</code> | A provided configuration to use. |

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

### MarkdownItRenderer.render(content, config) ⇒ <code>String</code>
Renders Markdown for a provided string with a provided MarkdownIt configuration.

**Kind**: static method of [<code>MarkdownItRenderer</code>](#MarkdownItRenderer)  
**Returns**: <code>String</code> - The rendered content.  

| Param | Type | Description |
| --- | --- | --- |
| content | <code>String</code> | Markdown content to be converted to HTML. |
| config | <code>Object</code> | A provided MarkdownIt configuration to use. |

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
