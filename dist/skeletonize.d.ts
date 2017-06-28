import { QuillOp, QuillDelta, Skeleton } from './types';
export declare function isolateNewlines(ops: QuillOp[]): QuillOp[];
export declare function skeletonize(delta: QuillDelta): Skeleton;
