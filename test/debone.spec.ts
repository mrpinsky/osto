import { expect } from 'chai';

import { debone, tags } from '../src/debone';

describe('debone', () => {
  it('should extract plain text', () => {
    const bone = { type: 'text' as 'text', text: 'plain', attributes: {} };
    expect(debone(bone)).to.equal('plain');
  });

  it('should apply color and background styles, together and separately', () => {
    const color = {
      type: 'text' as 'text',
      text: 'color',
      attributes: { color: '#ff0000' },
    };
    const background = {
      type: 'text' as 'text',
      text: 'background',
      attributes: { background: '#00ff00' },
    };
    const both = {
      type: 'text' as 'text',
      text: 'both',
      attributes: { color: '#ff0000', background: '#00ff00' },
    };

    expect(debone(color)).to.equal(
      '<span style="color: #ff0000;">color</span>',
    );
    expect(debone(background)).to.equal(
      '<span style="background-color: #00ff00;">background</span>',
    );
    expect(debone(both)).to.equal(
      '<span style="color: #ff0000;background-color: #00ff00;">both</span>',
    );
  });

  for (const attribute of ['bold', 'italic', 'underline', 'strikethrough']) {
    it(`should apply ${attribute} tags`, () => {
      const bone = {
        type: 'text' as 'text',
        text: attribute,
        attributes: { [attribute]: true },
      };
      expect(debone(bone)).to.equal(
        `<${tags[attribute]}>${attribute}</${tags[attribute]}>`,
      );
    });
  }

  for (const script of ['super', 'sub']) {
    it(`should apply ${script}script tags`, () => {
      const bone = {
        type: 'text' as 'text',
        text: script,
        attributes: { script: script as 'super' | 'sub' },
      };
      expect(debone(bone)).to.equal(
        `<${tags[script + 'script']}>${script}</${tags[script + 'script']}>`,
      );
    });
  }

  it('should turn links into a elements with hrefs', () => {
    const bone = {
      type: 'text' as 'text',
      text: 'link',
      attributes: { link: 'example.com' },
    };
    expect(debone(bone)).to.equal('<a href="example.com">link</a>');
  });

  it('should handle multiple attributes', () => {
    const bone = {
      type: 'text' as 'text',
      text: 'multiple',
      attributes: {
        bold: true,
        italic: true,
        underline: true,
        strikethrough: true,
        script: 'super' as 'super',
        link: 'example.com',
        color: '#ff0000',
        background: '#00ff00',
      },
    };
    expect(debone(bone)).to.equal(
      '<a href="example.com">' +
        '<sup>' +
        '<s>' +
        '<u>' +
        '<em>' +
        '<strong>' +
        '<span style="color: #ff0000;background-color: #00ff00;">multiple</span>' +
        '</strong>' +
        '</em>' +
        '</u>' +
        '</s>' +
        '</sup>' +
        '</a>',
    );
  });
});
