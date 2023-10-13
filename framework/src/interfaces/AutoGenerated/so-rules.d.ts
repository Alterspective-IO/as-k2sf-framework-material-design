export interface EventDefinition {
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
    isReference: IsInherited;
    isInherited: IsInherited;
    sourceId: string;
    sourceType: SourceType;
    isEnabled: string;
    name: string;
    handlers?: Handlers;
    ruleFriendlyName?: string;
    location?: Location;
    isCustomName?: string;
    ruleName?: string;
    instanceId?: string;
    viewId?: string;
}
export interface Handlers {
    handler: HandlerElement[] | PurpleHandler;
}
export interface HandlerElement {
    type: string;
    conditions?: PurpleConditions;
    actions: PurpleActions;
}
export interface PurpleActions {
    action: ActionsActionClass;
}
export interface ActionsActionClass {
    id: string;
    definitionId: string;
    type: ActionType;
    executionType: ExecutionType;
    isReference: IsInherited;
    isInherited: IsInherited;
    itemState: ItemState;
    instanceId: string;
    location: SourceType;
    method: string;
    viewId?: string;
    designTemplate: string;
    parameters?: PurpleParameters;
    results: PurpleResults;
    objectId?: string;
}
export declare enum ExecutionType {
    Asynchronous = "Asynchronous",
    Single = "Single",
    Synchronous = "Synchronous"
}
export declare enum IsInherited {
    False = "False",
    True = "True"
}
export declare enum ItemState {
    Added = "Added",
    All = "All",
    Changed = "Changed",
    Removed = "Removed"
}
export declare enum SourceType {
    Control = "Control",
    Form = "Form",
    Rule = "Rule",
    View = "View"
}
export interface PurpleParameters {
    parameter: ParameterElement;
}
export interface ParameterElement {
    sourceType: ParameterSourceType;
    sourceId: string;
    sourceInstanceId?: string;
    targetType: TargetType;
    targetId: string;
    targetInstanceId?: string;
    isRequired?: string;
    sourceValue?: SourceValueSourceValue | string;
    targetPath?: string;
}
export declare enum ParameterSourceType {
    Control = "Control",
    FormParameter = "FormParameter",
    ObjectProperty = "ObjectProperty",
    Result = "Result",
    SystemVariable = "SystemVariable",
    Value = "Value",
    ViewField = "ViewField",
    ViewParameter = "ViewParameter"
}
export interface SourceValueSourceValue {
    source: SourceElement[] | PurpleSource;
}
export interface SourceElement {
    _?: string;
    sourceType: ParameterSourceType;
    sourceId?: string;
    sourceName?: string;
    sourceDisplayName?: string;
    sourceInstanceId?: string;
}
export interface PurpleSource {
    _: string;
    sourceType: ParameterSourceType;
}
export declare enum TargetType {
    Control = "Control",
    ControlProperty = "ControlProperty",
    MessageProperty = "MessageProperty",
    MethodParameter = "MethodParameter",
    ObjectProperty = "ObjectProperty",
    ViewField = "ViewField",
    ViewParameter = "ViewParameter"
}
export interface PurpleResults {
    result: ParameterElement[];
}
export declare enum ActionType {
    ApplyStyle = "ApplyStyle",
    Calculate = "Calculate",
    Execute = "Execute",
    ExecuteControl = "ExecuteControl",
    Transfer = "Transfer",
    Validate = "Validate"
}
export interface PurpleConditions {
    condition: PurpleCondition;
}
export interface PurpleCondition {
    isReference: IsInherited;
    isInherited: IsInherited;
    isNotBlank?: IsNotBlank;
    equals?: Equals;
}
export interface Equals {
    item: EqualsItem[];
}
export interface EqualsItem {
    sourceType: ParameterSourceType;
    sourceName?: string;
    sourceDisplayName?: string;
    sourceInstanceId?: string;
    sourceId?: string;
    dataType?: string;
    sourceValue?: PurpleSourceValue;
    _?: string;
}
export interface PurpleSourceValue {
    _: string;
    xmlSpace: string;
}
export interface IsNotBlank {
    item: IsNotBlankItem;
}
export interface IsNotBlankItem {
    sourceType: ParameterSourceType;
    sourceName: string;
    sourceInstanceId: string;
    sourceId: string;
    dataType: string;
    sourceDisplayName?: string;
}
export interface PurpleHandler {
    type: HandlerType;
    actions: FluffyActions;
    conditions?: FluffyConditions;
}
export interface FluffyActions {
    action: ActionElement[] | PurpleAction;
}
export interface ActionElement {
    id: string;
    definitionId: string;
    type: ActionType;
    executionType: ExecutionType;
    isReference: IsInherited;
    isInherited: IsInherited;
    itemState: ItemState;
    instanceId?: string;
    location?: SourceType;
    viewId?: string;
    method?: string;
    parameters?: FluffyParameters;
    controlId?: string;
    instanceGuid?: string;
    designTemplate?: string;
    objectId?: string;
    filter?: ActionFilter;
    results?: FluffyResults;
}
export interface ActionFilter {
    filter: FilterFilter;
}
export interface FilterFilter {
    contains: Contains;
}
export interface Contains {
    item: ContainsItem[];
}
export interface ContainsItem {
    sourceType: ParameterSourceType;
    sourceName?: string;
    sourceDisplayName?: string;
    sourceInstanceId?: string;
    sourceId?: string;
    dataType: string;
    sourceValue?: FluffySourceValue;
}
export interface FluffySourceValue {
    xmlSpace: string;
    item: EqualsItem;
}
export interface FluffyParameters {
    parameter: ParameterElement[] | ParameterElement;
}
export interface FluffyResults {
    result: ParameterElement;
}
export interface PurpleAction {
    id: string;
    definitionId: string;
    type: MessageLocation;
    executionType: ExecutionType;
    isReference: IsInherited;
    isInherited: IsInherited;
    itemState: ItemState;
    instanceId?: string;
    location?: SourceType;
    eventId?: string;
    designTemplate?: string;
    messageLocation?: MessageLocation;
    headingIsLiteral?: IsInherited;
    bodyIsLiteral?: IsInherited;
    parameters?: FluffyParameters;
    subformId?: string;
    heading?: string;
    subformWidth?: string;
    subformHeight?: string;
    viewId?: string;
    formId?: string;
    method?: string;
    results?: TentacledResults;
    objectId?: string;
    controlId?: string;
}
export declare enum MessageLocation {
    ApplyStyle = "ApplyStyle",
    Execute = "Execute",
    ExecuteControl = "ExecuteControl",
    List = "List",
    Open = "Open",
    Popup = "Popup",
    ShowMessage = "ShowMessage",
    Transfer = "Transfer"
}
export interface TentacledResults {
    result: ParameterElement[] | ParameterElement;
}
export interface FluffyConditions {
    condition: FluffyCondition;
}
export interface FluffyCondition {
    isReference: IsInherited;
    isInherited: IsInherited;
    isNotBlank: IsNotBlank;
}
export declare enum HandlerType {
    If = "if"
}
export declare enum Location {
    ASCommonUIHeader = "AS.Common.UI.Header",
    ASFrameworkLoader = "AS.Framework.Loader",
    BasicSOItemManualCreated = "BasicSO Item Manual Created",
    TestFrameworkLoaderLotsOfViews = "Test Framework Loader - lots of views"
}
export declare enum EventType {
    System = "System",
    User = "User"
}
