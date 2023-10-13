// import { fail } from "assert"

// export class ViewDependencies
// {

//     items : Array<ViewDependencyItem> 
    
//     constructor()
//     {
//         this.items = new Array<ViewDependencyItem>()
//     }
// }

// export class ViewDependencyItem
// {
//     viewName: string = ''
//     controlName:string = ''
//     failOnMissing:boolean = false
//     warnOnMissing:boolean = true
//     foundControl: any //TODO: create base class for control

//     constructor(controlName:string,viewName?:string,failOnMissing?:boolean,warnOnMissing?:boolean)
//     {
//         this.controlName = controlName
//         this.viewName = viewName || this.viewName
//         this.failOnMissing = failOnMissing || this.failOnMissing
//         this.warnOnMissing = warnOnMissing || this.warnOnMissing
//     }
// }