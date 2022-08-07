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
  const firstTimeZoneDate = getFirstTimeZoneDate();
  const dateToSendNotification = new Date(
    firstTimeZoneDate.getTime() +
      getRandomNumber(EARLIEST_TIME, LATEST_TIME) * 60000
  );
  const res = await fetch(FUNCTIONS_URL + "/createNotification", {
    body: JSON.stringify({ createdAt: dateToSendNotification }),
    method: "POST",
  });
  if (!res) {
    return;
  }
  timezones.forEach((timeZone) => {
    var rule = new schedule.RecurrenceRule();
    rule.dayOfWeek = dateToSendNotification.getUTCDay();
    rule.hour = dateToSendNotification.getUTCHours();
    rule.minute = dateToSendNotification.getUTCMinutes();
    rule.second = dateToSendNotification.getUTCSeconds();
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
  schedule.scheduleJob(rule, createCronjobs);
};

createScheduler();

/*app.get("/createCronJobs", () => {
  const firstTimeZoneDate = getFirstTimeZoneDate();
  const dateToSendNotification = new Date(
    firstTimeZoneDate.getTime() +
      getRandomNumber(EARLIEST_TIME, LATEST_TIME) * 60000
  );
  console.log(
    firstTimeZoneDate,
    dateToSendNotification,
    dateToSendNotification.getUTCHours(),
    new Date(dateToSendNotification)
  );
});

app.get(
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
