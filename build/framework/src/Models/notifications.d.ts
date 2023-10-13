/// <reference types="node" />
import { EventEmitter } from "events";
import { Framework } from "./framework";
import { INotificationMessage } from "../interfaces/INotificationMessage";
import { INotifications } from "../interfaces/INotifications";
import { IEmissions } from "../interfaces/IEmissions";
import { IExtendedSocket } from "../interfaces/IExtendedSocket";
export declare class Notifications extends EventEmitter implements INotifications {
    as: Framework;
    private URL;
    socket?: IExtendedSocket;
    private _untypedOn;
    private _untypedEmit;
    rooms: Set<string>;
    on: <K extends keyof IEmissions>(event: K, listener: IEmissions[K]) => this;
    emit: <K extends keyof IEmissions>(event: K, ...args: Parameters<IEmissions[K]>) => boolean;
    constructor(as: Framework);
    private initializeNotifications;
    attachDefaultEventReceivers(): void;
    joinRoom(roomName: string): void;
    leaveRoom(roomName: string): void;
    rejoinRooms(): void;
    sendNotificationMessage(notification: INotificationMessage): void;
    tryReconnect: () => void;
    get validateSocket(): boolean;
}
