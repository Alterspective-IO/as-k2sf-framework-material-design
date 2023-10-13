import { Framework, IFramework, IRuntimeParameter } from "."
declare global {

    function checkExists(n:any) : boolean
    var formBindingXml : XMLDocument
    function $mn(document:XMLDocument, path: string) :  Element[] | null
    // function function constructHandlersForBehaviour(n:any, t:any, q:any, r:any, u:any) : Handler
    interface JQuery
    {
        draggable() : JQuery<HTMLElement>
    }
     var executeControlFunctionHash : any[]
     var SourceCode:any    

     interface String
     {
        xpathValueEncode() : string
       
     }
    interface Window { 
       // MonacoEnvironment : Environment
       getViewSelectedCounter(n:any) : any
        ASFrameworkLoaded:Promise<IFramework>;
        alterspective: {
            Framework:  typeof Framework;
          }
        as: IFramework;
        PopulateObject:any
        ViewHiddenHash:any
        executeControlFunctionHash:Array<any>
        originalHandleEvent:any
        handleEvent:any
        originalExecuteControlFunction:any
        executeControlFunction:any
        evalFunction(obj:any):any
        SFCTextArea: any
         __runtimeControllersDefinition: string
         __runtimeParametersDefinition:string
         __runtimeSessionDetails:string
         __runtimeEventsDefinition:string
         _runtimeParameters:IRuntimeParameter.RuntimeParameters
         getViewParameterValue(controlName:string,viewInstanceId:string):string
        
        }
}


