export interface RuntimeParameters {
    formParameters: Parameters;
    viewControllers: ViewControllers;
}
export interface Parameters {
    [key: string]: Parameter;
}
export interface Parameter {
    ID: string;
    Name: string;
    Type: Type;
    Value: string;
}
export declare enum Type {
    Text = "text",
    Number = "number",
    DateTime = "datetime",
    Boolean = "boolean"
}
export interface ViewControllers {
    [key: string]: Parameters;
}
