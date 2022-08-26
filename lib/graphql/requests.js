"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDBCronJob = exports.getDBCronJobs = exports.createDBCronJob = exports.createNotificationTimeZones = exports.createTimeZones = exports.updateNotification = exports.createNotifications = exports.getUsers = void 0;
const constants_1 = require("./constants");
const queries_1 = require("./queries");
const node_fetch_1 = require("node-fetch");
const responseParsers_1 = require("./responseParsers");
const mutations_1 = require("./mutations");
const graphQLFetch = async (query, variables) => {
    try {
        let res = await (0, node_fetch_1.default)(constants_1.GRAPHQL_ENDPOINT, {
            headers: {
                "x-hasura-admin-secret": constants_1.HASURA_SECRET,
                "content-type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({ query, variables }),
        });
        res = await res.json();
        return res;
    }
    catch (e) {
        console.log(e);
    }
};
const getUsers = async (where) => {
    try {
        const res = await graphQLFetch((0, queries_1.usersQuery)(where));
        return (0, responseParsers_1.getUsersResult)(res);
    }
    catch (e) {
        console.log(e);
        return;
    }
};
exports.getUsers = getUsers;
const createNotifications = async (notifications) => {
    try {
        const res = await graphQLFetch((0, mutations_1.createNotificationsMutation)(notifications));
        return (0, responseParsers_1.createNotificationsResult)(res);
    }
    catch (e) {
        console.log(e);
        return;
    }
};
exports.createNotifications = createNotifications;
const updateNotification = async (id, notification) => {
    try {
        await graphQLFetch((0, mutations_1.updateNotificationMutation)(notification, id));
        return true;
    }
    catch (e) {
        console.log(e);
        return;
    }
};
exports.updateNotification = updateNotification;
const createTimeZones = async (timeZones) => {
    try {
        await graphQLFetch((0, mutations_1.createTimeZonesMutation)(timeZones));
        return true;
    }
    catch (e) {
        console.log(e);
        return;
    }
};
exports.createTimeZones = createTimeZones;
const createNotificationTimeZones = async (notificationTimeZones) => {
    try {
        await graphQLFetch((0, mutations_1.createNotificationTimeZonesMutation)(notificationTimeZones));
        return true;
    }
    catch (e) {
        console.log(e);
        return;
    }
};
exports.createNotificationTimeZones = createNotificationTimeZones;
const createDBCronJob = async (cronJob) => {
    try {
        const res = await graphQLFetch((0, mutations_1.createCronJobMutation)(cronJob));
        console.log("res, createDBCronJob", res);
        return (0, responseParsers_1.createDBCronJobResult)(res).id;
    }
    catch (e) {
        console.log(e);
        return;
    }
};
exports.createDBCronJob = createDBCronJob;
const getDBCronJobs = async () => {
    try {
        const res = await graphQLFetch((0, queries_1.cronJobsQuery)());
        return (0, responseParsers_1.getDBCronJobsResult)(res);
    }
    catch (e) {
        console.log(e);
        return;
    }
};
exports.getDBCronJobs = getDBCronJobs;
const deleteDBCronJob = async (id) => {
    try {
        await graphQLFetch((0, mutations_1.deleteCronJobMutation)(id));
        console.log("res1 deletecronjob");
        return true;
    }
    catch (e) {
        console.log(e);
        return false;
    }
};
exports.deleteDBCronJob = deleteDBCronJob;
//# sourceMappingURL=requests.js.map