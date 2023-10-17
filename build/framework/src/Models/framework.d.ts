/// <reference types="toastr" />
import * as iframeResizer from "iframe-resizer";
import { IControllerDefinition } from "../interfaces/AGIControllerDefinition";
import { ICollections } from "../interfaces/ICollections";
import { IControl } from "../interfaces/IControl";
import { ICustomControls } from "../interfaces/Icustom-controls";
import { IDependantControls } from "../interfaces/IDependantControls";
import { INotifications } from "../interfaces/INotifications";
import { IUser } from "../interfaces/IUser";
import { IView } from "../interfaces/IView";
import { IViewInstance } from "../interfaces/IViewInstance";
import { Search } from "./search";
import { Extensions } from "./extensions";
import { Rule } from "./rulev2";
import { Settings } from "./Settings";
import { DeveloperMode } from "./DeveloperMode/developerMode";
import { IPerformanceSession } from "../interfaces/IPerformanceSession";
import { IExtensionConstructor, IForm, IFramework, IRegisteredExtensionModule } from "..";
import { ExtensionRegistrationOptions } from "./ExtensionRegistrationOptions";
export interface FrameworkInitializationOptions {
    scriptFilesUrl?: string;
    notificationsServerURL?: string;
    targetWindow?: Window;
}
export declare class Framework implements IFramework {
    supportingObjects: SupportingObjects;
    form?: IForm;
    collections: ICollections;
    search: Search;
    window: Window;
    initializePromise?: Promise<IFramework>;
    attachedEventsEnabled: boolean;
    extensions?: Extensions;
    customControls?: ICustomControls;
    toastr: Toastr;
    settings: Settings;
    notifications: INotifications;
    user: IUser;
    iFrameResizer: typeof iframeResizer.iframeResizer;
    toasrCss: any;
    developerMode: DeveloperMode;
    frameworkInitializeTime?: IPerformanceSession;
    static asInitializePromise: Promise<IFramework>;
    static registerExtensionModule(moduleName: string, module: IExtensionConstructor, options?: ExtensionRegistrationOptions): Promise<IRegisteredExtensionModule | undefined>;
    static initialize(options?: FrameworkInitializationOptions): Promise<IFramework>;
    constructor(windowInstance: Window, scriptFilesUrl: string, notificationsServerURL: string);
    initialize(): Promise<IFramework>;
    /**
     * This method is used to run rules that are required to run after the framework has been initialized
     * Rules in here are started after the framework has been initialized and are run in the background asynchronously
     * These rules can be run in any order as they are not dependant on eachother.
     */
    runPostInitializeRules(): void;
    inIframe(): boolean;
    private managePopupOpenedRunCounter;
    private managePopupOpened;
    attachListener(): void;
    attachPopupResizer(): void;
    cachedScript(url: string, options: any): Promise<any>;
    expressionToString(expression: string): string;
    escapeRegExp(str: string): string;
    applyEvalCommands(): void;
    initializePostFrameworkLoadModules(): void;
    private processK2SmartFormsXML;
    convertXMLtoJSON(xml: string | Document | Element | Node | null | undefined): any;
    processXML(xml: string, name: string): Promise<void>;
    getViewInstanceByName(name: string): IViewInstance | undefined;
    getViewInstancesByNameContains(name: string): IViewInstance[];
    getViewByName(name: string): IView;
    getViewsByNameContains(name: string): IView[];
    getRulesByFriendlyName(name: string, viewInstanceName?: string): Rule[];
    getControlsById(id: string, viewInstanceName?: string): IControl[];
    getControlsByName(name: string, viewInstanceName?: string): any[];
    getControlsByNameContains(name: string, viewInstanceName?: string): any[];
    getControlsByType(type: string, viewInstanceName?: string): any[];
    getControlsByTypeContains(type: string, viewInstanceName?: string): any[];
    /**
     *
     * @param configurationName - "controlName,viewName" | "controlName,viewInstanceName" | "controlName,current" -> for the current viewInstance with reference to a control
     * @param referenceViewInstance - when viewInstance == current the viewInstance to use
     * @returns IControl[]
     */
    getControlsByConfigurationName(configurationName: string, referenceViewInstance?: IViewInstance): IControl[];
    /**
     *
     * @param configurationName - "ruleName,viewName" | "ruleName,viewInstanceName" | "ruleName,current" -> for the current viewInstance with reference to a control
     * @param referenceViewInstance - when viewInstance == current the viewInstance to use
     * @returns IRule[]
     */
    getRulesByConfigurationName(configurationName: string, referenceViewInstance: IViewInstance): Rule[];
    /**
     * This method is used to extract the name and viewInstance from a configuration string
     * @param configurationName - "name,viewName" | "name,viewInstanceName" | "name,current" -> for the current viewInstance with reference to a control
     * @param referenceViewInstance - when viewInstance == current the viewInstance to use
     * @returns {name, viewInstance}
     */
    getNameAndViewInstanceFromConfigurationString(configurationName: string, referenceViewInstance?: IViewInstance): {
        name: string;
        viewInstance: string;
    };
    getControlFromElement(element: HTMLElement): IControl | undefined;
    /**
     * Update View Instance Controls that are bound to an Objects Properties
     * @param viewInstance
     * @param dataObject
     */
    updateK2ControlsWithViewSmartObjectFields(viewInstance: IViewInstance, dataObject: any): void;
    validateDependantControls(dependantControls: IDependantControls): void;
    validateDependantControl(name: string, viewOrViewInstanceName: string): IControl;
    private applyMaterialIcons;
    checkForContentControlResizeRequest(): void;
}
export declare function genericSearchPropEqual(array: Array<any>, prop: string, value: string, viewInstanceName?: string): any[];
export declare function genericSearchPropContains(array: Array<any>, prop: string, value: string, viewInstanceName?: string): any[];
declare class SupportingObjects {
    __runtimeControllersDefinition_Object?: IControllerDefinition.ControllerDefinition;
    __runtimeEventsDefinition_Object?: any;
    __runtimeEventsDefinition_Document?: Document;
    __runtimeSessionDetails_Document?: Document;
    __runtimeSessionDetails_Object?: any;
    __runtimeParametersDefinition_Document?: Document;
    constructor();
}
export {};
