import { IControl } from "./IControl";
import { IRule } from "./IRule";
import { IView } from "./IView";
import { IViewInstance } from "./IViewInstance";
export declare enum EventTimingOption {
    before = "before",
    after = "after"
}
export declare type RuleEventDetails = {
    type: EventTimingOption;
    rule: IRule;
};
export declare enum ViewInstanceEventTypeOption {
    list = "list",
    create = "create",
    execute = "execute",
    read = "read",
    update = "update",
    delete = "delete",
    unknown = "unknown"
}
export declare type ViewInstanceEventDetails = {
    type: ViewInstanceEventTypeOption;
    viewInstance: IViewInstance;
};
export declare type ChangedPropertyEvent = {
    when: EventTimingOption;
    control: IControl;
    property: string;
    eventName: string;
    value: string;
};
export declare type SmartFormEventTypes = "OnClick" | "Change" | "OnSetItemsCompleted";
export declare type SmartFormEvent = {
    id: string;
    typeName: string;
    typeObject: IView | IViewInstance | IControl | IRule;
    when: string;
    originalArguments: Array<unknown>;
};
