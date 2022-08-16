"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { timezones } = require("./data");
const admin = require("firebase-admin");
const constants_1 = require("./constants");
const notifications_1 = require("./data/notifications");
const requests_1 = require("./graphql/requests");
const notifications_2 = require("./helpers/notifications");
var CronJob = require("cron").CronJob;
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
    console.log("hello world");
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
    if (!res || typeof res === "boolean") {
        return;
    }
    console.log("res", res);
    const createdNotificationId = res[0].id;
    if (!createdNotificationId) {
        return;
    }
    timezones.forEach((timeZone) => {
        new CronJob(firstTimeZoneDate, () => handleCronJob(timeZone, createdNotificationId), null, true, timeZone);
    });
};
const handleCronJob = async (timeZone, notificationId) => {
    await (0, requests_1.createNotificationTimeZones)([
        { timeZoneName: timeZone, notificationId },
    ]);
    await sendOpenCameraNotification(timeZone);
};
const createScheduler = () => {
    new CronJob("0 0 * * *", createCronjobs, null, true, FIRST_TIME_ZONE);
};
createScheduler();
//# sourceMappingURL=index.js.map