import { EventEmitter } from 'events';
import { IExtendedSocket } from "./IExtendedSocket";
import { IEmissions } from "./IEmissions";
import { INotificationMessage } from "./INotificationMessage";


export interface INotifications extends EventEmitter {

  socket?: IExtendedSocket;
  on: <K extends keyof IEmissions>(event: K, listener: IEmissions[K]) => this;
  emit: <K extends keyof IEmissions>(event: K, ...args: Parameters<IEmissions[K]>) => boolean;
  sendNotificationMessage(msg: INotificationMessage): void;
  joinRoom(roomName: string): void;
  leaveRoom(roomName: string): void;
}
