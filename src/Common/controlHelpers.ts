import { IControl,EmittedControlEvent } from "@alterspective-io/as-k2sf-framework"

export function getControlsInControl(parentControl: IControl): IControl[] {
    let retValue = new Array<IControl>();

    let IDs = new Array<string>();
    //Get all the IDs in the contained control
    let parentElement = parentControl.getHTMLElement() as HTMLElement;

    [...parentElement.children].forEach((childEle) => {
      // let ctr = this.as.getControlsById(childEle.id,parentControl.parent?.name)[0]
      let foundElementWithId = findElementId(childEle);
      if (foundElementWithId) {
        let ctr = parentControl._as.getControlFromElement(
          foundElementWithId as HTMLElement
        );
        if (ctr) {
          retValue.push(ctr);
        }
      }
    });
    return retValue;
  }

  //Sometimes a cell wraps a control in outer div tag so we need to recursively search for controls in a console
  export function findElementId(element: Element): Element | null {
    if (element.id)
      if (element.id.length > 0) {
        return element;
      }

    for (let index = 0; index < element.children.length; index++) {
      const childEle = element.children[index];
      let searchedElement = findElementId(childEle);
      if (searchedElement) {
        console.log("found :" + searchedElement.id);
        return searchedElement;
      }
    }

    return null;
  }

  // export function bindControlUpdates(control: IControl, obj: object) {
  //   control.events.smartformEventChanged.addEvent((e: any) => {
  //     console.log(e);
  //     console.log(obj);
  //   });
  // }

  export function  dataBind(obj: any, prop: string, control: IControl) {
    if (control) {
      obj[prop] = control.value || "";

      control.rules.OnChange?.addListener(control.id + "_mdcard",e=>
      {
        obj[prop] = (e.detail.parent as IControl).value || "";
      });


      // control.events.smartformEventChanged.addEvent((e: any) => {
      //   obj[prop] = e.control.value || "";
      // });
    }
  }



  export function applySettings(newCard: object, settingsControl: IControl) {
    try {
      if(settingsControl.value)
      {
        Object.assign(newCard, JSON.parse(settingsControl.value));
      }
      
  
      
      settingsControl.events.smartformEventChanged.addEvent((e:EmittedControlEvent)=>
      {
        Object.assign(newCard, JSON.parse(e.control.value!));
      }
      )
    } catch (err) {
      console.warn("Error reading card settings: " + err);
    }
  }


  export function getJsonFromControlValue(control?:IControl) : any | undefined
  {
    let retValue

    if(!control) return undefined
    if(!control.value) return undefined
    
    return getJsonFromString(control.value, control)
    
  }

  export function getJsonFromString(str?:string, controlInfoReference? : IControl) : any | undefined
  {
    if(!str) return undefined
    let retValue: any 

    try{
      retValue= JSON.parse(str)     
     }
     catch(ex)
     {
      if(controlInfoReference)
      {
         console.warn(`Error extracting JSON (settings) from control [${controlInfoReference.name}] on [${controlInfoReference.parent?.name}]`,ex)
         console.warn(`control [${controlInfoReference.name}] on [${controlInfoReference.parent?.name}] found value was`,controlInfoReference.value)
      }
      else
      {
        console.warn(`Error extracting JSON (settings) from value [${str}]`,ex)
      }

     }

     return retValue
  }