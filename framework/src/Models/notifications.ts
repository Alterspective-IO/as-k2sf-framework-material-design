import { EventEmitter } from "events";
import { io, ManagerOptions, SocketOptions } from "socket.io-client";
import { Framework } from "./framework";
import { INotificationMessage } from "../interfaces/INotificationMessage";
import { INotifications } from "../interfaces/INotifications";
import { IEmissions } from "../interfaces/IEmissions";
import { IExtendedSocket } from "../interfaces/IExtendedSocket";
import { SettingChangedEvent } from "./Settings";
import { setInterval } from "timers/promises";

export class Notifications extends EventEmitter implements INotifications {
  private URL: string = "http://localhost:3200";
  public socket?: IExtendedSocket; // io(URL, { autoConnect: true });
  private _untypedOn = this.on;
  private _untypedEmit = this.emit;
  public rooms = new Set<string>() //use to help maintain state of rooms a user is in so if we are disconnected we can reconnect and join the rooms again
  public override on = <K extends keyof IEmissions>(
    event: K,
    listener: IEmissions[K]
  ): this => this._untypedOn(event, listener);
  public override emit = <K extends keyof IEmissions>(
    event: K,
    ...args: Parameters<IEmissions[K]>
  ): boolean => this._untypedEmit(event, ...args);

  constructor(public as: Framework) {
    super();

    /** Listen to setting incase notifications url is changed as it could be empty initially  */
    as.settings.addListener((e: CustomEvent<SettingChangedEvent>) => {
      if (e.detail.setting == "notificationsServerURL") {
        this.initializeNotifications();
      }
    });
    this.initializeNotifications();
  }

  private initializeNotifications() {
    if (this.as.settings.notificationsServerURL != "") {
      this.URL = this.as.settings.notificationsServerURL;

      let socketOptions:Partial<ManagerOptions & SocketOptions> =  { 
        upgrade:true,
        autoConnect: false,
         auth: { user: this.as.user },
         reconnection: false,
        //  reconnectionAttempts: 10000,
        //  reconnectionDelay: 1000,
        //  reconnectionDelayMax: 5000,
        //  timeout: 2000   
   }
      this.socket = io(this.URL,socketOptions) as IExtendedSocket;;
      this.attachDefaultEventReceivers();
      
      this.socket.open()
    } else {
      if (this.socket) {
        /** If there was a connection and notificationUrl cleared disconnect */
        this.socket.disconnect();
        console.info("Simplied Notifications: Disabled")
      }
    }
  }

  attachDefaultEventReceivers() {
    // // client-side
    if (this.socket) {
      this.socket.on("connect", () => {
        console.log(`notifications connected(${this.socket!.id})`); // x8WIv7-mJelg7on_ALbx
        this.emit("connect", this.socket!);
      });

      this.socket.on("disconnect", () => {
        console.log(`notifications disconnect(${this.socket!.id})`);
        this.emit("disconnect", this.socket!);
        this.socket!.connect();
      });

      this.socket.io.on("error", (error) => {
        console.log(`notifications error(${this.socket!.id})`);
        //this.emit("disconnect", this.socket!);
        //this.socket!.connect();
      });

      this.socket.on("NotificationMessage", (message) => {
        console.log(`NotificationMessage`);
        this.emit("notificationMessageReceived", message);
      });

      this.socket.on("connect_error", (err) => {
        console.log(`notifications connect_error(${err.message}`);
        if (err.message === "invalid username") {
          console.error(err);
        }
      });

      this.socket.io.on("reconnect", () => {
        console.log(`reconnected - rejoining rooms`);
        this.rejoinRooms();
      });

      this.socket.io.on("close", this.tryReconnect);
    }
  }

  joinRoom(roomName: string) {
    if (this.validateSocket) this.socket!.emit("join", roomName);
    console.info(`Joined room [${roomName}]`)
    this.rooms.add(roomName)
  }

  leaveRoom(roomName: string) {
    if (this.validateSocket) this.socket!.emit("leave", roomName);
    console.info(`Left room [${roomName}]`)
    this.rooms.delete(roomName)
  }

  rejoinRooms()
  {
    if (this.validateSocket)
    {
      this.rooms.forEach(room=>
      { 
        console.info(`Rejoining room [${room}]`)
        this.joinRoom(room)
      })
    }
  }

  sendNotificationMessage(notification: INotificationMessage) {
    if (this.validateSocket)
      this.socket!.emit("NotificationMessage", notification);
  }


  tryReconnect = () => {
    console.warn("Trying to reconnect to notifications service...")
    setTimeout(() => {
      this.emit("reconnecting", this.socket!);
      this.socket?.io.open((err) => {
        if (err) {
          console.warn("Failed to reconnect to notifications service...", err)
          this.tryReconnect();
        }
        else
        {
          this.rejoinRooms();
          this.emit("reconnected", this.socket!);
        }
      });
    }, 2000);
  }

  get validateSocket(): boolean {
    if (this.socket) return true;
    console.warn(
      `Notifications has not been initialized, check the notifications URL: [${this.as.settings.notificationsServerURL}]`
    );
    return false;
  }
}
