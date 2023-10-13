import { Rule } from "../Models/rulev2";
export declare enum ControlRuleKeys {
    Init = "Init",
    ServerPreRender = "ServerPreRender",
    OnClick = "OnClick",
    Submit = "Submit",
    Closed = "Closed",
    OnChange = "OnChange",
    PostInit = "PostInit",
    Changed = "Changed",
    Collapse = "Collapse",
    Expand = "Expand",
    OnError = "OnError",
    OnSet = "OnSet",
    OnSetItemsCompleted = "OnSetItemsCompleted",
    Annotated = "Annotated",
    NotSupported = "Not Supported",
    Double = "Double-Clicked",
    Resolving = "Resolving",
    CollapsedNode = "Collapsed (node)",
    ExpandedNode = "Expanded (node)",
    NodesPopulated = "Nodes-Populated",
    Populating = "Populating",
    LocationChanged = "Location Changed",
    ListItemAdded = "ListItemAdded",
    ListItemChanged = "ListItemChanged",
    ListItemRemoved = "ListItemRemoved",
    ListDoubleClick = "ListDoubleClick"
}
export type IControlRules = {
    [key in ControlRuleKeys]?: Rule | undefined;
};
