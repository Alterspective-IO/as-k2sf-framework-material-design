import { IViewBasic } from "./IViewBasic";
import { IContainer } from "./IContainer";
import { IControlOfView } from "./IControlOfView";
import { IFields } from "./IFields";
import { IControls } from "./IControls";
import { ISmartObject } from "./SmartObjects/ISmartObject";
import { EventTimingOption, ViewInstanceEventDetails, ViewInstanceEventTypeOption } from "./IEvents";
import { ListViewInstance } from "../Models/viewInstances";
import { IAttachedCustomControl } from "./IAttachedCustomControl";


export interface IViewInstance extends IViewBasic, IContainer {
  viewId: string;
  isFormViewInstance: boolean;
  controls?: IControls;
  associations: { [key: string]: string; }[];
  fields: IFields;
  controlOfView: IControlOfView;
  smartobject: ISmartObject;
  attachedCustomControl?: IAttachedCustomControl;
  
  as<T extends ListViewInstance>(c:{ new(): T}) : T
  addListener(
    type: ViewInstanceEventTypeOption,
    callback: (evt: CustomEvent<ViewInstanceEventDetails>) => void
  ): void 

   dispatch(
    type: ViewInstanceEventTypeOption,
  ): boolean

  removeListener(
    type: ViewInstanceEventTypeOption,
    callback: (evt: CustomEvent<any>) => void
  ): void 
}
