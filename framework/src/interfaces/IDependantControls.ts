import { IControl } from "./IControl";


export interface IDependantControls { [key: string]: IDependantControl; }
export interface IDependantControl {
  name: string;
  viewOrViewInstanceName: string;
  control?: IControl;
}
