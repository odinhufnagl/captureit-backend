"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cronJobsQuery = exports.usersQuery = void 0;
const helpers_1 = require("./helpers");
const usersQuery = (where) => {
    const whereInput = (0, helpers_1.objectToGraphql)(where || {});
    return `
  query {
    users(where: ${whereInput}) {
        notificationToken,
        id,
    
    }
  }
`;
};
exports.usersQuery = usersQuery;
const cronJobsQuery = () => `
  query {
    cronJobs {
        timeZone,
        id,
        day,
        hour,
        minute,
        second,
        notificationId
    }
  }
`;
exports.cronJobsQuery = cronJobsQuery;
//# sourceMappingURL=queries.js.map