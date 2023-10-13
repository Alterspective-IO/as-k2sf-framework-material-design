import { IControllerDefinition } from "../interfaces/AGIControllerDefinition";
import { IContainer } from "../interfaces/IContainer";
import { IControlProperties } from "../interfaces/IControlProperties";
import { IControlProperty } from "../interfaces/IControlProperty";
import { autoMapAttributesToProperties } from "../processors";

// export class Controls extends BaseArray<Control, ControllerDefinition.Control> implements IControls {
//     constructor(control: ControllerDefinition.Control[] | undefined, parent: IContainer) {
//     let p = new PerformanceSession("Controls.Constructor()")
//     super(Control, control, parent);
//     p.finish()
// }
// }

export class ControlProperties extends Array<IControlProperty> implements IControlProperties {
    constructor(properties: IControllerDefinition.PropertiesProperties | undefined | string, parent: IContainer) {
       // let p = new PerformanceSession("Controls.Constructor()")
        super()

        

         if(properties==undefined) return []
         if(typeof properties=="string")
         {
             console.error("TODO!!!")
             return []
         }

         if(!Array.isArray(properties.property))
         {
             if(properties.property)
                this.push(new Property(properties.property,parent))
         }
         else
         {
             properties.property.forEach(p=>
                {
                    this.push(new Property(p,parent))
                })
         }        

       // p.finish()
    }
    }
    

    // export class Control extends BaseItem<ControllerDefinition.Control> implements IControl {
    //     constructor(control: ControllerDefinition.Control, parent: IContainer) {

export class Property implements IControlProperty  {
    constructor(property: IControllerDefinition.PurpleProperty, parent: IContainer) {
        this.value = '';
        this.name = '';
        autoMapAttributesToProperties(property, this)
    }
    name: string;
    value: string;
 
}
