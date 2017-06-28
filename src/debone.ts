import {
  InlineBone,
  AtMentionBone,
  HashtagBone,
  TextBone,
  ParagraphBone,
  ListBone,
  TrellisImageBone,
  Skeleton,
} from './types';

export type Format = 'html' | 'plain';

export const tags = {
  bold: 'strong',
  italic: 'em',
  underline: 'u',
  superscript: 'sup',
  subscript: 'sub',
  strikethrough: 's',
};

export function deboneText(bone: TextBone, format: Format = 'html'): string {
  let retVal = bone.text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  if (format === 'html' && 'attributes' in bone) {
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

export function deboneHashtag(bone: HashtagBone, format: Format): string {
  return deboneText(
    { type: 'text', text: `#${bone.tag}`, attributes: bone.attributes },
    format,
  );
}

export function deboneAtMention(bone: AtMentionBone, format: Format): string {
  return deboneText(
    { type: 'text', text: `@id:${bone.id}`, attributes: bone.attributes },
    format,
  );
}

export function deboneInline(bone: InlineBone, format: Format): string {
  switch (bone.type) {
    case 'text':
      return deboneText(bone, format);
    case 'hashtag':
      return deboneHashtag(bone, format);
    case 'at':
      return deboneAtMention(bone, format);
    default:
      ((x: never) => {
        throw new Error(`Invalid inline bone: ${bone}`);
      })(bone);
  }
}

export function deboneP(p: ParagraphBone, format: Format): string {
  const contents = p.contents
    .map(bone => deboneInline(bone, format))
    .reduce((acc: string, curr: string) => acc.concat(curr));

  return format === 'html' ? `<p>${contents}</p>` : contents;
}

export function deboneList(list: ListBone, format: Format): string {
  let items: string[] = list.items.map((item, index) => {
    const li = item.map(bone => deboneInline(bone, format)).join('');

    if (format === 'html') {
      return `<li>${li}</li>`;
    } else {
      return `  ${list.list === 'ordered' ? index + '.' : '-'} ${li}`;
    }
  });

  if (format === 'html') {
    const tag = list.list === 'ordered' ? 'ol' : 'ul';
    return `<${tag}>${items.join('')}</${tag}>`;
  } else {
    return items.join('\n');
  }
}

export function deboneImage(image: TrellisImageBone, format: Format): string {
  return `IMAGE {image.ref}`;
}

export function debone(skeleton: Skeleton, format: Format): string {
  return skeleton
    .map(bone => {
      switch (bone.type) {
        case 'p':
          return deboneP(bone, format);
        case 'list':
          return deboneList(bone, format);
        case 'image':
          return deboneImage(bone, format);
        default:
          return ((x: never) => {
            throw new Error(`Invalid block bone: ${bone}`);
          })(bone);
      }
    })
    .join('');
}
