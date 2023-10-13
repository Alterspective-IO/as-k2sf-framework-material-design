/*

    Alterspective Entry Point

    This module is responsible for:
    1. Exposing framework capabilities to the front end application 
    2. Initializing the framework
    3. Initializing the view extensions 
    4. Initializing the custom controls
    

*/

/// <reference path="Globals.ts" />
/// <reference path="declaration.ts" />

export * from "./Models/framework";
export * as utils from "./Models/Helpers/framework.utils";
export * from "./Models/extensions";
export * from "./Models/framework.performance";
export * from "./Models/rulev2";
export * from "./interfaces/index";
export * from "./Models/viewInstances";
export * from "./Models/control";

//test

 
// export async function initialize(window:Window, scriptFileUrl:string,notificationsServerUrl:string) :Promise<any>
// {
//     let asClass = new ASF.Framework(window,scriptFileUrl,notificationsServerUrl)
//     return asClass.initialize()
// return {}

// let frameworkInitializeStart = performance.now();
//let newFramework = new ASF.Framework(window,)

// newFramework.initializePromise.then(fm => {
//     let frameworkInitializeEnd = performance.now();
//     const inSeconds = (frameworkInitializeEnd - frameworkInitializeStart)
//     console.info(`%c Completed: Framework Initialize ${inSeconds} milliseconds`, 'background: #222; color: #bada55');

//     //Load extensions

//     //Load Custom Controls
//     console.log("Processing Custom Controls")
//     let pcc = new PerformanceSession("Initialize Custom Controls")
//     cc.processCustomControls(newFramework).then(() => { pcc.finish(); });
// })

// newFramework.initialize().then(()=> {
//     let frameworkInitializeEnd = performance.now();
//     const inSeconds = (frameworkInitializeEnd - frameworkInitializeStart)
//     console.info(`%c Completed: Framework Initialize ${inSeconds} milliseconds`, 'background: #222; color: #bada55');

//     //Load extensions

//     //Load Custom Controls
//     console.log("Processing Custom Controls")
//     let pcc = new PerformanceSession("Initialize Custom Controls")
//     cc.processCustomControls(newFramework).then(()=>
//     {pcc.finish();});

// });
//}

//Auto start when module loaded...
//initialize()
