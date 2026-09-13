import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const page = (path) => readFileSync(new URL(`../dist/${path}`, import.meta.url), 'utf8');
const dist = new URL('../dist/', import.meta.url);

function htmlFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? htmlFiles(path) : entry.name.endsWith('.html') ? [path] : [];
  });
}

test('主要な静的ページを生成する', () => {
  for (const path of ['index.html', 'stores/index.html', 'stores/kanda/index.html', 'cases/index.html', 'cases/hermes-birkin/index.html', 'items/index.html', 'faq/index.html', 'contact/index.html']) {
    assert.equal(existsSync(new URL(`../dist/${path}`, import.meta.url)), true, `${path} が見つかりません`);
  }
});

test('GitHub Pages の base path を内部リンクとアセットに反映する', () => {
  const html = page('index.html');
  assert.match(html, /href="\/sample\/stores\/"/);
  assert.match(html, /src="\/sample\/images\/hero-shop\.png"/);
  assert.doesNotMatch(html, /href="\/stores\//);
});

test('トップの無料相談CTAをシックな赤系スタイルで表示する', () => {
  const html = page('index.html');
  assert.match(html, /class="consult-button"/);
  assert.match(html, /無料で相談する/);
  assert.match(html, /href="\/sample\/contact\/"/);
});

test('問い合わせフォームは外部サービス未接続の表示に留める', () => {
  const html = page('contact/index.html');
  assert.match(html, /Formspree/);
  assert.match(html, /送信機能は準備中です/);
  assert.doesNotMatch(html, /formspree\.io/);
  assert.match(html, /<button type="button"/);
});

test('ダミーであることを明示する', () => {
  assert.match(page('company/index.html'), /ダミー/);
  assert.match(page('privacy/index.html'), /ダミー/);
});

test('品目詳細に該当品目の買取実績と参考価格を表示する', () => {
  const brandPage = page('items/brand/index.html');
  const watchPage = page('items/watch/index.html');
  assert.match(brandPage, /ブランド品の買取実績/);
  assert.match(brandPage, /エルメス バーキン30をお買取りしました/);
  assert.match(brandPage, /参考価格 ¥1,280,000/);
  assert.match(watchPage, /腕時計の買取実績/);
  assert.match(watchPage, /ロレックス デイトジャストをお買取りしました/);
  assert.match(watchPage, /参考価格 ¥650,000/);
});

test('全内部リンクはGitHub Pages配下の生成ページを指す', () => {
  for (const file of htmlFiles(dist.pathname)) {
    const html = readFileSync(file, 'utf8');
    const hrefs = [...html.matchAll(/<a[^>]+href="([^"]+)"/g)].map((match) => match[1]);
    for (const href of hrefs.filter((href) => href.startsWith('/sample/'))) {
      const relativePath = href.replace('/sample/', '');
      const destination = new URL(`../dist/${relativePath}index.html`, import.meta.url);
      assert.equal(existsSync(destination), true, `${file} のリンク先 ${href} が見つかりません`);
    }
  }
});
