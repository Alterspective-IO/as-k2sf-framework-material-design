import { Rules } from "../Models/rulev2";
import { IControl } from "./IControl";
// import { IRule } from "./IRule";
import { IView } from "./IView";
import { IViewInstance } from "./IViewInstance";


export class ICollections {
  viewInstanceControls = new Array<IControl>();
  viewInstances = new Array<IViewInstance>();
  views = new Array<IView>();
  rules? : Rules
}
