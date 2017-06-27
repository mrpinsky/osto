import { QuillOp, QuillDelta, InlineBone, Skeleton } from './types';
import { ossify } from './ossify';

export function isolateNewlines(ops: QuillOp[]): QuillOp[] {
  return ops.reduce((acc: QuillOp[], curr: QuillOp) => {
    if (typeof curr.insert === 'string' && curr.insert !== '\n') {
      const preMatch = curr.insert.match(/[^\n]/);
      const postMatch = curr.insert.match(/[^\n]\n*$/);
      const nLsBefore = preMatch ? preMatch.index : 0;
      const nLsAfter = postMatch ? curr.insert.length - postMatch.index - 1 : 0;

      new Array(nLsBefore)
        .fill({ insert: '\n', attributes: {} })
        .forEach(v => acc.push(v));

      const trimmed = curr.insert.replace(/^\n+|\n+$/g, '');
      const split = trimmed.split('\n');
      split.forEach((line: string, index: number) => {
        if (line.length > 0) {
          acc.push({ insert: line, attributes: curr.attributes || {} });
        }
        if (index < split.length - 1) {
          acc.push({ insert: '\n', attributes: {} });
        }
      });

      new Array(nLsAfter)
        .fill({ insert: '\n', attributes: {} })
        .forEach(v => acc.push(v));
    } else {
      acc.push(Object.assign({ attributes: {} }, curr));
    }
    return acc;
  }, []);
}

export function skeletonize(delta: QuillDelta): Skeleton {
  const linedOps = isolateNewlines(delta.ops);
  const skeleton: Skeleton = [];
  let buffer: InlineBone[] = [];

  for (const op of linedOps) {
    if (typeof op.insert === 'string') {
      if (op.insert === '\n') {
        if (op.attributes && op.attributes.list) {
          // Look at last item on skeleton
          const last = skeleton[skeleton.length - 1];
          // If it's the same type of list, add buffer to it
          if (
            last &&
            last.type === 'list' &&
            last.list === op.attributes.list
          ) {
            last.items.push(buffer);
          } else {
            // Otherwise, start a new list with the buffer and push it onto skeleton
            skeleton.push({
              type: 'list',
              items: [buffer],
              list: op.attributes.list,
            });
          }
        } else {
          if (
            // the preceding block, if it exists, isn't an image
            skeleton.length === 0 ||
            skeleton[skeleton.length - 1].type !== 'image'
          ) {
            // Attach it to skeleton as p-block
            skeleton.push({ type: 'p', contents: buffer });
          }
        }
        // Either way, reset the buffer
        buffer = [];
      } else {
        // TODO: Ossify and add to buffer
        buffer.push(ossify(op));
      }
    } else if (op.insert.image) {
      skeleton.push({
        type: 'image',
        ref: op.insert.image,
      });
    } else {
      // a special insert type
      // Ossify and add to current buffer
      buffer.push(ossify(op));
    }
  }

  if (buffer.length > 0) {
    skeleton.push({ type: 'p', contents: buffer });
  }

  return skeleton;
}
