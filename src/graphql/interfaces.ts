interface IUser {
  notificationToken: string;
  id?: string;
}

interface IDBNotification {
  id?: string;
  createdAt?: string;
  title: string;
}

interface INotification {
  title: string;
  body: string;
}
