import { Framework } from "./framework";
import { ExtensionEvent, ExtensionEventTypeOption, IExtension, IExtensionConstructor, IExtensions, IRegisteredExtension, IRegisteredExtensionModule } from "../interfaces/IExtensions";
import { IDictionary } from "../interfaces/IDictionary";
import { ISmartObject } from "../interfaces/SmartObjects/ISmartObject";
import { ExtensionRegistrationOptions } from "./ExtensionRegistrationOptions";
export declare type SmartObjectToExtensionMapping = {
    name: string;
    description: string;
    type: string;
    code: string;
    enabled: string;
    url: string;
    initializeCommand: string;
};
export declare class Extensions implements IExtensions {
    _as: Framework;
    constructor(_as: Framework);
    private eventTarget;
    private extensionsToLoadControl;
    private formName;
    private viewsOnForm;
    registeredExtensions: IDictionary<IRegisteredExtension>;
    registeredExtensionModules: IDictionary<any>;
    loadExtensionsFromControlSmartObjects(controlConfigurationName: string, customSmartObjectToExtensionMapping: SmartObjectToExtensionMapping): void;
    private loadExtensionsFromControl;
    addListener(extensionEventType: ExtensionEventTypeOption, callback: (evt: CustomEvent<ExtensionEvent>) => void): void;
    dispatch(extensionEventType: ExtensionEventTypeOption, event: ExtensionEvent): boolean;
    removeListener(extensionEventType: ExtensionEventTypeOption, callback: (evt: CustomEvent<ExtensionEvent>) => void): void;
    private validateExtensionsForView;
    registerSmartObjectExtensions(so: ISmartObject): Promise<void>;
    private implementExtensionSOI;
    static registerExtensionModule(moduleName: string, module: IExtensionConstructor, options?: ExtensionRegistrationOptions): Promise<IRegisteredExtensionModule | undefined>;
    registerModule(moduleName: string, module: IExtensionConstructor, ...args: any): Promise<IRegisteredExtensionModule | undefined>;
    registerExtension(extension: IExtension): Promise<void>;
    private addModuleViaLink;
    private validateExtensionInitialize;
    private executeExtensionInitializeScript;
    private addCodeExtension;
}
