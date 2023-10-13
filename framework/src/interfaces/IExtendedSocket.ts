import { Socket } from "socket.io-client";


export interface IExtendedSocket extends Socket {
  username: string;
  applicationId: string;
}
