"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotificationsResult = exports.getUsersResult = void 0;
const getUsersResult = (res) => res.data && res.data.users;
exports.getUsersResult = getUsersResult;
const createNotificationsResult = (res) => res.data &&
    res.data.insert_notifications.returning.length > 0 &&
    res.data.insert_notifications.returning;
exports.createNotificationsResult = createNotificationsResult;
//# sourceMappingURL=responseParsers.js.map