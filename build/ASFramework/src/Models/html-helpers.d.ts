import { IContainer } from "../interfaces/IContainer";
import { Control } from "./control";
export declare function getContainerElement(obj: IContainer): HTMLElement;
export declare function implementControlExtensions(control: Control): void;
export declare class ClassWatcher {
    observer: MutationObserver | null;
    targetNode: Node;
    classToWatch: string;
    classAddedCallback?: Function;
    classRemovedCallback?: Function;
    lastClassState: boolean;
    constructor(targetNode: HTMLElement, classToWatch: string, classAddedCallback?: Function, classRemovedCallback?: Function);
    init(): void;
    observe(): void;
    disconnect(): void;
    mutationCallback: MutationCallback;
}
