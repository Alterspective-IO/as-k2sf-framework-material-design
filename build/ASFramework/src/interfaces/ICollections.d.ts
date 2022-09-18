import { Rules } from "../Models/rulev2";
import { IControl } from "./IControl";
import { IView } from "./IView";
import { IViewInstance } from "./IViewInstance";
export declare class ICollections {
    viewInstanceControls: IControl[];
    viewInstances: IViewInstance[];
    views: IView[];
    rules?: Rules;
}
