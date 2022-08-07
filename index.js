const express = require("express");
const { timezones } = require("./data");
const app = express();
const fetch = require("node-fetch");
const schedule = require("node-schedule");
const FIRST_TIME_ZONE = "Pacific/Kiritimati";
const FUNCTIONS_URL =
  "https://europe-west1-capture-it-93c05.cloudfunctions.net";
const EARLIEST_TIME = 7 * 60;
const LATEST_TIME = 23 * 60;

const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const createCronjobs = async () => {
  const utcDate = new Date();
  const dateToSendNotification = new Date(
    utcDate.getTime() + getRandomNumber(EARLIEST_TIME, LATEST_TIME) * 60000
  );
  //date to send notification is now in kiritimati time because of MAX_OFFSET;
  const res = await fetch(FUNCTIONS_URL + "/createNotification", {
    body: JSON.stringify({ createdAt: dateToSendNotification }),
    method: "POST",
  });
  if (!res) {
    return;
  }
  console.log(dateToSendNotification);
  timezones.forEach((timeZone, index) => {
    var rule = new schedule.RecurrenceRule();
    rule.dayOfWeek = dateToSendNotification.getUTCDay();
    rule.hour = dateToSendNotification.getUTCHours();
    rule.minute = dateToSendNotification.getUTCMinutes();
    rule.second = dateToSendNotification.getUTCSeconds();
    rule.tz = timeZone;
    let cronJob = schedule.scheduleJob(rule, () =>
      handleCronJob(cronJob, timeZone, index)
    );
  });
};

const handleCronJob = async (cronJob, timeZone, index) => {
  console.log(timeZone);
  await fetch(FUNCTIONS_URL + "/sendOpenCameraNotification", {
    body: JSON.stringify({ timeZone }),
    method: "POST",
  });
  cronJob.cancel();
};

const createScheduler = () => {
  console.log("running");
  var rule = new schedule.RecurrenceRule();
  rule.hour = 0;
  rule.minute = 0;
  rule.second = 0;
  rule.tz = FIRST_TIME_ZONE;
  schedule.scheduleJob("*/4 * * * * *", createCronjobs);
};

createScheduler();
