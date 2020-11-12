## Functions

<dl>
<dt><a href="#getValue">getValue(token, key)</a> ⇒ <code>*</code> | <code>undefined</code></dt>
<dd></dd>
<dt><a href="#updateValue">updateValue(token, key, value)</a></dt>
<dd></dd>
<dt><a href="#Plugin">Plugin(md, pluginOptions)</a> ⇒ <code>object</code></dt>
<dd><p>Extend MarkdownIt with Uttori specific items:</p>
<ul>
<li>Table of Contents with <code>[toc]</code></li>
<li>External Links with Domain Filters</li>
</ul>
</dd>
</dl>

<a name="getValue"></a>

## getValue(token, key) ⇒ <code>\*</code> \| <code>undefined</code>
**Kind**: global function  
**Returns**: <code>\*</code> \| <code>undefined</code> - The read value or undefined.  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>Token</code> | The MarkdownIt token we are reading. |
| key | <code>string</code> | The key is the attribute name, like `src` or `href`. |

<a name="updateValue"></a>

## updateValue(token, key, value)
**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>Token</code> | The MarkdownIt token we are updating. |
| key | <code>string</code> | The key is the attribute name, like `src` or `href`. |
| value | <code>string</code> | The value we want to set to the provided key. |

<a name="Plugin"></a>

## Plugin(md, pluginOptions) ⇒ <code>object</code>
Extend MarkdownIt with Uttori specific items:
- Table of Contents with `[toc]`
- External Links with Domain Filters

**Kind**: global function  
**Returns**: <code>object</code> - The instance of Plugin.  

| Param | Type | Description |
| --- | --- | --- |
| md | <code>MarkdownIt</code> | The MarkdownIt instance. |
| pluginOptions | <code>object</code> | Options for the plugin instance. |

