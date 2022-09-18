import { BaseArray, BaseItem } from "./base";
import { IViews } from "../interfaces/IViews";
import { IView } from "../interfaces/IView";
import { IControllerDefinition } from "../interfaces/AGIControllerDefinition";
import { IViewInstance } from "../interfaces/IViewInstance";
import { IContainer } from "../interfaces/IContainer";
export declare class Views extends BaseArray<View, IControllerDefinition.Controller, IContainer> implements IViews {
    constructor(controllers: IControllerDefinition.Controller[] | undefined, parent: IContainer);
}
export declare class View extends BaseItem<IControllerDefinition.Controller, IContainer> implements IView {
    constructor(view: IControllerDefinition.Controller, parent: IContainer);
    isEnabled?: string | undefined;
    viewInstances: IViewInstance[];
    viewName: string | undefined;
    typeView?: IControllerDefinition.TypeView | undefined;
    id?: string | undefined;
    contextType?: IControllerDefinition.TType | undefined;
}
