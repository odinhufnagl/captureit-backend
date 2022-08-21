interface IUser {
  notificationToken: string;
  id?: string;
}

interface IDBNotification {
  id?: number;
  createdAt?: string;
  title: string;
}

interface INotification {
  title: string;
  body: string;
}

interface ITimeZone {
  name: string;
}

interface INotificationTimeZone {
  timeZoneName: string;
  notificationId: number;
}

interface IDBCronJob {
  id?: number;
  timeZone: string;
  day: number;
  hour: number;
  minute: number;
  second: number;
  notificationId: number;
}
