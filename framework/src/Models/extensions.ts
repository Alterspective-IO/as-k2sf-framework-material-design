import { Framework } from "./framework";
import {
  ExtensionConfigurationSmartObject,
  ExtensionSmartObject,
} from "./SmartObject/extentions";
import {
  ExtensionEvent,
  ExtensionEventTypeOption,
  IExtension,
  IExtensionConstructor,
  IExtensions,
  IRegisteredExtension,
  IRegisteredExtensionModule,
} from "../interfaces/IExtensions";
import { IDictionary } from "../interfaces/IDictionary";
import { IControl } from "../interfaces/IControl";
import { EmittedControlEvent } from "./control";
import { ISmartObject } from "../interfaces/SmartObjects/ISmartObject";
import { ExtensionRegistrationOptions } from "./ExtensionRegistrationOptions";
//import { DependantControl } from "../Models/dependantControls";

let dependantViewName = "AS.Framework.Loader"; //The view this code depends on

// class DPC {
//     constructor(public _as: Framework) { }
// }

export type SmartObjectToExtensionMapping = {
  name: string;
  description: string;
  type: string;
  code: string;
  enabled: string;
  url: string;
  initializeCommand: string;
};

export class Extensions implements IExtensions {
  // private dpc: DPC
  constructor(public _as: Framework) {
    // this.dpc = new DPC(_as)

    let dependantView = _as.getViewByName(dependantViewName);
    if (!dependantView) return;

    this.validateExtensionsForView();
  }
  private eventTarget = new EventTarget();
  private extensionsToLoadControl!: IControl;
  private formName!: IControl;
  private viewsOnForm!: IControl;
  public registeredExtensions = {} as IDictionary<IRegisteredExtension>;
  public registeredExtensionModules = {} as IDictionary<any>;

  public loadExtensionsFromControlSmartObjects(
    controlConfigurationName: string,
    customSmartObjectToExtensionMapping: SmartObjectToExtensionMapping
  ) {
    this._as
      .getControlsByConfigurationName(controlConfigurationName)
      .forEach((c) => {
        this.loadExtensionsFromControl(c, customSmartObjectToExtensionMapping);
        c.events.smartformEventPopulated.addEvent((e: EmittedControlEvent) => {
          this.loadExtensionsFromControl(
            e.control,
            customSmartObjectToExtensionMapping
          );
        });
      });
  }

  private loadExtensionsFromControl(
    c: IControl,
    customSmartObjectToExtensionMapping: SmartObjectToExtensionMapping
  ) {
    if (!c.smartobject.exists) return;
    if (!customSmartObjectToExtensionMapping) {
      //Add defaults
      customSmartObjectToExtensionMapping = {
        name: "Key",
        description: "",
        type: "Type",
        code: "Contents",
        enabled: "Enabled",
        url: "Link",
        initializeCommand: "InitializeCommand",
      };
    }

    let so = c.smartobject;
    if (so.exists == true) {
      so.items?.forEach((soi) => {
        let extensionToRegister: IExtension = {
          name: soi[customSmartObjectToExtensionMapping.name || "Key"] || "",
          description:
            soi[
              customSmartObjectToExtensionMapping.description || "Description"
            ] || "",
          type: soi[customSmartObjectToExtensionMapping.type || "Type"] || "",
          code:
            soi[customSmartObjectToExtensionMapping.code || "Contents"] || "",
          enabled:
            soi[customSmartObjectToExtensionMapping.enabled || "Enabled"] ||
            "false",
          moduleUrl:
            soi[customSmartObjectToExtensionMapping.url || "Link"] || "",
          initializeCommand:
            soi[
              customSmartObjectToExtensionMapping.initializeCommand ||
                "InitializeCommand"
            ] || "", //Spelling wrong on smartobject, do not correct here until SO is updated
        };

        if(extensionToRegister.enabled!="false") this.registerExtension(extensionToRegister);
      });
    }

    // }
  }

  public addListener(
    extensionEventType: ExtensionEventTypeOption,
    callback: (evt: CustomEvent<ExtensionEvent>) => void
  ): void {
    return this.eventTarget.addEventListener(
      extensionEventType,
      callback as (evt: Event) => void
    );
  }

  public dispatch(
    extensionEventType: ExtensionEventTypeOption,
    event: ExtensionEvent
  ): boolean {
    return this.eventTarget.dispatchEvent(
      new CustomEvent(extensionEventType, { detail: event })
    );
  }

  public removeListener(
    extensionEventType: ExtensionEventTypeOption,
    callback: (evt: CustomEvent<ExtensionEvent>) => void
  ): void {
    return this.eventTarget.removeEventListener(
      extensionEventType,
      callback as (evt: Event) => void
    );
  }

  //if we have a framework view that has a list of extensions to load then load them
  private validateExtensionsForView() {
    this.extensionsToLoadControl = this._as.validateDependantControl(
      "Internal - Extensions To Load",
      dependantViewName
    );
    //this.formName = this._as.validateDependantControl("internal - Form Name", dependantViewName);
    //this.viewsOnForm = this._as.validateDependantControl("internal - Views on Form", dependantViewName);
    if (this.extensionsToLoadControl) {
      this.extensionsToLoadControl.events.smartformEventPopulated.addEvent(
        (e: EmittedControlEvent) => {
          console.log("Internal - Extensions To Load - Populated");

          this.registerSmartObjectExtensions(e.control.smartobject);
        }
      );
    }
  }

