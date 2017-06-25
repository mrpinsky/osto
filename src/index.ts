import { DeltaStatic } from 'quill';

export interface AttributedBone {
  attributes?: { [attribute: string]: any };
}

export interface TextBone extends AttributedBone {
  type: 'text';
  text: string;
}

export interface HashtagBone extends AttributedBone {
  type: 'hashtag';
  tag: string;
}

export interface AtMentionBone extends AttributedBone {
  type: 'at';
  id: number;
}

export type InlineBone = TextBone | HashtagBone | AtMentionBone;

export interface ParagraphBone extends AttributedBone {
  type: 'p';
  bones: InlineBone[];
}

export interface TrellisImageBone {
  type: 'image';
  id: number;
}

export interface ListBone extends AttributedBone {
  type: 'list';
  items: InlineBone[][];
  ordered: boolean;
}

export type BlockBone = ParagraphBone | ListBone | TrellisImageBone;

export type Skeleton = BlockBone[];

export function ossify(delta: { insert: any }): InlineBone {
  return { type: 'text', text: 'foo' };
}

export function skeletonize(delta: DeltaStatic): Skeleton {
  return [];
}
