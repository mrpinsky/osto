import { expect } from 'chai';

import { ossify, QuillOp, InlineBone } from '../src';

describe('ossification', () => {
  it('should transform plain text into a simple p bone', () => {
    const delta: QuillOp = { insert: 'plain' };
    const bones: InlineBone = { type: 'text', text: 'plain', attributes: {} };
    expect(ossify(delta)).to.deep.equal(bones);
  });

  it('should transform hashtag delta ops into hashtag bones', () => {
    const delta: QuillOp = { insert: { hashtag: 'hashtag' } };
    const bones: InlineBone = {
      type: 'hashtag',
      tag: 'hashtag',
      attributes: {},
    };
    expect(ossify(delta)).to.deep.equal(bones);
  });

  it('should transform at-mention delta ops into at-mention bones', () => {
    const delta: QuillOp = { insert: { atmention: { id: 1 } } };
    const bones: InlineBone = { type: 'at', id: 1, attributes: {} };
    expect(ossify(delta)).to.deep.equal(bones);
  });

  it('should carry style attributes from delta ops to bones', () => {
    const textDelta: QuillOp = {
      insert: 'styled text',
      attributes: { bold: true, link: 'example.com' },
    };
    const hashtagDelta: QuillOp = {
      insert: { hashtag: 'styled hashtag' },
      attributes: { italic: true },
    };
    const atMentionDelta: QuillOp = {
      insert: { atmention: { id: 1 } },
      attributes: { underline: true },
    };

    const textBone: InlineBone = {
      type: 'text',
      text: 'styled text',
      attributes: { bold: true, link: 'example.com' },
    };
    const hashtagBone: InlineBone = {
      type: 'hashtag',
      tag: 'styled hashtag',
      attributes: { italic: true },
    };
    const atMentionBone: InlineBone = {
      type: 'at',
      id: 1,
      attributes: { underline: true },
    };

    expect(ossify(textDelta)).to.deep.equal(textBone);
    expect(ossify(hashtagDelta)).to.deep.equal(hashtagBone);
    expect(ossify(atMentionDelta)).to.deep.equal(atMentionBone);
  });
});
