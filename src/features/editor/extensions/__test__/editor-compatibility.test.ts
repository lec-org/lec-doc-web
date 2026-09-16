import { describe, expect, it } from 'vitest';
import { getSchema, generateJSON, generateHTML } from '@tiptap/core';
import { prosemirrorJSONToYDoc, yDocToProsemirrorJSON } from '@tiptap/y-tiptap';
import * as Y from 'yjs';
import { markdownToHtml, htmlToMarkdown } from '@lec/doc-editor';
import fixture from '@lec/doc-editor/fixtures/community-document.json';
import { mainExtensions } from '../extensions';

const schema = getSchema(mainExtensions);

describe('Web/Service 共用 Community 格式契约', () => {
  it('服务端 HTML/JSON 在真实 Web schema 中等价且可往返', () => {
    const expected = schema.nodeFromJSON(fixture.json);
    expected.check();
    expect(schema.nodeFromJSON(generateJSON(fixture.html, mainExtensions)).eq(expected)).toBe(true);
    expect(schema.nodeFromJSON(generateJSON(generateHTML(fixture.json, mainExtensions), mainExtensions)).eq(expected)).toBe(true);
  });

  it('Markdown 使用现有剪贴板转换器保留内容和标记', async () => {
    const html = await markdownToHtml(fixture.markdown);
    const parsed = schema.nodeFromJSON(generateJSON(html, mainExtensions));
    for (const part of fixture.texts) expect(parsed.textContent).toContain(part);
    expect(htmlToMarkdown(html)).toContain('**加粗**');
    expect(htmlToMarkdown(html)).toContain('## 乐程协作文档');
  });

  it('服务端 Ydoc 可被 Web 无损解码和重新编码', () => {
    const doc = new Y.Doc();
    Y.applyUpdate(doc, Uint8Array.from(atob(fixture.ydoc), (char) => char.charCodeAt(0)));
    const expected = schema.nodeFromJSON(fixture.json);
    expect(schema.nodeFromJSON(yDocToProsemirrorJSON(doc, 'default')).eq(expected)).toBe(true);
    const encoded = prosemirrorJSONToYDoc(schema, fixture.json, 'default');
    expect(schema.nodeFromJSON(yDocToProsemirrorJSON(encoded, 'default')).eq(expected)).toBe(true);
    encoded.destroy();
    doc.destroy();
  });
});
