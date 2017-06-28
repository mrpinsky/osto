import { QuillOp, InlineBone } from './types';

export function ossify(op: QuillOp): InlineBone {
  if (typeof op.insert === 'string') {
    return {
      type: 'text',
      text: op.insert,
      attributes: op.attributes || {},
    };
  } else {
    if (op.insert.atmention) {
      return {
        type: 'at',
        id: op.insert.atmention.id,
        attributes: op.attributes || {},
      };
    } else if (op.insert.hashtag) {
      return {
        type: 'hashtag',
        tag: op.insert.hashtag,
        attributes: op.attributes || {},
      };
    } else {
      return {
        type: 'text',
        text: op.insert.toString(),
        attributes: op.attributes || {},
      };
    }
  }
}
