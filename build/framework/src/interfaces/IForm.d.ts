import { IControllerDefinition } from "./AGIControllerDefinition";
import { IExpressions } from "./IExpressions";
import { IViews } from "./IViews";
export interface IForm extends Omit<IControllerDefinition.Controllers, "controller" | "expressions"> {
    views: IViews;
    expressions: IExpressions;
    name: string;
}
