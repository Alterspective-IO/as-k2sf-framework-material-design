import * as iframeResizer from "iframe-resizer";
import { IForm, Rule } from "..";
import { ICollections } from "./ICollections";
import { IControl } from "./IControl";
import { ICustomControls } from "./Icustom-controls";
import { IDependantControls } from "./IDependantControls";
import { IDeveloperMode } from "./IdeveloperMode";
import { IExtensions } from "./IExtensions";
import { INotifications } from "./INotifications";
import { IPerformanceSession } from "./IPerformanceSession";
// import { IRule } from "./IRule";
import { ISearch } from "./ISearch";
import { ISettings } from "./ISettings";
import { ISupportingObjects } from "./ISupportingObjects";
import { IUser } from "./IUser";
import { IView } from "./IView";
import { IViewInstance } from "./IViewInstance";

export interface IFramework {
  supportingObjects: ISupportingObjects;
  form?: IForm;
  collections: ICollections;
  window: Window;
  initializePromise?: Promise<IFramework>;
  attachedEventsEnabled: boolean;
  extensions?: IExtensions;
  customControls?: ICustomControls;
  search: ISearch;
  notifications: INotifications;
  toastr: any;
  settings: ISettings;
  user: IUser;
  iFrameResizer: typeof iframeResizer.iframeResizer;
  developerMode: IDeveloperMode;
  frameworkInitializeTime?: IPerformanceSession;
  //codeEditor : typeof MonacoEditor.editor.create
  //codeEditorCss : any
  cachedScript(url: string, options: any): Promise<any>;
  initialize(): Promise<IFramework>;
  initializePostFrameworkLoadModules(): void;
  convertXMLtoJSON(
    xml: string | Document | Element | Node | null | undefined
  ): any;
  getControlsById(id: string, viewInstanceName?: string): IControl[];
  getControlFromElement(element: HTMLElement): IControl | undefined;
  getViewInstanceByName(name: string): IViewInstance;
  getViewInstancesByNameContains(name: string): IViewInstance[];

  getViewByName(name: string): IView;
  getViewsByNameContains(name: string): IView[];

  //Rule Search Helpers
  getRulesByFriendlyName(name: string, viewInstanceName?: string): Rule[];
  //Control Search Helpers
  getControlsByName(name: string, viewInstanceName?: string): IControl[];
  getControlsByNameContains(
    name: string,
    viewInstanceName?: string
  ): IControl[];
  getControlsByType(type: string, viewInstanceName?: string): IControl[];
  getControlsByTypeContains(
    type: string,
    viewInstanceName?: string
  ): IControl[];
  validateDependantControls(dependantControls: IDependantControls): void;
  validateDependantControl(
    name: string,
    viewOrViewInstanceName: string
  ): IControl;

  getControlsByConfigurationName(
    configurationName: string,
    referenceViewInstance?: IViewInstance
  ): IControl[];
  getRulesByConfigurationName(
    configurationName: string,
    referenceViewInstance?: IViewInstance
  ): Rule[];
  getNameAndViewInstanceFromConfigurationString(
    configurationName: string,
    referenceViewInstance?: IViewInstance
  ): { name: string; viewInstance: string };
  updateK2ControlsWithViewSmartObjectFields(
    viewInstance: IViewInstance,
    dataObject: any
  ): void;


}


export * from "./IStyle"
