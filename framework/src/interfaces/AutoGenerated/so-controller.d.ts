export interface ControllerDefinition {
    controllers: Controllers;
}
export interface Controllers {
    formId: string;
    controller: Controller[];
    validationGroups: string;
    expressions: Expressions;
    validationPatterns: string;
}
export declare class Controller {
    id?: string;
    typeView?: TypeView;
    controls?: Controls;
    instanceId?: string;
    panelId?: string;
    mainTable?: string;
    dataSourceId?: string;
    contextId?: string;
    contextType?: TType;
    viewName?: string;
    properties?: ControllerProperties;
    fields?: Fields;
    associations?: Associations;
    isEnabled?: string;
}
export interface Associations {
    association: {
        [key: string]: string;
    }[];
}
export declare enum TType {
    Object = "Object"
}
export interface Controls {
    control: Control[];
}
export interface Control {
    id: string;
    name: string;
    type: string;
    dataType?: Type;
    properties: PropertiesProperties | string;
    panelId?: string;
    fieldId?: string;
    expressionId?: string;
    controlTemplate?: ControlTemplate;
}
export declare enum ControlTemplate {
    Display = "display",
    Edit = "edit",
    Header = "header",
    None = "none"
}
export declare enum Type {
    AutoGUID = "AutoGuid",
    AutoNumber = "AutoNumber",
    Date = "Date",
    DateTime = "DateTime",
    Decimal = "Decimal",
    Empty = "",
    File = "File",
    GUID = "Guid",
    Hyperlink = "Hyperlink",
    Image = "Image",
    Memo = "Memo",
    MultiValue = "MultiValue",
    Number = "Number",
    Text = "Text",
    Time = "Time",
    YesNo = "YesNo"
}
export interface PropertiesProperties {
    property?: PurpleProperty[] | PurpleProperty;
    styles?: Styles;
}
export interface PurpleProperty {
    name: string;
    value: string;
}
export interface Styles {
    style: StyleElement[] | PurpleStyle;
}
export interface PurpleStyle {
    isDefault?: IsDefault;
    padding?: Padding;
    text?: Text;
    format?: Format;
    border?: FluffyBorder;
}
export interface StyleElement {
    isDefault?: IsDefault;
    border?: PurpleBorder;
    padding?: Padding;
    width?: string;
    name?: string;
}
export interface PurpleBorder {
    default: PurpleDefault;
}
export interface PurpleDefault {
    style: string;
    width: string;
}
export declare enum IsDefault {
    True = "True"
}
export interface Padding {
    default: string;
}
export interface FluffyBorder {
    default: FluffyDefault;
}
export interface FluffyDefault {
    style: string;
    color: string;
    width: string;
}
export interface Format {
    _: Empty;
    type: Type;
}
export declare enum Empty {
    D = "d",
    N = "N",
    N0 = "N0",
    T = "t"
}
export interface Text {
    align: Align;
}
export declare enum Align {
    Left = "Left",
    Right = "Right"
}
export interface Fields {
    field: Field[];
}
export interface Field {
    id: string;
    dataSourceId: string;
    objectId: string;
    objectType: TType;
    contextId: string;
    contextType: ContextType;
    name: string;
    propertyName: string;
    propertyType: Type;
    fieldType: FieldType;
}
export declare enum ContextType {
    External = "External",
    Primary = "Primary"
}
export declare enum FieldType {
    ObjectProperty = "ObjectProperty"
}
export interface ControllerProperties {
    property: FluffyProperty[] | FluffyProperty;
}
export interface FluffyProperty {
    _: string;
    name: string;
}
export declare enum TypeView {
    Capture = "Capture",
    Empty = "",
    List = "List"
}
export interface Expressions {
    expression: Expression[];
}
export interface Expression {
    id: string;
    instanceId: string;
    item?: Item;
    replace?: Replace;
}
export interface Item {
    sourceType: string;
    sourceName?: string;
    sourceDisplayName?: string;
    sourceId?: string;
    dataType: Type;
    sourceInstanceId?: string;
    sourceValue?: SourceValue;
}
export interface SourceValue {
    _: string;
    xmlSpace: string;
}
export interface Replace {
    item: Item[];
}
