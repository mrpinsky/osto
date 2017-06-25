import { expect } from 'chai';

import { DeltaStatic as Delta } from 'quill';
import { ossify, skeletonize, InlineBone, Skeleton } from '../src';

describe('ossification', () => {
  describe('inline elements', () => {
    it('should transform plain text into a simple p bone', () => {
      const delta: Delta = { insert: 'plain' };
      const bone: InlineBone = { type: 'text', text: 'plain' };
      expect(ossify(delta)).to.deep.equal(bone);
    });

    it('should transform hashtag deltas into hashtag bones', () => {
      const delta: Delta = { insert: { hashtag: 'hashtag' } };
      const bone: InlineBone = { type: 'hashtag', tag: 'hashtag' };
      expect(ossify(delta)).to.deep.equal(bone);
    });

    it('should transform at-mention deltas into at-mention bones', () => {
      const delta: Delta = {
        ops: [{ insert: { atmention: { id: 1 } } }],
      };
      const bone: InlineBone = { type: 'at', id: 1 };
      expect(ossify(delta)).to.deep.equal(bone);
    });

    it('should carry style attributes from deltas to bones', () => {
      const textDelta: Delta = {
        insert: 'styled text',
        attributes: { bold: true },
      };
      const hashtagDelta: Delta = {
        insert: { hashtag: 'styled hashtag' },
        attributes: { italic: true },
      };
      const atMentionDelta: Delta = {
        insert: { atmention: { id: 1 } },
        attributes: { bold: true, italic: true },
      };

      const textBone: InlineBone = {
        type: 'text',
        text: 'styled',
        attributes: { bold: true },
      };
      const hashtagBone: InlineBone = {
        type: 'hashtag',
        tag: 'styled hashtag',
        attributes: { italic: true },
      };
      const atMentionBone: InlineBone = {
        type: 'at',
        id: 1,
        attributes: { bold: true, italic: true },
      };

      expect(ossify(textDelta)).to.deep.equal(textBone);
      expect(ossify(hashtagDelta)).to.deep.equal(hashtagBone);
      expect(ossify(atMentionDelta)).to.deep.equal(atMentionBone);
    });
  });

  describe('block elements', () => {
    describe('paragraphs', () => {
      it('should transform plain text into a simple p bone', () => {
        const delta: Delta = {
          ops: [{ insert: 'plain\n' }],
        };
        const skeleton: Skeleton = [
          {
            type: 'p',
            bones: [{ type: 'text', text: 'plain' }],
          },
        ];
        expect(skeletonize(delta)).to.deep.equal(skeleton);
      });

      it('should transform plain text with line breaks into multiple p bones', () => {
        const delta: Delta = {
          ops: [{ insert: 'line\nbreaks\n' }],
        };
        const skeleton: Skeleton = [
          {
            type: 'p',
            bones: [{ type: 'text', text: 'line' }],
          },
          {
            type: 'p',
            bones: [{ type: 'text', text: 'breaks' }],
          },
        ];
        expect(skeletonize(delta)).to.deep.equal(skeleton);
      });

      it('should transform hashtag deltas into hashtag bones', () => {
        const delta: Delta = {
          ops: [{ insert: { hashtag: 'hashtag' } }, { insert: '\n' }],
        };
        const skeleton: Skeleton = [
          { type: 'p', bones: [{ type: 'hashtag', tag: 'hashtag' }] },
        ];
        expect(skeletonize(delta)).to.deep.equal(skeleton);
      });

      it('should transform at-mention deltas into at-mention bones', () => {
        const delta: Delta = {
          ops: [{ insert: { atmention: { id: 1 } } }, { insert: '\n' }],
        };
        const skeleton: Skeleton = [
          { type: 'p', bones: [{ type: 'at', id: 1 }] },
        ];
        expect(skeletonize(delta)).to.deep.equal(skeleton);
      });

      it('should parse paragraphs with multiple types of inline bones', () => {
        const delta: Delta = {
          ops: [
            { insert: 'text ' },
            { insert: { hashtag: 'hashtag' } },
            { insert: ' ' },
            { insert: { atmention: { id: 1 } } },
            { insert: '\n' },
          ],
        };

        const skeleton: Skeleton = [
          {
            type: 'p',
            bones: [
              { type: 'text', text: 'text' },
              { type: 'hashtag', tag: 'hashtag' },
              { type: 'text', text: ' ' },
              { type: 'at', id: 1 },
            ],
          },
        ];

        expect(skeletonize(delta)).to.deep.equal(skeleton);
      });
    });

    describe('lists', () => {
      it(
        'should transform sequences of ordered list ' +
          'items into a single ordered list bone block',
        () => {
          const delta: Delta = {
            ops: [
              { insert: 'foo' },
              { insert: '\n', attributes: { list: 'ordered' } },
              { insert: 'bar' },
              { insert: '\n', attributes: { list: 'ordered' } },
            ],
          };

          const skeleton: Skeleton = [
            {
              type: 'list',
              items: [
                [{ type: 'text', text: 'foo' }],
                [{ type: 'text', text: 'bar' }],
              ],
              ordered: true,
            },
          ];

          expect(skeletonize(delta)).to.deep.equal(skeleton);
        },
      );

      it(
        'should transform sequences of unordered list ' +
          'items into a single unordered list bone block',
        () => {
          const delta: Delta = {
            ops: [
              { insert: 'foo' },
              { insert: '\n', attributes: { list: 'unordered' } },
              { insert: 'bar' },
              { insert: '\n', attributes: { list: 'unordered' } },
            ],
          };

          const skeleton: Skeleton = [
            {
              type: 'list',
              items: [
                [{ type: 'text', text: 'foo' }],
                [{ type: 'text', text: 'bar' }],
              ],
              ordered: false,
            },
          ];

          expect(skeletonize(delta)).to.deep.equal(skeleton);
        },
      );

      it(
        'should transform sequences of list items with ' +
          'different types into adjacent list bone blocks',
        () => {
          const delta: Delta = {
            ops: [
              { insert: 'foo' },
              { insert: '\n', attributes: { list: 'ordered' } },
              { insert: 'bar' },
              { insert: '\n', attributes: { list: 'unordered' } },
            ],
          };

          const skeleton: Skeleton = [
            {
              type: 'list',
              items: [[{ type: 'text', text: 'foo' }]],
              ordered: true,
            },
            {
              type: 'list',
              items: [[{ type: 'text', text: 'bar' }]],
              ordered: false,
            },
          ];

          expect(skeletonize(delta)).to.deep.equal(skeleton);
        },
      );

      it('should accumulate multiple inline items into a single list item', () => {
        const delta: Delta = {
          ops: [
            { insert: 'text ' },
            { insert: { hashtag: 'hashtag' } },
            { insert: ' ' },
            { insert: { atmention: { id: 1 } } },
            { insert: '\n', attributes: { list: 'unordered' } },
          ],
        };

        const skeleton: Skeleton = [
          {
            type: 'list',
            items: [
              [
                { type: 'text', text: 'text ' },
                { type: 'hashtag', tag: 'hashtag' },
                { type: 'text', text: ' ' },
                { type: 'at', id: 1 },
              ],
            ],
            ordered: false,
          },
        ];

        expect(skeletonize(delta)).to.deep.equal(skeleton);
      });
    });

    describe('images', () => {
      it('should transform image deltas into trellis-image bones', () => {
        const delta: Delta = {
          ops: [{ insert: { image: 1 } }, { insert: '\n' }],
        };

        const skeleton: Skeleton = [{ type: 'image', id: 1 }];

        expect(skeletonize(delta)).to.deep.equal(skeleton);
      });
    });
  });

  describe('integration', () => {
    it('should handle deltas with all types of elements', () => {
      const delta: Delta = {};

      const skeleton: Skeleton = [
        {
          type: 'p',
          bones: [
            { type: 'text', text: 'text ', attributes: { italic: true } },
            { type: 'hashtag', tag: 'hashtag', attributes: { bold: true } },
            { type: 'at', id: 1, attributes: { underlined: true } },
          ],
        },
        {
          type: 'list',
          items: [
            [
              {
                type: 'text',
                text: 'foo',
                attributes: { strikethrough: true },
              },
            ],
            [{ type: 'hashtag', tag: 'hashtag' }],
            [{ type: 'at', id: 1 }],
          ],
          ordered: true,
        },
        {
          type: 'image',
          id: 1,
        },
        {
          type: 'list',
          items: [
            [{ type: 'at', id: 1 }],
            [{ type: 'hashtag', tag: 'hashtag' }],
            [{ type: 'text', text: 'foo' }],
          ],
          ordered: false,
        },
      ];

      expect(skeletonize(delta)).to.deep.equal(skeleton);
    });
  });
});
