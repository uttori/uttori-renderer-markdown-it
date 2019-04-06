const test = require('ava');
const MarkdownItRenderer = require('..');

test('Renderer: MarkdownIt: render(): can initilize without a config', (t) => {
  const renderer = new MarkdownItRenderer();
  t.is(renderer.render('![test](/test.png)'), '<p><img src="/test.png" alt="test"></p>');
});

test('Renderer: MarkdownIt: render(): can accept a config', (t) => {
  const renderer = new MarkdownItRenderer({ xhtmlOut: true });
  t.is(renderer.render('![test](/test.png)'), '<p><img src="/test.png" alt="test" /></p>');
});

test('Renderer: MarkdownIt: render(): handles empty values', (t) => {
  const renderer = new MarkdownItRenderer();
  t.is(renderer.render(''), '');
  t.is(renderer.render(null), '');
  t.is(renderer.render(NaN), '');
  t.is(renderer.render(undefined), '');
});

test('Renderer: MarkdownIt: render(): replaces missing links with a slugified link', (t) => {
  const renderer = new MarkdownItRenderer();
  t.is(renderer.render('[Test]'), '<p>[Test]</p>');
  t.is(renderer.render('[Test]()'), '<p><a href="/test">Test</a></p>');
  t.is(renderer.render('[CrAzY CaSe SpAcEd]()'), '<p><a href="/crazy-case-spaced">CrAzY CaSe SpAcEd</a></p>');
});
