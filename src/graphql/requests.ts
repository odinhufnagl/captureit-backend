import { GRAPHQL_ENDPOINT, HASURA_SECRET } from "./constants";
import { cronJobsQuery, usersQuery } from "./queries";
import fetch from "node-fetch";
import {
  createDBCronJobResult,
  createNotificationsResult,
  getDBCronJobsResult,
  getUsersResult,
} from "./responseParsers";
import {
  createCronJobMutation,
  createNotificationsMutation,
  createNotificationTimeZonesMutation,
  createTimeZonesMutation,
  deleteCronJobMutation,
  updateNotificationMutation,
} from "./mutations";

const graphQLFetch = async (
  query: string,
  variables?: unknown
): Promise<any> => {
  try {
    let res = await fetch(GRAPHQL_ENDPOINT, {
      headers: {
        "x-hasura-admin-secret": HASURA_SECRET,
        "content-type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ query, variables }),
    });
    res = await res.json();
    return res;
  } catch (e) {
    console.log(e);
  }
};

export const getUsers = async (
  where?: Record<string, unknown>
): Promise<IUser[] | undefined> => {
  try {
    const res = await graphQLFetch(usersQuery(where));
    return getUsersResult(res);
  } catch (e) {
    console.log(e);
    return;
  }
};

export const createNotifications = async (
  notifications: Array<IDBNotification>
): Promise<IDBNotification[] | boolean | undefined> => {
  try {
    const res = await graphQLFetch(createNotificationsMutation(notifications));
    return createNotificationsResult(res);
  } catch (e) {
    console.log(e);
    return;
  }
};

export const updateNotification = async (
  id: number,
  notification: IDBNotification
): Promise<IDBNotification[] | boolean | undefined> => {
  try {
    await graphQLFetch(updateNotificationMutation(notification, id));
    return true;
  } catch (e) {
    console.log(e);
    return;
  }
};

export const createTimeZones = async (
  timeZones: Array<ITimeZone>
): Promise<ITimeZone[] | boolean | undefined> => {
  try {
    await graphQLFetch(createTimeZonesMutation(timeZones));
    return true;
  } catch (e) {
    console.log(e);
    return;
  }
};

export const createNotificationTimeZones = async (
  notificationTimeZones: Array<INotificationTimeZone>
): Promise<ITimeZone[] | boolean | undefined> => {
  try {
    await graphQLFetch(
      createNotificationTimeZonesMutation(notificationTimeZones)
    );
    return true;
  } catch (e) {
    console.log(e);
    return;
  }
};

export const createDBCronJob = async (
  cronJob: IDBCronJob
): Promise<number | undefined> => {
  try {
    const res = await graphQLFetch(createCronJobMutation(cronJob));
    console.log("res, createDBCronJob", res);
    return createDBCronJobResult(res).id;
  } catch (e) {
    console.log(e);
    return;
  }
};

export const getDBCronJobs = async (): Promise<IDBCronJob[] | undefined> => {
  try {
    const res = await graphQLFetch(cronJobsQuery());

    return getDBCronJobsResult(res);
  } catch (e) {
    console.log(e);
    return;
  }
};

export const deleteDBCronJob = async (id: number): Promise<boolean> => {
  try {
    await graphQLFetch(deleteCronJobMutation(id));
    console.log("res1 deletecronjob");
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};
