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
    console.log("notification created at", notificationCreatedAt);
    const res = await (0, requests_1.createNotifications)([
        {
            title: "random",
            createdAt: notificationCreatedAt,
        },
    ]);
    if (!res) {
        return;
    }
    timezones.forEach((timeZone) => {
        var rule = new schedule.RecurrenceRule();
        rule.dayOfWeek = firstTimeZoneDate.day();
        rule.hour = firstTimeZoneDate.hour();
        rule.minute = firstTimeZoneDate.minute();
        rule.second = firstTimeZoneDate.second();
        rule.tz = timeZone;
        let cronJob = schedule.scheduleJob(rule, () => handleCronJob(cronJob, timeZone));
    });
};
const handleCronJob = async (cronJob, timeZone) => {
    console.log("timeZone", timeZone);
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
createScheduler();
//# sourceMappingURL=index.js.map