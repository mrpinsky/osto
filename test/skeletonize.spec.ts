import { expect } from 'chai';

import { skeletonize, QuillDelta, Skeleton } from '../src';

describe('skeletonize', () => {
  describe('paragraphs', () => {
    it('should transform plain text into a simple p bone', () => {
      const delta: QuillDelta = {
        ops: [{ insert: 'plain\n' }],
      };
      const skeleton: Skeleton = [
        {
          type: 'p',
          contents: [{ type: 'text', text: 'plain', attributes: {} }],
        },
      ];
      expect(skeletonize(delta)).to.deep.equal(skeleton);
    });

    it('should transform plain text with line breaks into multiple p bones', () => {
      const delta: QuillDelta = {
        ops: [{ insert: 'line\nbreaks\n' }],
      };
      const skeleton: Skeleton = [
        {
          type: 'p',
          contents: [{ type: 'text', text: 'line', attributes: {} }],
        },
        {
          type: 'p',
          contents: [{ type: 'text', text: 'breaks', attributes: {} }],
        },
      ];
      expect(skeletonize(delta)).to.deep.equal(skeleton);
    });

    it('should transform hashtag deltas into hashtag bones', () => {
      const delta: QuillDelta = {
        ops: [{ insert: { hashtag: 'hashtag' } }, { insert: '\n' }],
      };
      const skeleton: Skeleton = [
        {
          type: 'p',
          contents: [{ type: 'hashtag', tag: 'hashtag', attributes: {} }],
        },
      ];
      expect(skeletonize(delta)).to.deep.equal(skeleton);
    });

    it('should transform at-mention deltas into at-mention bones', () => {
      const delta: QuillDelta = {
        ops: [{ insert: { atmention: { id: 1 } } }, { insert: '\n' }],
      };
      const skeleton: Skeleton = [
        { type: 'p', contents: [{ type: 'at', id: 1, attributes: {} }] },
      ];
      expect(skeletonize(delta)).to.deep.equal(skeleton);
    });

    it('should parse paragraphs with multiple types of inline bones', () => {
      const delta: QuillDelta = {
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
          contents: [
            { type: 'text', text: 'text', attributes: {} },
            { type: 'hashtag', tag: 'hashtag', attributes: {} },
            { type: 'text', text: ' ', attributes: {} },
            { type: 'at', id: 1, attributes: {} },
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
        const delta: QuillDelta = {
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
              [{ type: 'text', text: 'foo', attributes: {} }],
              [{ type: 'text', text: 'bar', attributes: {} }],
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
        const delta: QuillDelta = {
          ops: [
            { insert: 'foo' },
            { insert: '\n', attributes: { list: 'bullet' } },
            { insert: 'bar' },
            { insert: '\n', attributes: { list: 'bullet' } },
          ],
        };

        const skeleton: Skeleton = [
          {
            type: 'list',
            items: [
              [{ type: 'text', text: 'foo', attributes: {} }],
              [{ type: 'text', text: 'bar', attributes: {} }],
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
        const delta: QuillDelta = {
          ops: [
            { insert: 'foo' },
            { insert: '\n', attributes: { list: 'ordered' } },
            { insert: 'bar' },
            { insert: '\n', attributes: { list: 'bullet' } },
          ],
        };

        const skeleton: Skeleton = [
          {
            type: 'list',
            items: [[{ type: 'text', text: 'foo', attributes: {} }]],
            ordered: true,
          },
          {
            type: 'list',
            items: [[{ type: 'text', text: 'bar', attributes: {} }]],
            ordered: false,
          },
        ];

        expect(skeletonize(delta)).to.deep.equal(skeleton);
      },
    );

    it('should accumulate multiple inline items into a single list item', () => {
      const delta: QuillDelta = {
        ops: [
          { insert: 'text ' },
          { insert: { hashtag: 'hashtag' } },
          { insert: ' ' },
          { insert: { atmention: { id: 1 } } },
          { insert: '\n', attributes: { list: 'bullet' } },
        ],
      };

      const skeleton: Skeleton = [
        {
          type: 'list',
          items: [
            [
              { type: 'text', text: 'text ', attributes: {} },
              { type: 'hashtag', tag: 'hashtag', attributes: {} },
              { type: 'text', text: ' ', attributes: {} },
              { type: 'at', id: 1, attributes: {} },
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
      const delta: QuillDelta = {
        ops: [{ insert: { image: 1 } }, { insert: '\n' }],
      };

      const skeleton: Skeleton = [{ type: 'image', ref: 1 }];

      expect(skeletonize(delta)).to.deep.equal(skeleton);
    });
  });
});

describe('integration', () => {
  it('should handle deltas with all types of elements', () => {
    const delta: QuillDelta = {
      ops: [
        { insert: 'text', attributes: { italic: true } },
        { insert: { hashtag: 'hashtag' }, attributes: { bold: true } },
        { insert: { atmention: { id: 1 }, attributes: { underlined: true } } },
        { insert: '\n' },
        { insert: 'foo', attributes: { strikethrough: true } },
        { insert: '\n', attributes: { list: 'ordered' } },
        { insert: { hashtag: 'hashtag' } },
        { insert: '\n', attributes: { list: 'ordered' } },
        { insert: { atmention: { id: 1 } } },
        { insert: '\n', attributes: { list: 'ordered' } },
        { insert: { image: 1 } },
        { insert: '\nfoo', attributes: { strikethrough: true } },
        { insert: '\n', attributes: { list: 'bullet' } },
        { insert: { hashtag: 'hashtag' } },
        { insert: '\n', attributes: { list: 'bullet' } },
        { insert: { atmention: { id: 1 } } },
        { insert: '\n', attributes: { list: 'bullet' } },
      ],
    };

    const skeleton: Skeleton = [
      {
        type: 'p',
        contents: [
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
          [{ type: 'hashtag', tag: 'hashtag', attributes: {} }],
          [{ type: 'at', id: 1, attributes: {} }],
        ],
        ordered: true,
      },
      {
        type: 'image',
        ref: 1,
      },
      {
        type: 'list',
        items: [
          [{ type: 'at', id: 1, attributes: {} }],
          [{ type: 'hashtag', tag: 'hashtag', attributes: {} }],
          [{ type: 'text', text: 'foo', attributes: {} }],
        ],
        ordered: false,
      },
    ];

    expect(skeletonize(delta)).to.deep.equal(skeleton);
  });
});
