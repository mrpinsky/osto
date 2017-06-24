import { expect } from 'chai';

import { DeltaStatic } from 'quill';
import { ossify, Skeleton } from '../src';

describe('ossification', () => {
  describe('block elements', () => {
    describe('paragraphs', () => {
      it('should transform plain text into a simple p bone', () => {
        const delta: DeltaStatic = {
          ops: [{ insert: 'plain' }],
        };
        const skeleton: Skeleton = [
          {
            type: 'p',
            bones: [{ type: 'text', text: 'plain', attributes: {} }],
            attributes: {},
          },
        ];
        expect(ossify(delta)).to.equal(skeleton);
      });

      it('should transform plain text with line breaks into multiple p bones');

      it('should transform hashtag deltas into hashtag bones');

      it('should transform at-mention deltas into at-mention bones');
    });

    describe('lists', () => {
      it('should handle ordered lists of plain text');
      it('should handle unordered lists plain text');
      it('should handle lists with at-mentions');
      it('should handle lists with hashtags');
      it('should handle lists with mixtures of inline bones');
    });

    describe('images', () => {
      it('should transform image deltas into trellis-image bones');
    });
  });

  it('everything mixed together');
});
