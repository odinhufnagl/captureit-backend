interface UserResult {
  data: UserResultData;
}
interface UserResultData {
  users: IUser[];
}

interface NotificationResult {
  data: NotificationResultData;
}
interface NotificationResultData {
  insert_notifications: NotificationResultReturning; // eslint-disable-line
}
interface NotificationResultReturning {
  returning: INotification[];
}

export const getUsersResult = (res: UserResult): IUser[] | undefined =>
  res.data && res.data.users;

export const createNotificationsResult = (
  res: NotificationResult
): IDBNotification[] | boolean | undefined =>
  res.data &&
  res.data.insert_notifications.returning.length > 0 &&
  res.data.insert_notifications.returning;
