import { IExtendedSocket } from "./IExtendedSocket";
import { INotificationMessage } from "./INotificationMessage";


export interface IEmissions {
  connect: (socket: IExtendedSocket) => void;
  disconnect: (socket: IExtendedSocket) => void;
  error: (socket: IExtendedSocket) => void;
  notificationMessageReceived: (message: INotificationMessage) => void;
  reconnected: (socket: IExtendedSocket) => void;
  reconnecting : (socket: IExtendedSocket) => void;
}
