"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCronJobMutation = exports.createCronJobMutation = exports.createNotificationTimeZonesMutation = exports.updateNotificationMutation = exports.createTimeZonesMutation = exports.createNotificationsMutation = void 0;
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
const createTimeZonesMutation = (obj) => {
    const input = (0, helpers_1.objectToGraphql)(obj);
    return `
  mutation {
    insert_timeZones(objects:${input}) {returning{name}}
  }
    `;
};
exports.createTimeZonesMutation = createTimeZonesMutation;
const updateNotificationMutation = (obj, id) => {
    const setInput = (0, helpers_1.objectToGraphql)(obj);
    const idInput = (0, helpers_1.objectToGraphql)(id);
    return `
  mutation {
    update_notifications_by_pk(pk_columns:{id:${idInput}}, _set:${setInput}) {createdAt}
  }
    `;
};
exports.updateNotificationMutation = updateNotificationMutation;
const createNotificationTimeZonesMutation = (obj) => {
    const input = (0, helpers_1.objectToGraphql)(obj);
    console.log("input createNotificationTimezone", input);
    return `
  mutation {
    insert_notifications_timeZones(objects:${input}) {returning{timeZoneName}}
  }
    `;
};
exports.createNotificationTimeZonesMutation = createNotificationTimeZonesMutation;
const createCronJobMutation = (obj) => {
    const input = (0, helpers_1.objectToGraphql)(obj);
    console.log("input createCronjob", input);
    return `
  mutation {
    insert_cronJobs_one(object:${input}) {id}
  }
    `;
};
exports.createCronJobMutation = createCronJobMutation;
const deleteCronJobMutation = (id) => {
    const idInput = (0, helpers_1.objectToGraphql)(id);
    return `
  mutation {delete_cronJobs_by_pk(id: ${idInput}) {id}} 
    `;
};
exports.deleteCronJobMutation = deleteCronJobMutation;
//# sourceMappingURL=mutations.js.map