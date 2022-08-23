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

export const createTimeZonesMutation = (obj: Array<ITimeZone>): string => {
  const input = objectToGraphql(obj as any);
  return `
  mutation {
    insert_timeZones(objects:${input}) {returning{name}}
  }
    `;
};

export const updateNotificationMutation = (
  obj: IDBNotification,
  id: number
): string => {
  const setInput = objectToGraphql(obj as any);
  const idInput = objectToGraphql(id as any);
  return `
  mutation {
    update_notifications_by_pk(pk_columns:{id:${idInput}}, _set:${setInput}) {createdAt}
  }
    `;
};

export const createNotificationTimeZonesMutation = (
  obj: Array<INotificationTimeZone>
): string => {
  const input = objectToGraphql(obj as any);
  return `
  mutation {
    insert_notifications_timeZones(objects:${input}) {returning{timeZoneName}}
  }
    `;
};

export const createCronJobMutation = (obj: IDBCronJob): string => {
  const input = objectToGraphql(obj as any);
  return `
  mutation {
    insert_cronJobs_one(object:${input}) {id}
  }
    `;
};

export const deleteCronJobMutation = (id: number): string => {
  const idInput = objectToGraphql(id as any);
  return `
  mutation {delete_cronJobs_by_pk(id: ${idInput}) {id}} 
    `;
};
