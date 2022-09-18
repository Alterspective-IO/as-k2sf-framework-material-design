import { IControllerDefinition } from "../interfaces/AGIControllerDefinition";
import { ControlType } from "../interfaces/enums";
import { IAttachedCustomControl } from "../interfaces/IAttachedCustomControl";
import { IContainer } from "../interfaces/IContainer";
import { IContentControl } from "../interfaces/IContentControl";
import { IControlEvent } from "../interfaces/IControlEvent";
import { IControlEvents } from "../interfaces/IControlEvents";
import { IControlProperties } from "../interfaces/IControlProperties";
import { IControlRules } from "../interfaces/IControlRules";
import { IControls } from "../interfaces/IControls";
import { IEmittedControlEvent } from "../interfaces/IEmittedControlEvent";
import { INameValueAny } from "../interfaces/INameValue";
import { ISmartObject } from "../interfaces/SmartObjects/ISmartObject";
import { IStyleElement } from "../interfaces/IStyleElement";
import { BaseArray, BaseItem } from "./base";
import { IField } from "../interfaces/IField";
import { IControl } from "../interfaces/IControl";
import { ChangedPropertyEvent, EventTimingOption } from "../interfaces/IEvents";
export declare class Controls extends BaseArray<Control, IControllerDefinition.Control, IContainer> implements IControls {
    constructor(control: IControllerDefinition.Control[] | undefined, parent: IContainer);
}
export declare class Control extends BaseItem<IControllerDefinition.Control, IContainer> implements IControl {
    constructor(control?: IControllerDefinition.Control, parent?: IContainer);
    private eventTarget;
    private readonly targetType;
    styles: IStyleElement;
    type: ControlType;
    properties?: IControlProperties;
    id?: string;
    dataType: IControllerDefinition.Type | undefined;
    panelId: string | undefined;
    fieldId: string | undefined;
    expressionId?: string | undefined;
    controlTemplate?: IControllerDefinition.ControlTemplate | undefined;
    attachedEvents: EmittedControlEvent[];
    events: IControlEvents;
    attachedCustomControl?: IAttachedCustomControl;
    extensions?: ControlExtensions;
    addPropertyListener(type: string, timing: EventTimingOption, callback: (evt: CustomEvent<ChangedPropertyEvent>) => void): void;
    dispatchPropertyEvent(type: string, timing: EventTimingOption, event: ChangedPropertyEvent): boolean;
    removePropertyListener(type: string, timing: EventTimingOption, callback: (evt: CustomEvent<ChangedPropertyEvent>) => void): void;
    private _rules;
    private _rulesInitialized;
    get rules(): IControlRules;
    get value(): string | undefined;
    set value(value: string | undefined);
    private _field;
    get field(): IField | null;
    execute(method: string, optionalPropertyName: string, optionalValue: string): void;
    getControlPropertyValue(propertyName: string): any;
    setControlPropertyValue(propertyName: string, propertyValue: string): any;
    getPropertyValue(property: string): any;
    setPropertyValue(property: string, value: any): void;
    setControlVisibility(IsVisible: boolean): void;
    get smartobject(): ISmartObject;
    asContentControl(): IContentControl;
}
export declare class ContentControl extends Control implements IContentControl {
    private _autoResize;
    constructor();
    iframeResizedCallback: (e: iframeResizer.IFrameResizedData) => void;
    showSomething(something: string): string;
    set autoResize(value: boolean);
    get containedIFrame(): HTMLIFrameElement;
    get autoResize(): boolean;
}
export declare class EmittedControlEvent {
    control: Control;
    eventName: string;
    controlEvent: string;
    controlEventState: string | null;
    type: string;
    functionToExecute: Function;
    enabled: boolean;
    additional?: any;
    id?: string;
    deleted: boolean;
    constructor(control: Control, name: string, event: string, state: string | null, type: string, func: Function, enabled: boolean, additional?: any, optionalId?: string);
    remove(): void;
}
export declare class ControlEvent implements IControlEvent {
    name: string;
    controlEvent: string;
    controlEventState: string;
    type: string;
    applyTo: string;
    parentControl: Control;
    constructor(name: string, controlEvent: string, controlEventState: string, type: string, applyTo: string, parentControl: Control);
    removeEvent(event: any): void;
    addEvent(func: Function, optionalAdditional?: any, optionalId?: string): IEmittedControlEvent;
}
export declare class ControlExtensions {
    [name: string]: any;
    properties: Array<string>;
    constructor();
    addExtension(nameValue: INameValueAny): void;
}
