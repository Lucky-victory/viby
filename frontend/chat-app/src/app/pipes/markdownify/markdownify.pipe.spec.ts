import { MarkdownifyPipe } from './markdownify.pipe';

describe('MarkdownifyPipe', () => {
  it('create an instance', () => {
    const pipe = new MarkdownifyPipe();
    expect(pipe).toBeTruthy();
  });
});
