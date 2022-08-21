"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { timezones } = require("./data");
const admin = require("firebase-admin");
const constants_1 = require("./constants");
const notifications_1 = require("./data/notifications");
const requests_1 = require("./graphql/requests");
const notifications_2 = require("./helpers/notifications");
const schedule = require("node-schedule");
const moment = require("moment-timezone");
const FIRST_TIME_ZONE = "Pacific/Kiritimati";
const EARLIEST_TIME = 7 * 60;
const LATEST_TIME = 23 * 60;
console.log("worker is running...");
const serviceAccount = require("./serviceAccountKey.json"); // eslint-disable-line
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const sendOpenCameraNotification = async (timeZone) => {
    const users = await (0, requests_1.getUsers)({ timeZone: { _eq: timeZone } });
    if (!users || users.length === 0) {
        return;
    }
    await (0, notifications_2.sendNotification)((users === null || users === void 0 ? void 0 : users.filter((user) => { var _a; return ((_a = user.notificationToken) === null || _a === void 0 ? void 0 : _a.length) > 0; }).map((user) => user.notificationToken)) || [], notifications_1.NOTIFICATIONS_DATA.OPEN_CAMERA, { type: constants_1.NOTIFICATION_TYPES.OPEN_CAMERA });
    return true;
};
const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
};
const createCronjobs = async () => {
    const firstTimeZoneDate = moment().tz(FIRST_TIME_ZONE);
    firstTimeZoneDate.add(getRandomNumber(EARLIEST_TIME, LATEST_TIME), "minutes");
    const notificationCreatedAt = firstTimeZoneDate.format("YYYY-MM-DD HH:mm:ss");
    const res = await (0, requests_1.createNotifications)([
        {
            title: "random",
            createdAt: notificationCreatedAt,
        },
    ]);
    if (!res || typeof res === "boolean") {
        return;
    }
    const createdNotificationId = res[0].id;
    if (!createdNotificationId) {
        return;
    }
    timezones.forEach(async (timeZone) => {
        const day = firstTimeZoneDate.day();
        const hour = firstTimeZoneDate.hour();
        const minute = firstTimeZoneDate.minute();
        const second = firstTimeZoneDate.second();
        var rule = new schedule.RecurrenceRule();
        rule.dayOfWeek = day;
        rule.hour = hour;
        rule.minute = minute;
        rule.second = second;
        rule.tz = timeZone;
        //safing if server restarts
        const dbCronJobId = await (0, requests_1.createDBCronJob)({
            day,
            hour,
            minute,
            second,
            timeZone,
            notificationId: createdNotificationId,
        });
        if (!dbCronJobId) {
            return;
        }
        let cronJob = schedule.scheduleJob(rule, () => handleCronJob(cronJob, timeZone, createdNotificationId, dbCronJobId));
    });
};
const handleCronJob = async (cronJob, timeZone, notificationId, dbCronJobId) => {
    const res1 = await (0, requests_1.deleteDBCronJob)(dbCronJobId);
    if (!res1) {
        return;
    }
    await (0, requests_1.createNotificationTimeZones)([
        { timeZoneName: timeZone, notificationId },
    ]);
    await sendOpenCameraNotification(timeZone);
    cronJob.cancel();
};
const createScheduler = () => {
    var rule = new schedule.RecurrenceRule();
    rule.hour = 0;
    rule.minute = 0;
    rule.second = 0;
    rule.tz = FIRST_TIME_ZONE;
    schedule.scheduleJob(rule, createCronjobs);
};
const checkAfterUnfinishedJobs = async () => {
    const res = await (0, requests_1.getDBCronJobs)();
    if (!res) {
        return;
    }
    res.forEach(({ day, hour, minute, second, timeZone, notificationId, id }) => {
        var rule = new schedule.RecurrenceRule();
        rule.dayOfWeek = day;
        rule.hour = hour;
        rule.minute = minute;
        rule.second = second;
        rule.tz = timeZone;
        let cronJob = schedule.scheduleJob(rule, () => handleCronJob(cronJob, timeZone, notificationId, id));
    });
};
createScheduler();
checkAfterUnfinishedJobs();
//# sourceMappingURL=index.js.map