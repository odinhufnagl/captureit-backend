import * as admin from "firebase-admin";
import { messaging } from "firebase-admin";

export const sendNotification = async (
  tokens: string[],
  notification: INotification,
  data?: unknown
): Promise<boolean | undefined> => {
  console.log(notification);

  try {
    console.log("tokens", tokens);
    if (!tokens || tokens.length === 0) {
      throw Error;
    }
    const payload = {
      notification,
      ...(data ? { data: data } : {}),
    };
    let res;
    for (let i = 0; i < 3; i++) {
      res = await admin
        .messaging()
        .sendToDevice(tokens, payload as messaging.MessagingPayload, {
          priority: "high",
        });
      if (res) {
        break;
      }
    }
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};
