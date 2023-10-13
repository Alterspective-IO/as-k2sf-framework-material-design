// import { Framework } from "./framework";
// import { PerformanceSession } from "./framework.performance";
// import { IRuleDefinition } from "../interfaces/AGIControllerDefinition";
// import { IRule } from "../interfaces/IRule";
// import { IRules } from "../interfaces/IRules";
// import { IView } from "../interfaces/IView";
// import { IViewInstance } from "../interfaces/IViewInstance";
// import { ChangeEventOption, EventTimingOption, RuleEventDetails } from "../interfaces/IEvents";



// export class Rules extends Array<Rule> implements IRules {

//     constructor(eventDefinition: IRuleDefinition.EventDefinition, as: Framework) {
//         super()
//         if (eventDefinition) {
//             let p = new PerformanceSession("Rules constructor()")
//             eventDefinition.events.event.forEach(e => {
//                 this.push(new Rule(e, as))
//             })
//             p.finish()
//         }

//     }
// }



// export class Rule implements IRule {

//     _as: Framework
//     constructor(rule: IRuleDefinition.Event, as: Framework) {
//         this._as = as
//         this.id = ''
//         this.definitionId = ''
//         this.type = IRuleDefinition.EventType.System
//         this.isReference = IRuleDefinition.IsInherited.False;
//         this.isInherited = IRuleDefinition.IsInherited.False;
//         this.sourceId = '';
//         this.sourceType = IRuleDefinition.SourceType.Control;
//         this.isEnabled = '';
//         this.name = '';


//         Object.assign(this, rule)
//         this.eventTarget.dispatchEvent(new CustomEvent("initialized",{detail:this}))
//     }

    
//     id: string;
//     definitionId: string;
//     type: IRuleDefinition.EventType;
//     isReference: IRuleDefinition.IsInherited;
//     isInherited: IRuleDefinition.IsInherited;
//     sourceId: string;
//     sourceType: IRuleDefinition.SourceType;
//     isEnabled: string;
//     name: string;
//     handlers?: IRuleDefinition.Handlers | undefined;
//     ruleFriendlyName?: string | undefined;
//     isCustomName?: string | undefined;
//     ruleName?: string | undefined;
//     instanceId?: string | undefined;
//     viewId?: string | undefined;
//     eventTarget = new EventTarget()

//     get parentView(): IView | undefined {
//         if (this.viewId)
//             return this._as.collections.views.find(v => v.id == this.viewId);
//         else
//             if (this.instanceId) {
//                 let parentViewInstance = this._as.collections.viewInstances.find(v => v.id == this.instanceId);
//                 if (parentViewInstance) {
//                     if (!this.viewId) this.viewId = parentViewInstance.id

//                     return (parentViewInstance.parent as IView)
//                 }
//             }
//     }

//     get parentViewInstance(): IViewInstance | undefined {
//         if (this.instanceId) {
//             let parentViewInstance = this._as.collections.viewInstances.find(v => v.id == this.instanceId);
//             if (parentViewInstance) {
//                 if (!this.viewId) this.viewId = parentViewInstance.id
//             }
//             return this._as.collections.viewInstances.find(v => v.id == this.instanceId);
//         }
//     }

//     execute(): any {
//         return window.handleEvent(
//             this.sourceId,
//             this.sourceType,
//             this.name,
//             null,
//             this.instanceId)
//     }

//     public addListener(type:EventTimingOption, callback: (evt: CustomEvent<RuleEventDetails>) => void): void {
//         return this.eventTarget.addEventListener(type.toString(), callback as (evt: Event) => void);
//       }
    
//       public dispatch(executedRuleEventTypes: EventTimingOption): boolean
//       {
//         let details : RuleEventDetails ={
//             type: executedRuleEventTypes,
//             rule: this
//         }
//         return this.eventTarget.dispatchEvent(new CustomEvent(executedRuleEventTypes, { detail: details }));
//       }
    
//      public removeListener(type:EventTimingOption,callback: (evt: CustomEvent<RuleEventDetails>) => void): void {
//         return this.eventTarget.removeEventListener(type.toString(), callback as (evt: Event) => void);
//       }


// }