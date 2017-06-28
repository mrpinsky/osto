export interface QuillAttributes {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  link?: string;
  list?: 'ordered' | 'bullet';
  script?: 'super' | 'sub';
  strikethrough?: boolean;
  color?: string;
  background?: string;
}

export interface QuillOp {
  insert: string | { [key: string]: any };
  attributes?: QuillAttributes;
}

export interface QuillDelta {
  ops: QuillOp[];
}

export interface InlineBoneBase {
  type: string;
  attributes: QuillAttributes;
}

export interface TextBone extends InlineBoneBase {
  type: 'text';
  text: string;
}

export interface HashtagBone extends InlineBoneBase {
  type: 'hashtag';
  tag: string;
}

export interface AtMentionBone extends InlineBoneBase {
  type: 'at';
  id: number;
}

export type InlineBone = TextBone | HashtagBone | AtMentionBone;

export interface ParagraphBone {
  type: 'p';
  contents: InlineBone[];
}

export interface TrellisImageBone {
  type: 'image';
  ref: any;
}

export interface ListBoneBase {
  type: 'list';
  items: InlineBone[][];
  list: string;
}

export interface OrderedListBone extends ListBoneBase {
  list: 'ordered';
}

export interface UnorderedListBone extends ListBoneBase {
  list: 'bullet';
}

export type ListBone = OrderedListBone | UnorderedListBone;

export type BlockBone = ParagraphBone | ListBone | TrellisImageBone;

export type Skeleton = BlockBone[];
