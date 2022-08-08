const express = require("express");
const { timezones } = require("./data");
const app = express();
const fetch = require("node-fetch");
const schedule = require("node-schedule");
const moment = require("moment-timezone");
const FIRST_TIME_ZONE = "Pacific/Kiritimati";
const FUNCTIONS_URL =
  "https://europe-west1-capture-it-93c05.cloudfunctions.net";
const EARLIEST_TIME = 7 * 60;
const LATEST_TIME = 23 * 60;

const getFirstTimeZoneDate = () => {
  const firstTimeZoneDate = new Date(
    new Date(
      new Date().toLocaleString("en-US", {
        timeZone: FIRST_TIME_ZONE,
      })
    ).getTime() -
      new Date().getTimezoneOffset() * 60000
  );
  console.log("firstimezonedate", firstTimeZoneDate);
  return firstTimeZoneDate;
};

const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const createCronjobs = async () => {
  console.log("helloooo");
  return;
  const firstTimeZoneDate = moment().tz(FIRST_TIME_ZONE);
  firstTimeZoneDate.add(getRandomNumber(EARLIEST_TIME, LATEST_TIME), "minutes");

  const res = await fetch(FUNCTIONS_URL + "/createNotification", {
    body: JSON.stringify({
      createdAt: firstTimeZoneDate.format("YYYY-MM-DD HH:mm:ss"),
    }),
    method: "POST",
  });

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
    let cronJob = schedule.scheduleJob(rule, () =>
      handleCronJob(cronJob, timeZone)
    );
  });
};

const handleCronJob = async (cronJob, timeZone) => {
  await fetch(FUNCTIONS_URL + "/sendOpenCameraNotification", {
    body: JSON.stringify({ timeZone }),
    method: "POST",
  });
  cronJob.cancel();
};

const createScheduler = () => {
  var rule = new schedule.RecurrenceRule();
  rule.hour = 0;
  rule.minute = 0;
  rule.second = 0;
  rule.tz = FIRST_TIME_ZONE;

  schedule.scheduleJob("*/4 * * * * *", createCronjobs);
};

createScheduler();

/*app.get(
  "/createNotification",
  async () =>
    await fetch(FUNCTIONS_URL + "/createNotification", {
      body: JSON.stringify({
        createdAt: new Date(new Date().getTime() + (2 * 60 + 1) * 60000),
      }),
      method: "POST",
    })
);

app.get(
  "/sendNotification",
  async () =>
    await fetch(FUNCTIONS_URL + "/sendOpenCameraNotification", {
      body: JSON.stringify({ timeZone: "Europe/Stockholm" }),
      method: "POST",
    })
);

app.listen(8090, () => {
  console.log("listening");
});*/
