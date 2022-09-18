export interface Welcome {
    events: Events;
}
export interface Events {
    renderWorkflowStrip: string;
    hasServerEvent: string;
    event: Event[];
}
export interface Event {
    id: string;
    definitionId: string;
    type: EventType;
    isReference: Is;
    isInherited: Is;
    sourceId: string;
    sourceType: SourceType;
    isEnabled: string;
    name: string;
    handlers?: Handlers;
    ruleFriendlyName?: string;
    location?: string;
    instanceId?: string;
    viewId?: string;
    isCustomName?: string;
    ruleName?: string;
    subformId?: string;
    subformInstanceId?: string;
    formId?: string;
    ruleDescription?: string;
}
export interface Handlers {
    handler: HandlerUnion;
}
export declare type HandlerUnion = HandlerElement[] | PurpleHandler;
export interface HandlerElement {
    type: string;
    conditions?: PurpleConditions;
    actions: PurpleActions;
    function?: Function;
}
export interface PurpleActions {
    action: IndigoAction;
}
export declare type IndigoAction = PurpleAction[] | FluffyAction;
export interface PurpleAction {
    id: string;
    definitionId: string;
    type: PurpleType;
    executionType: string;
    isReference: Is;
    isInherited: Is;
    itemState: ItemState;
    instanceId: string;
    location: MessageLocationEnum;
    viewId?: string;
    parameters?: PurpleParameters;
    eventId?: string;
    messageLocation?: MessageLocationEnum;
    groupId?: string;
    ignoreInvisibleControls?: string;
    ignoreDisabledControls?: string;
    ignoreReadOnlyControls?: string;
    objectId?: string;
    method?: string;
    results?: PurpleResults;
}
export declare enum Is {
    False = "False",
    True = "True"
}
export declare enum ItemState {
    Added = "Added",
    All = "All",
    Changed = "Changed",
    Removed = "Removed"
}
export declare enum MessageLocationEnum {
    Control = "Control",
    ObjectProperty = "ObjectProperty",
    Result = "Result",
    Value = "Value",
    ViewField = "ViewField",
    ViewParameter = "ViewParameter"
}
export interface PurpleParameters {
    parameter: ParameterElement;
}
export interface ParameterElement {
    sourceType: MessageLocationEnum;
    sourceId: string;
    sourceInstanceId: string;
    targetType: MessageLocationEnum;
    targetId: string;
    targetInstanceId: string;
    isRequired?: string;
    sourceValue?: SourceValueUnion;
}
export declare type SourceValueUnion = SourceValueSourceValue | string;
export interface SourceValueSourceValue {
    source: Item[];
}
export interface ItemSourceValue {
    _?: string;
    xmlSpace: string;
    item?: Item;
}
export interface Item {
    sourceType: ItemLocation;
    sourceName?: string;
    sourceDisplayName?: string;
    sourceInstanceId?: string;
    sourceId?: string;
    dataType?: DataType;
    _?: string;
    sourceSubFormId?: string;
    sourceValue?: ItemSourceValue;
}
export declare enum DataType {
    Boolean = "Boolean",
    GUID = "Guid",
    Text = "Text",
    Unknown = "Unknown"
}
export declare enum ItemLocation {
    Control = "Control",
    ItemState = "ItemState",
    SystemVariable = "SystemVariable",
    Value = "Value",
    View = "View",
    ViewField = "ViewField",
    ViewParameter = "ViewParameter"
}
export interface PurpleResults {
    result: ParameterElement;
}
export declare enum PurpleType {
    ApplyStyle = "ApplyStyle",
    Calculate = "Calculate",
    Execute = "Execute",
    ExecuteControl = "ExecuteControl",
    Exit = "Exit",
    Transfer = "Transfer",
    Validate = "Validate"
}
export declare enum FluffyType {
    ApplyStyle = "ApplyStyle",
    Execute = "Execute",
    ExecuteControl = "ExecuteControl",
    List = "List",
    Open = "Open",
    Popup = "Popup",
    Transfer = "Transfer"
}
export interface FluffyAction {
    id: string;
    definitionId: string;
    type: PurpleType;
    executionType: ExecutionType;
    isReference: Is;
    isInherited: Is;
    itemState: ItemState;
    instanceId: string;
    location: ItemLocation;
    method?: string;
    viewId?: string;
    designTemplate?: string;
    parameters?: PurpleParameters;
    results?: FluffyResults;
    objectId?: string;
}
export declare enum ExecutionType {
    Asynchronous = "Asynchronous",
    Single = "Single",
    Synchronous = "Synchronous"
}
export interface FluffyResults {
    result: ParameterElement[];
}
export interface PurpleConditions {
    condition: ConditionUnion;
}
export declare type ConditionUnion = ConditionElement[] | PurpleCondition;
export interface ConditionElement {
    isReference: Is;
    isInherited: Is;
    isNotBlank?: IsBlank;
    equals?: ControlItemsCollection;
    notEquals?: ControlItemsCollection;
    isBlank?: IsBlank;
}
export interface ControlItemsCollection {
    item: Item[];
}
export interface IsBlank {
    item: Item;
}
export interface PurpleCondition {
    isReference: Is;
    isInherited: Is;
    isNotBlank?: IsBlank;
    equals?: ControlItemsCollection;
    or?: Or;
}
export interface Or {
    and: And;
    equals: ControlItemsCollection;
}
export interface And {
    equals: ControlItemsCollection[];
}
export interface Function {
    id: string;
    instanceId: string;
    viewItemsCollection?: ControlItemsCollection;
    controlItemsCollection?: ControlItemsCollection;
}
export interface PurpleHandler {
    type: HandlerType;
    actions: FluffyActions;
    conditions?: FluffyConditions;
}
export interface FluffyActions {
    action: IndecentAction;
}
export declare type IndecentAction = TentacledAction[] | StickyAction;
export interface TentacledAction {
    id: string;
    definitionId: string;
    type: PurpleType;
    executionType: ExecutionType;
    isReference: Is;
    isInherited: Is;
    itemState: ItemState;
    instanceId?: string;
    location?: SourceType;
    viewId?: string;
    method?: string;
    eventId?: string;
    designTemplate?: string;
    parameters?: FluffyParameters;
    objectId?: string;
    formId?: string;
    controlId?: string;
    order?: Order;
    filter?: ActionFilter;
    results?: TentacledResults;
}
export interface ActionFilter {
    filter: FilterFilter;
}
export interface FilterFilter {
    contains: ControlItemsCollection;
}
export declare enum SourceType {
    Control = "Control",
    Form = "Form",
    Rule = "Rule",
    SourceTypeView = "view",
    View = "View"
}
export interface Order {
    sorters: Sorters;
}
export interface Sorters {
    sorter: Sorter;
}
export interface Sorter {
    sourceType: MessageLocationEnum;
    sourceId: string;
    sourceName: string;
    sourceDisplayName: string;
    direction: string;
}
export interface FluffyParameters {
    parameter: ParameterUnion;
}
export declare type ParameterUnion = ParameterElement[] | ParameterElement;
export interface TentacledResults {
    result: ParameterUnion;
}
export interface StickyAction {
    id: string;
    definitionId: string;
    type: FluffyType;
    executionType: ExecutionType;
    isReference: Is;
    isInherited: Is;
    itemState: ItemState;
    instanceId?: string;
    subformId?: string;
    location?: SourceType;
    heading?: string;
    viewId?: string;
    formId?: string;
    parameters?: FluffyParameters;
    method?: string;
    results?: TentacledResults;
    eventId?: string;
    objectId?: string;
    controlId?: string;
}
export interface FluffyConditions {
    condition: ConditionsConditionClass;
}
export interface ConditionsConditionClass {
    isReference: Is;
    isInherited: Is;
    isNotBlank?: IsBlank;
    equals?: ControlItemsCollection;
}
export declare enum HandlerType {
    If = "if"
}
export declare enum EventType {
    System = "System",
    User = "User"
}
export declare class Convert {
    static toWelcome(json: string): Welcome;
    static welcomeToJson(value: Welcome): string;
}
