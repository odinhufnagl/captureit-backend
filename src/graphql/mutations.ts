import { objectToGraphql } from "./helpers";

export const createNotificationsMutation = (
  obj: Array<IDBNotification>
): string => {
  const input = objectToGraphql(obj as any);
  return `
  mutation {
    insert_notifications(objects:${input}) {returning{id}}
  }
    `;
};
