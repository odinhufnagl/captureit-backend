const { timezones } = require("./data");
import * as admin from "firebase-admin";
import { NOTIFICATION_TYPES } from "./constants";
import { NOTIFICATIONS_DATA } from "./data/notifications";
import { createNotifications, getUsers } from "./graphql/requests";
import { sendNotification } from "./helpers/notifications";
const schedule = require("node-schedule");
const moment = require("moment-timezone");
const FIRST_TIME_ZONE = "Pacific/Kiritimati";
const EARLIEST_TIME = 7 * 60;
const LATEST_TIME = 23 * 60;

console.log("worker is running...");

const serviceAccount = require("./serviceAccountKey.json"); // eslint-disable-line

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const sendOpenCameraNotification = async (timeZone: string) => {
  const users = await getUsers({ timeZone: { _eq: timeZone } });
  if (!users || users.length === 0) {
    return;
  }
  await sendNotification(
    users
      ?.filter((user) => user.notificationToken?.length > 0)
      .map((user) => user.notificationToken) || [],
    NOTIFICATIONS_DATA.OPEN_CAMERA,
    { type: NOTIFICATION_TYPES.OPEN_CAMERA }
  );
  return true;
};

const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const createCronjobs = async () => {
  const firstTimeZoneDate = moment().tz(FIRST_TIME_ZONE);
  firstTimeZoneDate.add(getRandomNumber(EARLIEST_TIME, LATEST_TIME), "minutes");
  const notificationCreatedAt = firstTimeZoneDate.format("YYYY-MM-DD HH:mm:ss");
  console.log("notification created at", notificationCreatedAt);
  const res = await createNotifications([
    {
      title: "random",
      createdAt: notificationCreatedAt,
    },
  ]);
  if (!res) {
    return;
  }
  timezones.forEach((timeZone: string) => {
    var rule = new schedule.RecurrenceRule();
    rule.dayOfWeek = firstTimeZoneDate.day();
    rule.hour = firstTimeZoneDate.hour();
    rule.minute = firstTimeZoneDate.minute();
    rule.second = firstTimeZoneDate.second();
    rule.tz = timeZone;
    let cronJob = schedule.scheduleJob(rule, () =>
      handleCronJob(cronJob, timeZone)
    );
  });
};

const handleCronJob = async (cronJob: any, timeZone: string) => {
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