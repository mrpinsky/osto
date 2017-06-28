import { expect } from 'chai';

import { deboneText, tags } from '../src/debone';

describe('debone', () => {
  describe('inline', () => {
    describe('text', () => {
      describe('to HTML', () => {
        it('should extract plain text', () => {
          const bone = {
            type: 'text' as 'text',
            text: 'plain',
            attributes: {},
          };
          expect(deboneText(bone)).to.equal('plain');
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

          expect(deboneText(color)).to.equal(
            '<span style="color: #ff0000;">color</span>',
          );
          expect(deboneText(background)).to.equal(
            '<span style="background-color: #00ff00;">background</span>',
          );
          expect(deboneText(both)).to.equal(
            '<span style="color: #ff0000;background-color: #00ff00;">both</span>',
          );
        });

        for (const attribute of [
          'bold',
          'italic',
          'underline',
          'strikethrough',
        ]) {
          it(`should apply ${attribute} tags`, () => {
            const bone = {
              type: 'text' as 'text',
              text: attribute,
              attributes: { [attribute]: true },
            };
            expect(deboneText(bone)).to.equal(
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
            expect(deboneText(bone)).to.equal(
              `<${tags[script + 'script']}>${script}</${tags[
                script + 'script'
              ]}>`,
            );
          });
        }

        it('should turn links into a elements with hrefs', () => {
          const bone = {
            type: 'text' as 'text',
            text: 'link',
            attributes: { link: 'example.com' },
          };
          expect(deboneText(bone)).to.equal('<a href="example.com">link</a>');
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
          expect(deboneText(bone)).to.equal(
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

      describe('to plain text', () => {
        it('should ignore all styling', () => {
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

          expect(deboneText(bone, 'plain')).to.equal('multiple');
        });
      });
    });

    describe('hashtag', () => {
      it('needs tests');
    });

    describe('at-mention', () => {
      it('needs tests');
    });
  });

  describe('block', () => {
    describe('p', () => {
      it('needs tests');
    });

    describe('list', () => {
      it('needs tests');
    });

    describe('image', () => {
      it('needs tests');
    });
  });

  describe('skeleton', () => {
    it('needs tests');
  });
});
