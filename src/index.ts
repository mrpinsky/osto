import { DeltaStatic } from 'quill';

export interface TextBone {
  type: 'text';
  text: string;
  attributes: { [attribute: string]: any };
}

export interface HashtagBone {
  type: 'hashtag';
  tag: string;
}

export interface AtMentionBone {
  type: 'at';
  id: number;
}

export type InlineBone = TextBone | HashtagBone | AtMentionBone;

export interface ParagraphBone {
  type: 'p';
  bones: InlineBone[];
  attributes: { [attribute: string]: any };
}

export interface TrellisImageBone {
  type: 'image';
  id: number;
}

export interface ListBone {
  type: 'list';
  items: InlineBone[];
  ordered: boolean;
  attributes: { [attribute: string]: any };
}

export type BlockBone = ParagraphBone | ListBone | TrellisImageBone;

export type Skeleton = BlockBone[];

export function ossify(delta: DeltaStatic): Skeleton {
  return [];
}
