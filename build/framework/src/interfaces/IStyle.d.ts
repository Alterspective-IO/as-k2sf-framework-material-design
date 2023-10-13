export declare enum FormatType {
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
    YesNo = "YesNo",
    Currency = "Currency"
}
export declare enum Format {
    D = "d",
    N = "N",
    N0 = "N0",
    T = "t"
}
export declare enum StyleAlign {
    Left = "Left",
    Right = "Right",
    Center = "Center"
}
export interface StyleFormat {
    _?: Format;
    type?: FormatType;
    currencySymbol?: string;
    culture?: string;
}
export interface IStylePadding {
    default: string;
    [key: string]: string;
}
export interface IStyleBorder {
    default: IStyleDefault;
}
export interface IStyleDefault {
    style: string;
    color: string;
    width: string;
}
export interface IStyleText {
    align: StyleAlign;
}
export interface IStyle {
    isDefault?: boolean;
    padding?: IStylePadding;
    text?: IStyleText;
    format?: StyleFormat;
    border?: IStyleBorder;
    width?: string;
    name?: string;
}
