import { GRAPHQL_ENDPOINT, HASURA_SECRET } from "./constants";
import { usersQuery } from "./queries";
import fetch from "node-fetch";
import { getUsersResult } from "./responseParsers";
import { createNotificationsMutation } from "./mutations";

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
): Promise<boolean | undefined> => {
  try {
    const res = await graphQLFetch(createNotificationsMutation(notifications));
    return !!res;
  } catch (e) {
    console.log(e);
    return;
  }
};
