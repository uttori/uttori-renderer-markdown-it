const test = require('ava');
const MarkdownItRenderer = require('../src');

test('MarkdownItRenderer.register(uttori): can register', (t) => {
  t.notThrows(() => {
    MarkdownItRenderer.register({ hooks: { on: () => {} } });
  });
});

test('MarkdownItRenderer.register(uttori): errors without event dispatcher', (t) => {
  t.throws(() => {
    MarkdownItRenderer.register({ hooks: {} });
  }, 'Missing event dispatcher in \'context.hooks.on(event, callback)\' format.');
});

test('MarkdownItRenderer.defaultConfig(): can return a default config', (t) => {
  t.notThrows(MarkdownItRenderer.defaultConfig);
});

test('MarkdownItRenderer.validateConfig(config, _uttori): can validate a config', (t) => {
  t.notThrows(MarkdownItRenderer.validateConfig);
  t.notThrows(() => {
    MarkdownItRenderer.validateConfig({ renderMarkdownIt: {} });
  });
});

test('MarkdownItRenderer.renderContent(content, context): can render without a config', (t) => {
  t.is(MarkdownItRenderer.renderContent('![test](/test.png)'), '<p><img src="/test.png" alt="test"></p>');
});

test('MarkdownItRenderer.renderContent(content, context): can accept a config', (t) => {
  t.is(MarkdownItRenderer.renderContent('![test](/test.png)', { config: { renderMarkdownIt: { xhtmlOut: true } } }), '<p><img src="/test.png" alt="test" /></p>');
});

test('MarkdownItRenderer.renderCollection(collection, context): can render without a config', (t) => {
  t.deepEqual(MarkdownItRenderer.renderCollection([{ html: '![test](/test.png)' }]), [{ html: '<p><img src="/test.png" alt="test"></p>' }]);
});

test('MarkdownItRenderer.renderCollection(collection, context): can accept a config', (t) => {
  t.deepEqual(MarkdownItRenderer.renderCollection([{ html: '![test](/test.png)' }], { config: { renderMarkdownIt: { xhtmlOut: true } } }), [{ html: '<p><img src="/test.png" alt="test" /></p>' }]);
});

test('MarkdownItRenderer.render(content, config): handles empty values', (t) => {
  t.is(MarkdownItRenderer.render(''), '');
  t.is(MarkdownItRenderer.render(' '), '');
  t.is(MarkdownItRenderer.render(null), '');
  t.is(MarkdownItRenderer.render(NaN), '');
  t.is(MarkdownItRenderer.render(undefined), '');
  t.is(MarkdownItRenderer.render(false), '');
  t.is(MarkdownItRenderer.render(), '');
});

test('MarkdownItRenderer.render(content, config): replaces missing links with a slugified link', (t) => {
  t.is(MarkdownItRenderer.render('[Test]'), '<p>[Test]</p>');
  t.is(MarkdownItRenderer.render('[Test]()'), '<p><a href="/test">Test</a></p>');
  t.is(MarkdownItRenderer.render('[CrAzY CaSe SpAcEd]()'), '<p><a href="/crazy-case-spaced">CrAzY CaSe SpAcEd</a></p>');
});
