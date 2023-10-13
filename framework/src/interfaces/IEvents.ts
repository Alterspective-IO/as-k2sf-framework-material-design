import { IControl } from "./IControl"
import { IRule } from "./IRule";
import { IView } from "./IView";
import { IViewInstance } from "./IViewInstance";


export enum EventTimingOption {
    before="before",
    after="after"
   }


export type RuleEventDetails = {
    type: EventTimingOption;
    rule:IRule
  };

  






export enum ViewInstanceEventTypeOption {
  list = "list",
  create = "create",
  execute = "execute",
  read = "read",
  update = "update",
  delete = "delete",
  unknown = "unknown"
}

export type ViewInstanceEventDetails = {
  type: ViewInstanceEventTypeOption,
  viewInstance: IViewInstance
}


export type ChangedPropertyEvent =
{
   when:EventTimingOption
   control: IControl
   property: string
   eventName:string
  value:string
}

export type SmartFormEventTypes = "OnClick" | "Change" | "OnSetItemsCompleted"


export type SmartFormEvent =
{
    id:string
    typeName: string
    typeObject: IView| IViewInstance | IControl | IRule
    when:string
    originalArguments: Array<unknown>
    
}