import { IControl } from "./IControl";
export interface IContentControl extends IControl {
    set autoResize(value: boolean);
    get autoResize(): boolean;
    showSomething(something: string): string;
}
