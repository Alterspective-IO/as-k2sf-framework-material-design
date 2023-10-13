import { ISettings } from "../interfaces/ISettings";
export type SettingChangedEvent = {
    setting: "notificationsServerURL" | "scriptFilesUrl";
    oldValue: string;
    newValue: string;
};
export declare class Settings extends EventTarget implements ISettings {
    constructor(scriptFilesUrl: string, notificationsServerURL: string);
    scriptFilesUrl: string;
    private readonly targetType;
    private _notificationsServerURL;
    get notificationsServerURL(): string;
    set notificationsServerURL(v: string);
    addListener(callback: (evt: CustomEvent<SettingChangedEvent>) => void): void;
    private dispatch;
    removeListener(callback: (evt: CustomEvent<SettingChangedEvent>) => void): void;
}
