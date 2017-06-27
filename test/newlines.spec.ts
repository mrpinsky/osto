import { expect } from 'chai';

import { isolateNewlines } from '../src/skeletonize';

describe('isolateNewlines', () => {
  it('should leave plain text alone', () => {
    const ops = [{ insert: 'text' }];

    const transformed = ops.map(op => Object.assign({ attributes: {} }, op));

    expect(isolateNewlines(ops)).to.deep.equal(transformed);
  });

  it('should leave non-newline whitespace alone', () => {
    const ops = [{ insert: ' foo bar ' }];

    const transformed = ops.map(op => Object.assign({ attributes: {} }, op));

    expect(isolateNewlines(ops)).to.deep.equal(transformed);
  });

  it('should pass on attributes when not splitting', () => {
    const ops = [{ insert: 'styled', attributes: { bold: true } }];

    const transformed = ops.map(op => Object.assign({ attributes: {} }, op));

    expect(isolateNewlines(ops)).to.deep.equal(transformed);
  });

  it('should leave special inlines alone', () => {
    const ops = [
      { insert: { hashtag: 'hashtag' }, attributes: { bold: true } },
      { insert: { atmention: { id: 1 } }, attributes: { italic: true } },
    ];

    const transformed = ops.map(op => Object.assign({ attributes: {} }, op));

    expect(isolateNewlines(ops)).to.deep.equal(transformed);
  });

  it('should leave existing newline ops alone', () => {
    const ops = [{ insert: '\n', attributes: { list: 'bullet' as 'bullet' } }];

    expect(isolateNewlines(ops)).to.deep.equal(ops);
  });

  it('should isolate newlines at the beginning of a text op', () => {
    const ops = [{ insert: '\nfoo' }];

    const transformed = [
      { insert: '\n', attributes: {} },
      { insert: 'foo', attributes: {} },
    ];

    expect(isolateNewlines(ops)).to.deep.equal(transformed);
  });

  it('should isolate newlines within a text op', () => {
    const ops = [{ insert: 'foo\nbar' }];

    const transformed = [
      { insert: 'foo', attributes: {} },
      { insert: '\n', attributes: {} },
      { insert: 'bar', attributes: {} },
    ];

    expect(isolateNewlines(ops)).to.deep.equal(transformed);
  });

  it('should isolate newlines at the end of a text op', () => {
    const ops = [{ insert: 'foo\n' }];

    const transformed = [
      { insert: 'foo', attributes: {} },
      { insert: '\n', attributes: {} },
    ];

    expect(isolateNewlines(ops)).to.deep.equal(transformed);
  });

  it('should pass on attributes when splitting', () => {
    const ops = [{ insert: '\nfoo\nbar\n', attributes: { bold: true } }];

    const transformed = [
      { insert: '\n', attributes: {} },
      { insert: 'foo', attributes: { bold: true } },
      { insert: '\n', attributes: {} },
      { insert: 'bar', attributes: { bold: true } },
      { insert: '\n', attributes: {} },
    ];

    expect(isolateNewlines(ops)).to.deep.equal(transformed);
  });
});
