"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotificationsMutation = void 0;
const helpers_1 = require("./helpers");
const createNotificationsMutation = (obj) => {
    const input = (0, helpers_1.objectToGraphql)(obj);
    return `
  mutation {
    insert_notifications(objects:${input}) {returning{id}}
  }
    `;
};
exports.createNotificationsMutation = createNotificationsMutation;
//# sourceMappingURL=mutations.js.map