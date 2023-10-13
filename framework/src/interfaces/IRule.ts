import { IViewInstance } from "./IViewInstance";
import { IView } from "./IView";
import { IRuleDefinition } from "./AGIControllerDefinition";
import { EventTimingOption, RuleEventDetails } from "./IEvents";



export interface IRule extends IRuleDefinition.Event {
  get parentView(): IView | undefined;
  get parentViewInstance(): IViewInstance | undefined;
  execute(): any;
  eventTarget : EventTarget

  addListener(
    type: EventTimingOption,
    callback: (evt: CustomEvent<RuleEventDetails>) => void
  ): void;
  dispatch(eventType: EventTimingOption): boolean;
  removeListener(
    type: EventTimingOption,
    callback: (evt: CustomEvent<RuleEventDetails>) => void
  ): void;
}
