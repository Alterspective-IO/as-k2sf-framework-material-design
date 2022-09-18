import { BaseArray, BaseItem } from "./base";
import { IView } from "../interfaces/IView";
import { IControllerDefinition } from "../interfaces/AGIControllerDefinition";
import { IControls } from "../interfaces/IControls";
import { IFields } from "../interfaces/IFields";
import { INameValue } from "../interfaces/INameValue";
import { IStyleElement } from "../interfaces/IStyleElement";
import { IControlOfView } from "../interfaces/IControlOfView";
import { IViewInstance } from "../interfaces/IViewInstance";
import { IViewInstances } from "../interfaces/IViewInstances";
import { ISmartObject } from "../interfaces/SmartObjects/ISmartObject";
import { ViewInstanceEventDetails, ViewInstanceEventTypeOption } from "../interfaces/IEvents";
import { Rule } from "./rulev2";
import { IControl } from "../interfaces/IControl";
export declare class ViewInstances extends BaseArray<ViewInstance, IControllerDefinition.Controller, IView> implements IViewInstances {
    constructor(controllers: IControllerDefinition.Controller[] | undefined, parent: IView);
}
export declare class ViewInstance extends BaseItem<IControllerDefinition.Controller, IView> implements IViewInstance {
    constructor(view?: IControllerDefinition.Controller, parent?: IView);
    isFormViewInstance: boolean;
    controlOfView: IControlOfView;
    viewId: string;
    controls: IControls;
    associations: {
        [key: string]: string;
    }[];
    fields: IFields;
    typeView: IControllerDefinition.TypeView;
    instanceId: string | undefined;
    panelId: string | undefined;
    mainTable: string | undefined;
    dataSourceId: string | undefined;
    contextId: string | undefined;
    contextType: IControllerDefinition.TType | undefined;
    viewName: string | undefined;
    isEnabled: string | undefined;
    viewInstanceManipulations?: ViewInstanceManipulations;
    eventTarget: EventTarget;
    as<T extends ListViewInstance>(c: {
        new (): T;
    }): T;
    addListener(type: ViewInstanceEventTypeOption, callback: (evt: CustomEvent<ViewInstanceEventDetails>) => void): void;
    dispatch(type: ViewInstanceEventTypeOption): boolean;
    removeListener(type: ViewInstanceEventTypeOption, callback: (evt: CustomEvent<any>) => void): void;
    get smartobject(): ISmartObject;
    get rules(): Rule[];
}
export declare class controlOfView implements IControlOfView {
    constructor(viewControlDetails: IControllerDefinition.Control | undefined);
    properties: INameValue[] | undefined;
    dataType: string | undefined;
    id: string | undefined;
    name: string | undefined;
    styles: IStyleElement[] | undefined;
    type: string | undefined;
}
export declare class ViewInstanceManipulations {
    viewInstance: ViewInstance;
    constructor(viewInstance: ViewInstance);
    makeMovable(width?: string): void;
}
export declare class ListViewInstance extends ViewInstance {
    _cols: IControl | undefined;
    getSelectedRowCounter(): string | undefined;
    getSelectedRowData(): any | undefined;
    setSelectedRowByCounter(counter: string): void;
    simulateUserEventAgainstCounterRow(counter: string, action: "click" | "dblclick"): void;
    getColumnControls(): {
        header?: IControl;
        column?: IControl;
        display?: IControl;
    }[];
}
