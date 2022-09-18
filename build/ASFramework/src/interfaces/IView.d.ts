import { IViewBasic } from "./IViewBasic";
import { IContainer } from "./IContainer";
import { IViewInstances } from "./IViewInstances";
export interface IView extends Omit<IViewBasic, "instanceId" | "panelId" | "mainTable" | "dataSourceId" | "contextId">, IContainer {
    viewInstances: IViewInstances;
}