  public async registerSmartObjectExtensions(so: ISmartObject) {
    if (so.exists == true) {
      so.items?.forEach((soi) => {
        let extensionConfiguration = new ExtensionConfigurationSmartObject();
        extensionConfiguration.createFromData(soi);
        this.implementExtensionSOI(extensionConfiguration);
      });
    }
  }

  private implementExtensionSOI(
    extensionConfiguration: ExtensionConfigurationSmartObject
  ) {
    let extension: ExtensionSmartObject = extensionConfiguration.Joins[0];
    if (
      extensionConfiguration.Enabled == "true" &&
      extension.Enabled == "true"
    ) {
      //only run if the extension is enabled and if its enabled on the view(s) its targeting
      console.log(
        `%c Extension [${extensionConfiguration.Extension}] is enabled on view and at extension level`,
        "background: #222; color: #bada55"
      );

      let extensionToRegister: IExtension = {
        name: extension.Name,
        description: extension.Description,
        type: extension.Type,
        code: extension.Code,
        enabled: extension.Enabled,
        moduleUrl: extension.Module_Url,
        initializeCommand: extension.initialiseCommand, //Spelling wrong on smartobject, do not correct here until SO is updated
      };
      this.registerExtension(extensionToRegister);
    } else {
      console.warn(
        `Extension [${extensionConfiguration.Extension}] is not fully enabled - View enabled:[${extensionConfiguration.Enabled}]  Extension enabled:[${extensionConfiguration.Joins[0].Enabled}]`
      );
    }
  }

  // static getInstance<T>(context:any,name:string,...args:any[]): T{
  //     let instance = Object.create(context[name].prototype)
  //     instance.constructor.apply(instance.args)
  //     return <T> instance
  // }

  public static async registerExtensionModule(
    moduleName: string,
    module: IExtensionConstructor,
    options?: ExtensionRegistrationOptions
  ): Promise<IRegisteredExtensionModule | undefined> {
    return window.alterspective.Framework.initialize({
      notificationsServerURL: options?.notificationServerURL,
    }).then((as) => {
      return as.extensions?.registerModule(moduleName, module);
    });
  }

  public async registerModule(
    moduleName: string,
    module: IExtensionConstructor,
    ...args: any
  ): Promise<IRegisteredExtensionModule | undefined> {
    //first check if this module is already registered
    if (this.registeredExtensionModules[moduleName]) {
      console.warn(
        `Warning! The module [${moduleName}] has already been registered..`
      );
      return;
    }

    let moduleObject: IRegisteredExtensionModule | undefined;
    try {
      moduleObject = new module(this._as, ...args);
    } catch (error) {
      //TODO: handle?
      console.warn(error);
    }
    if (moduleObject) {
      moduleObject.as = this._as;
    }
    this.registeredExtensionModules[moduleName] = moduleObject;
    this.dispatch(ExtensionEventTypeOption.registered, {
      name: moduleName,
      module: moduleObject,
      type: "module",
    });
    return moduleObject;
  }

  public async registerExtension(extension: IExtension) {
    if (!this._as.extensions!.registeredExtensions[extension.name]) {
      this._as.extensions!.registeredExtensions[extension.name] =
        extension as any as IRegisteredExtension;
      this._as.extensions!.registeredExtensions[extension.name].usageCount = 1;


      //load any modules first
      if(extension.moduleUrl.length>0)
      {
        await this.addModuleViaLink(extension).then((module) => {
            this.validateExtensionInitialize(extension);
            this.dispatch(ExtensionEventTypeOption.registered, {
              name: extension.name,
              module: module,
              type: "module",
            });
          });
      }

      //load the extension either as code or as a link
      if (extension.code.length > 0) {
        //if code present then code takes priority over javascript link
        this.addCodeExtension(extension).then(() => {
          this.validateExtensionInitialize(extension);
          this.dispatch(ExtensionEventTypeOption.registered, {
            name: extension.name,
            module: undefined,
            type: "code",
          });
        });
      } 
      //Validate and execute the extension initialize method
    }
    this._as.extensions!.registeredExtensions[extension.name].usageCount += 1;
  }

  private async addModuleViaLink(extension: IExtension): Promise<any> {
    let module;
    try {
      module = await import(/* webpackIgnore: true */ extension.moduleUrl);
    } catch (err) {
      console.warn(
        `Error importing extension [${extension.name}] with url [${
          extension.moduleUrl
        }] - Error Message: [${err || "No Error Details"}]`
      );
      return;
    }
    return module;
  }

  //Extension is script link add to the page
  private validateExtensionInitialize(extension: IExtension) {
    if (extension.initializeCommand.length > 0) {
      try {
        this._as.extensions!.registeredExtensions[
          extension.name
        ].initializeCommandResult = this.executeExtensionInitializeScript(
          extension.initializeCommand
        );
      } catch (err) {
        console.warn(
          `Error calling extension [${extension.name}] initialize command [${
            extension.initializeCommand
          }] - Error Message: [${err || "No Error Details"}]`
        );
      }
    }
  }

  private executeExtensionInitializeScript(obj: string) {
    return Function('"use strict";return (' + obj + ")")();
  }

  //Extension is JavaScript add to the page
  private async addCodeExtension(extension: IExtension) {
    let code = extension.code.replace(
      new RegExp("{Framework Script Location}", "g"),
      this._as.settings.scriptFilesUrl
    );

    let tag = ""

    switch (extension.type.toLocaleLowerCase()) {
        case "javascript":
            tag="script"
            break;
            case "css":
                tag="style"
                break;        
        default:
            break;
    }
    
  
    $("body").append(`<div id='${extension.name}_extension'><${tag}>${code}</${tag}></div>`);
  }
}
