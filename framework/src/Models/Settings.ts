import { ISettings } from "../interfaces/ISettings";

export type SettingChangedEvent =
{
    setting: "notificationsServerURL" | "scriptFilesUrl"
     oldValue:string
     newValue: string
}

export class Settings extends EventTarget implements ISettings {
    constructor(scriptFilesUrl: string, notificationsServerURL: string) {
        super();
        this._notificationsServerURL = notificationsServerURL;
        this.scriptFilesUrl = scriptFilesUrl;
    }
    scriptFilesUrl: string;
    private readonly targetType = 'setting-changed';

    private _notificationsServerURL : string;
    public get notificationsServerURL() : string {
        return this._notificationsServerURL;
    }
    public set notificationsServerURL(v : string) {
        let oldValue = this._notificationsServerURL
        this._notificationsServerURL = v;
        if(oldValue!=v)
        {
            this.dispatch({
                        setting: "notificationsServerURL",
                        oldValue: oldValue,
                        newValue: this._notificationsServerURL
                    })
        }
    }


    public addListener(callback: (evt: CustomEvent<SettingChangedEvent>) => void): void {
        return this.addEventListener(this.targetType, callback as (evt: Event) => void);
      }
    
    private dispatch(event: SettingChangedEvent): boolean {
        return this.dispatchEvent(new CustomEvent(this.targetType, { detail: event }));
      }
    
     public removeListener(callback: (evt: CustomEvent<SettingChangedEvent>) => void): void {
        return this.removeEventListener(this.targetType, callback as (evt: Event) => void);
      }
    

}
