import { InlineBone, AtMentionBone, HashtagBone, TextBone, ParagraphBone, ListBone, TrellisImageBone, Skeleton } from './types';
export declare type Format = 'html' | 'plain';
export declare const tags: {
    bold: string;
    italic: string;
    underline: string;
    superscript: string;
    subscript: string;
    strikethrough: string;
};
export declare function deboneText(bone: TextBone, format?: Format): string;
export declare function deboneHashtag(bone: HashtagBone, format: Format): string;
export declare function deboneAtMention(bone: AtMentionBone, format: Format): string;
export declare function deboneInline(bone: InlineBone, format: Format): string;
export declare function deboneP(p: ParagraphBone, format: Format): string;
export declare function deboneList(list: ListBone, format: Format): string;
export declare function deboneImage(image: TrellisImageBone, format: Format): string;
export declare function debone(skeleton: Skeleton, format: Format): string;
