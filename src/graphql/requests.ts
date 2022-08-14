import { GRAPHQL_ENDPOINT, HASURA_SECRET } from "./constants";
import { usersQuery } from "./queries";
import fetch from "node-fetch";
import { createNotificationsResult, getUsersResult } from "./responseParsers";
import {
  createNotificationsMutation,
  createNotificationTimeZonesMutation,
  createTimeZonesMutation,
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
    console.log("res", res);
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
