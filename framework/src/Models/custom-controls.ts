///
/// This module is responsible for loading and rendering custom controls against targeted K2 controls.
///

import { PerformanceSession } from "./framework.performance";
import { IControl } from "../interfaces/IControl";
import { IFramework } from "../interfaces/IFramework";
import { ICustomControlSmartObject } from "../interfaces/SmartObjects/ICustomControl";
import { CustomControlTargetSmartObject } from "../Models/SmartObject/customControlTargets";
import { ICustomControlTargetImplemented } from "../interfaces/ICustomControlTargetImplemented";
import { ICustomControls } from "../interfaces/Icustom-controls";


export class CustomControls implements ICustomControls  {

  dependantViewName = "AS.Framework.Loader"
  processCustomControlsPromise!: Promise<void>
  customControlTargets!: IControl
  customControlTargetsArray = new Array<ICustomControlTargetImplemented>()

  constructor(public as: IFramework) {
    //Validate controls required for this method
    //Bind to data source change
    //Process

    if (!this.as.getViewByName(this.dependantViewName)) return;

    this.customControlTargets = this.as.validateDependantControl("CustomControlTargets", this.dependantViewName)
    this.processCustomControlsPromise = this.processCustomContols();

  }

  async processCustomContols(): Promise<void> {

    if (this.customControlTargets.smartobject.exists) {
      this.customControlTargets.smartobject.items?.forEach((soi: any) => {
        try{
        this.convertAndProcessCustomControlTarget(soi);
        }
        catch(ex)
        {
          console.error(ex);
        }
      })

    }


    this.customControlTargets.events.smartformEventPopulated.addEvent((e: any) => {
      this.customControlTargets.smartobject.items?.forEach((soi: any) => {
        this.convertAndProcessCustomControlTarget(soi);
      })
    })

  }



  private convertAndProcessCustomControlTarget(soi: any) {
    try {
      let customControlTargets = new CustomControlTargetSmartObject()
      customControlTargets.createFromData(soi)

      let customControlTargetsImplemented : ICustomControlTargetImplemented =  (customControlTargets as any) as ICustomControlTargetImplemented

      this.customControlTargetsArray.push(customControlTargetsImplemented)
      this.processCustomControl(customControlTargets);
    }
    catch (err) {
      console.warn(`${err}`)
    }
  }




  async processCustomControl(customControlTarget: CustomControlTargetSmartObject): Promise<void> {



    let customContol: ICustomControlSmartObject = customControlTarget.CustomControlObject

    let importModule = customContol.Javascript_URL
    let p = new PerformanceSession("Load WebComponent - " + importModule)

    let targetedControl: IControl = this.as.validateDependantControl(customControlTarget.Control_Name, customControlTarget.View_Name)
    let targetedControlElement = targetedControl.getHTMLElement()

    let newElement = document.createElement(customContol.System_Name);
    newElement.id = targetedControl.id + "_" + customContol.System_Name;
    
    let implementedCustomControlTarget =  (customControlTarget as any) as ICustomControlTargetImplemented
    implementedCustomControlTarget.implementedElement = newElement
    
    let targetControlParent = $(targetedControlElement).parent().append(newElement)
    //$(targetedControlElement).hide();


    targetedControl.attachedCustomControl = { elementId: newElement.id, element: $(`#${newElement.id}`)[0], customControlTarget: customControlTarget }



    //     let options = {
    //   dataType: "script",
    //   cache: true,
    //   url: importModule,
    // };

    try {
      //jQuery.ajax(options).then((module) => {
      import(/* webpackIgnore: true */ importModule).then((module) => {
        console.log(`Downloaded custom control [${customContol.Name}] `)

        let loadedElement = $(`#${newElement.id}`)[0]

        if(!loadedElement) return

        if (customContol.Default_Set_Value_Property.length > 0) {
          this.setCustomControlProperty(loadedElement, customContol.Default_Set_Value_Property, targetedControl.value); //set the initial value from the K2 control
          targetedControl.events.smartformEventChanged.addEvent((e: any) => { //Add handler so whne K2 control value changes it changes the custom contorl
            this.setCustomControlProperty(loadedElement, customContol.Default_Set_Value_Property, e.control.value);
          })
        }

        if (customContol.Default_Value_Changed_Event.length > 0) {
          loadedElement.addEventListener(customContol.Default_Value_Changed_Event, (event) => { //detect when custom control changes so we then update the K2 control
            let newValue = (loadedElement as any)[customContol.Default_Get_Value_Property]
            console.log(`Custom Control [${customContol.Name}] has fired its default event [${customContol.Default_Value_Changed_Event}] = ${newValue}`)
            targetedControl.value = newValue
            //targetedControl.rules.OnChange.execute()
          });
        }

 

          customControlTarget.CustomControlObject.SettingsAsObject.forEach(controlSetting => {

            //find if ther eis a targetSetting for this control settings
            let valueToSet = controlSetting.DefaultValue

            let targetSetting = customControlTarget.SettingsObject.find(ccts => ccts.Name == controlSetting.Name)
            if (targetSetting) //If there is a specific setting for this target
            {
              if (targetSetting.IsAnotherControl == true) {
                try {
                  valueToSet = this.as.validateDependantControl(targetSetting.Value, customControlTarget.View_Name).value || ""
                }
                catch (err) {
                  console.warn(`Error setting custom control [${customContol.Name}] setting [${controlSetting.Name}] to another control [${targetSetting.Value}] value - Error ${err} `)
                }
              }
              else {
                valueToSet = targetSetting.Value
              }
            }

            if(controlSetting.Type=="json"){
              try{

                this.setCustomControlProperty(loadedElement, controlSetting.Name, JSON.parse(valueToSet))
              }
              catch (err)
              {

              }
              
            }
            else
            {
              this.setCustomControlProperty(loadedElement, controlSetting.Name, valueToSet)
            }

           
          });
        


        p.finish();
      }).catch(err=>
        {
          console.log(err)
        })
    }
    catch (err) {
      console.warn(`Error loading custom control [${customContol.Name}] from [${customContol.Javascript_URL}]`)
    }

  }

  private setCustomControlProperty(newElement: HTMLElement, property: string, value: any): void {


    let propertObject = (newElement as any)[property]
    if (propertObject === undefined) {
      console.warn(`Custom Control [${newElement.tagName}] does not contain property [${property}] setting inital value`);
      return;
    }

    (newElement as any)[property] = value;

  }
}



