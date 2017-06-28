"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ossify_1 = require("./ossify");
function isolateNewlines(ops) {
    return ops.reduce(function (acc, curr) {
        if (typeof curr.insert === 'string' && curr.insert !== '\n') {
            var preMatch = curr.insert.match(/[^\n]/);
            var postMatch = curr.insert.match(/[^\n]\n*$/);
            var nLsBefore = preMatch ? preMatch.index : 0;
            var nLsAfter = postMatch ? curr.insert.length - postMatch.index - 1 : 0;
            new Array(nLsBefore)
                .fill({ insert: '\n', attributes: {} })
                .forEach(function (v) { return acc.push(v); });
            var trimmed = curr.insert.replace(/^\n+|\n+$/g, '');
            var split_1 = trimmed.split('\n');
            split_1.forEach(function (line, index) {
                if (line.length > 0) {
                    acc.push({ insert: line, attributes: curr.attributes || {} });
                }
                if (index < split_1.length - 1) {
                    acc.push({ insert: '\n', attributes: {} });
                }
            });
            new Array(nLsAfter)
                .fill({ insert: '\n', attributes: {} })
                .forEach(function (v) { return acc.push(v); });
        }
        else {
            acc.push(Object.assign({ attributes: {} }, curr));
        }
        return acc;
    }, []);
}
exports.isolateNewlines = isolateNewlines;
function skeletonize(delta) {
    var linedOps = isolateNewlines(delta.ops);
    var skeleton = [];
    var buffer = [];
    for (var _i = 0, linedOps_1 = linedOps; _i < linedOps_1.length; _i++) {
        var op = linedOps_1[_i];
        if (typeof op.insert === 'string') {
            if (op.insert === '\n') {
                if (op.attributes && op.attributes.list) {
                    var last = skeleton[skeleton.length - 1];
                    if (last &&
                        last.type === 'list' &&
                        last.list === op.attributes.list) {
                        last.items.push(buffer);
                    }
                    else {
                        if (op.attributes.list === 'ordered') {
                            skeleton.push({
                                type: 'list',
                                items: [buffer],
                                list: op.attributes.list,
                            });
                        }
                        else if (op.attributes.list === 'bullet') {
                            skeleton.push({
                                type: 'list',
                                items: [buffer],
                                list: op.attributes.list,
                            });
                        }
                    }
                }
                else {
                    if (skeleton.length === 0 ||
                        skeleton[skeleton.length - 1].type !== 'image') {
                        skeleton.push({ type: 'p', contents: buffer });
                    }
                }
                buffer = [];
            }
            else {
                buffer.push(ossify_1.ossify(op));
            }
        }
        else if (op.insert.image) {
            skeleton.push({
                type: 'image',
                ref: op.insert.image,
            });
        }
        else {
            buffer.push(ossify_1.ossify(op));
        }
    }
    if (buffer.length > 0) {
        skeleton.push({ type: 'p', contents: buffer });
    }
    return skeleton;
}
exports.skeletonize = skeletonize;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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QUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUVELE1BQU0sQ0FBQyxRQUFRLENBQUM7QUFDbEIsQ0FBQztBQXBFRCxrQ0FvRUMiLCJmaWxlIjoic2tlbGV0b25pemUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBRdWlsbE9wLCBRdWlsbERlbHRhLCBJbmxpbmVCb25lLCBTa2VsZXRvbiB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHsgb3NzaWZ5IH0gZnJvbSAnLi9vc3NpZnknO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNvbGF0ZU5ld2xpbmVzKG9wczogUXVpbGxPcFtdKTogUXVpbGxPcFtdIHtcbiAgcmV0dXJuIG9wcy5yZWR1Y2UoKGFjYzogUXVpbGxPcFtdLCBjdXJyOiBRdWlsbE9wKSA9PiB7XG4gICAgaWYgKHR5cGVvZiBjdXJyLmluc2VydCA9PT0gJ3N0cmluZycgJiYgY3Vyci5pbnNlcnQgIT09ICdcXG4nKSB7XG4gICAgICBjb25zdCBwcmVNYXRjaCA9IGN1cnIuaW5zZXJ0Lm1hdGNoKC9bXlxcbl0vKTtcbiAgICAgIGNvbnN0IHBvc3RNYXRjaCA9IGN1cnIuaW5zZXJ0Lm1hdGNoKC9bXlxcbl1cXG4qJC8pO1xuICAgICAgY29uc3QgbkxzQmVmb3JlID0gcHJlTWF0Y2ggPyBwcmVNYXRjaC5pbmRleCA6IDA7XG4gICAgICBjb25zdCBuTHNBZnRlciA9IHBvc3RNYXRjaCA/IGN1cnIuaW5zZXJ0Lmxlbmd0aCAtIHBvc3RNYXRjaC5pbmRleCAtIDEgOiAwO1xuXG4gICAgICBuZXcgQXJyYXkobkxzQmVmb3JlKVxuICAgICAgICAuZmlsbCh7IGluc2VydDogJ1xcbicsIGF0dHJpYnV0ZXM6IHt9IH0pXG4gICAgICAgIC5mb3JFYWNoKHYgPT4gYWNjLnB1c2godikpO1xuXG4gICAgICBjb25zdCB0cmltbWVkID0gY3Vyci5pbnNlcnQucmVwbGFjZSgvXlxcbit8XFxuKyQvZywgJycpO1xuICAgICAgY29uc3Qgc3BsaXQgPSB0cmltbWVkLnNwbGl0KCdcXG4nKTtcbiAgICAgIHNwbGl0LmZvckVhY2goKGxpbmU6IHN0cmluZywgaW5kZXg6IG51bWJlcikgPT4ge1xuICAgICAgICBpZiAobGluZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgYWNjLnB1c2goeyBpbnNlcnQ6IGxpbmUsIGF0dHJpYnV0ZXM6IGN1cnIuYXR0cmlidXRlcyB8fCB7fSB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW5kZXggPCBzcGxpdC5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgYWNjLnB1c2goeyBpbnNlcnQ6ICdcXG4nLCBhdHRyaWJ1dGVzOiB7fSB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIG5ldyBBcnJheShuTHNBZnRlcilcbiAgICAgICAgLmZpbGwoeyBpbnNlcnQ6ICdcXG4nLCBhdHRyaWJ1dGVzOiB7fSB9KVxuICAgICAgICAuZm9yRWFjaCh2ID0+IGFjYy5wdXNoKHYpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYWNjLnB1c2goT2JqZWN0LmFzc2lnbih7IGF0dHJpYnV0ZXM6IHt9IH0sIGN1cnIpKTtcbiAgICB9XG4gICAgcmV0dXJuIGFjYztcbiAgfSwgW10pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2tlbGV0b25pemUoZGVsdGE6IFF1aWxsRGVsdGEpOiBTa2VsZXRvbiB7XG4gIGNvbnN0IGxpbmVkT3BzID0gaXNvbGF0ZU5ld2xpbmVzKGRlbHRhLm9wcyk7XG4gIGNvbnN0IHNrZWxldG9uOiBTa2VsZXRvbiA9IFtdO1xuICBsZXQgYnVmZmVyOiBJbmxpbmVCb25lW10gPSBbXTtcblxuICBmb3IgKGNvbnN0IG9wIG9mIGxpbmVkT3BzKSB7XG4gICAgaWYgKHR5cGVvZiBvcC5pbnNlcnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBpZiAob3AuaW5zZXJ0ID09PSAnXFxuJykge1xuICAgICAgICBpZiAob3AuYXR0cmlidXRlcyAmJiBvcC5hdHRyaWJ1dGVzLmxpc3QpIHtcbiAgICAgICAgICAvLyBMb29rIGF0IGxhc3QgaXRlbSBvbiBza2VsZXRvblxuICAgICAgICAgIGNvbnN0IGxhc3QgPSBza2VsZXRvbltza2VsZXRvbi5sZW5ndGggLSAxXTtcbiAgICAgICAgICAvLyBJZiBpdCdzIHRoZSBzYW1lIHR5cGUgb2YgbGlzdCwgYWRkIGJ1ZmZlciB0byBpdFxuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIGxhc3QgJiZcbiAgICAgICAgICAgIGxhc3QudHlwZSA9PT0gJ2xpc3QnICYmXG4gICAgICAgICAgICBsYXN0Lmxpc3QgPT09IG9wLmF0dHJpYnV0ZXMubGlzdFxuICAgICAgICAgICkge1xuICAgICAgICAgICAgbGFzdC5pdGVtcy5wdXNoKGJ1ZmZlcik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIE90aGVyd2lzZSwgc3RhcnQgYSBuZXcgbGlzdCB3aXRoIHRoZSBidWZmZXIgYW5kIHB1c2ggaXQgb250byBza2VsZXRvblxuICAgICAgICAgICAgaWYgKG9wLmF0dHJpYnV0ZXMubGlzdCA9PT0gJ29yZGVyZWQnKSB7XG4gICAgICAgICAgICAgIHNrZWxldG9uLnB1c2goe1xuICAgICAgICAgICAgICAgIHR5cGU6ICdsaXN0JyxcbiAgICAgICAgICAgICAgICBpdGVtczogW2J1ZmZlcl0sXG4gICAgICAgICAgICAgICAgbGlzdDogb3AuYXR0cmlidXRlcy5saXN0LFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3AuYXR0cmlidXRlcy5saXN0ID09PSAnYnVsbGV0Jykge1xuICAgICAgICAgICAgICBza2VsZXRvbi5wdXNoKHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnbGlzdCcsXG4gICAgICAgICAgICAgICAgaXRlbXM6IFtidWZmZXJdLFxuICAgICAgICAgICAgICAgIGxpc3Q6IG9wLmF0dHJpYnV0ZXMubGlzdCxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIC8vIHRoZSBwcmVjZWRpbmcgYmxvY2ssIGlmIGl0IGV4aXN0cywgaXNuJ3QgYW4gaW1hZ2VcbiAgICAgICAgICAgIHNrZWxldG9uLmxlbmd0aCA9PT0gMCB8fFxuICAgICAgICAgICAgc2tlbGV0b25bc2tlbGV0b24ubGVuZ3RoIC0gMV0udHlwZSAhPT0gJ2ltYWdlJ1xuICAgICAgICAgICkge1xuICAgICAgICAgICAgLy8gQXR0YWNoIGl0IHRvIHNrZWxldG9uIGFzIHAtYmxvY2tcbiAgICAgICAgICAgIHNrZWxldG9uLnB1c2goeyB0eXBlOiAncCcsIGNvbnRlbnRzOiBidWZmZXIgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIEVpdGhlciB3YXksIHJlc2V0IHRoZSBidWZmZXJcbiAgICAgICAgYnVmZmVyID0gW107XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBUT0RPOiBPc3NpZnkgYW5kIGFkZCB0byBidWZmZXJcbiAgICAgICAgYnVmZmVyLnB1c2gob3NzaWZ5KG9wKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChvcC5pbnNlcnQuaW1hZ2UpIHtcbiAgICAgIHNrZWxldG9uLnB1c2goe1xuICAgICAgICB0eXBlOiAnaW1hZ2UnLFxuICAgICAgICByZWY6IG9wLmluc2VydC5pbWFnZSxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBhIHNwZWNpYWwgaW5zZXJ0IHR5cGVcbiAgICAgIC8vIE9zc2lmeSBhbmQgYWRkIHRvIGN1cnJlbnQgYnVmZmVyXG4gICAgICAvLyBjb25zdCBodG1sID0gdG9IdG1sU3RyaW5nKG9wIGFzIHsgaW5zZXJ0OiBzdHJpbmcgfSk7XG4gICAgICBidWZmZXIucHVzaChvc3NpZnkob3ApKTtcbiAgICB9XG4gIH1cblxuICBpZiAoYnVmZmVyLmxlbmd0aCA+IDApIHtcbiAgICBza2VsZXRvbi5wdXNoKHsgdHlwZTogJ3AnLCBjb250ZW50czogYnVmZmVyIH0pO1xuICB9XG5cbiAgcmV0dXJuIHNrZWxldG9uO1xufVxuIl19
