"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function ossify(op) {
    if (typeof op.insert === 'string') {
        return {
            type: 'text',
            text: op.insert,
            attributes: op.attributes || {},
        };
    }
    else {
        if (op.insert.atmention) {
            return {
                type: 'at',
                id: op.insert.atmention.id,
                attributes: op.attributes || {},
            };
        }
        else if (op.insert.hashtag) {
            return {
                type: 'hashtag',
                tag: op.insert.hashtag,
                attributes: op.attributes || {},
            };
        }
        else {
            return {
                type: 'text',
                text: op.insert.toString(),
                attributes: op.attributes || {},
            };
        }
    }
}
exports.ossify = ossify;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vc3NpZnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxnQkFBdUIsRUFBVztJQUNoQyxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxNQUFNLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztRQUNsQyxNQUFNLENBQUM7WUFDTCxJQUFJLEVBQUUsTUFBTTtZQUNaLElBQUksRUFBRSxFQUFFLENBQUMsTUFBTTtZQUNmLFVBQVUsRUFBRSxFQUFFLENBQUMsVUFBVSxJQUFJLEVBQUU7U0FDaEMsQ0FBQztJQUNKLENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNOLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUN4QixNQUFNLENBQUM7Z0JBQ0wsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsRUFBRSxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEVBQUU7Z0JBQzFCLFVBQVUsRUFBRSxFQUFFLENBQUMsVUFBVSxJQUFJLEVBQUU7YUFDaEMsQ0FBQztRQUNKLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQzdCLE1BQU0sQ0FBQztnQkFDTCxJQUFJLEVBQUUsU0FBUztnQkFDZixHQUFHLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPO2dCQUN0QixVQUFVLEVBQUUsRUFBRSxDQUFDLFVBQVUsSUFBSSxFQUFFO2FBQ2hDLENBQUM7UUFDSixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixNQUFNLENBQUM7Z0JBQ0wsSUFBSSxFQUFFLE1BQU07Z0JBQ1osSUFBSSxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFO2dCQUMxQixVQUFVLEVBQUUsRUFBRSxDQUFDLFVBQVUsSUFBSSxFQUFFO2FBQ2hDLENBQUM7UUFDSixDQUFDO0lBQ0gsQ0FBQztBQUNILENBQUM7QUE1QkQsd0JBNEJDIiwiZmlsZSI6Im9zc2lmeS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFF1aWxsT3AsIElubGluZUJvbmUgfSBmcm9tICcuL3R5cGVzJztcblxuZXhwb3J0IGZ1bmN0aW9uIG9zc2lmeShvcDogUXVpbGxPcCk6IElubGluZUJvbmUge1xuICBpZiAodHlwZW9mIG9wLmluc2VydCA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgdGV4dDogb3AuaW5zZXJ0LFxuICAgICAgYXR0cmlidXRlczogb3AuYXR0cmlidXRlcyB8fCB7fSxcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIGlmIChvcC5pbnNlcnQuYXRtZW50aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiAnYXQnLFxuICAgICAgICBpZDogb3AuaW5zZXJ0LmF0bWVudGlvbi5pZCxcbiAgICAgICAgYXR0cmlidXRlczogb3AuYXR0cmlidXRlcyB8fCB7fSxcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmIChvcC5pbnNlcnQuaGFzaHRhZykge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogJ2hhc2h0YWcnLFxuICAgICAgICB0YWc6IG9wLmluc2VydC5oYXNodGFnLFxuICAgICAgICBhdHRyaWJ1dGVzOiBvcC5hdHRyaWJ1dGVzIHx8IHt9LFxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICB0ZXh0OiBvcC5pbnNlcnQudG9TdHJpbmcoKSxcbiAgICAgICAgYXR0cmlidXRlczogb3AuYXR0cmlidXRlcyB8fCB7fSxcbiAgICAgIH07XG4gICAgfVxuICB9XG59XG4iXX0=
