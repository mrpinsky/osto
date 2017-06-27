import { TextBone } from './types';

export const tags = {
  bold: 'strong',
  italic: 'em',
  underline: 'u',
  superscript: 'sup',
  subscript: 'sub',
  strikethrough: 's',
};

export function debone(bone: TextBone): string {
  let retVal = bone.text;

  if ('attributes' in bone) {
    const color = bone.attributes.color;
    const colorStyle = color ? `color: ${color};` : '';
    const background = bone.attributes.background;
    const backgroundStyle = background
      ? `background-color: ${background};`
      : '';

    if (colorStyle.length + backgroundStyle.length > 0) {
      retVal = `<span style="${colorStyle + backgroundStyle}">${retVal}</span>`;
    }

    for (const attribute in bone.attributes) {
      if (bone.attributes[attribute]) {
        if (attribute in tags) {
          const tag = tags[attribute];
          retVal = `<${tag}>${retVal}</${tag}>`;
        } else if (attribute === 'script') {
          const tag = tags[bone.attributes.script + 'script'];
          retVal = `<${tag}>${retVal}</${tag}>`;
        } else if (attribute === 'link') {
          retVal = `<a href="${bone.attributes.link}">${retVal}</a>`;
        }
      }
    }
  }

  return retVal;
}
