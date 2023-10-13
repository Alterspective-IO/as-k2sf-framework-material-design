import * as JP from "jsonpath-plus";
import * as _ from "lodash";
import { PerformanceSession } from "../framework.performance";


export{JP}

export enum searchObjects {
  View = "controller",
  Control = "control",
}

export function isDefined(value: any): boolean {
  try {
    return value !== undefined && value !== null;
  } catch (ex) {
    console.warn(ex);
    return false;
  }
}
export function addScript(
  src: string,
  callback: ((this: GlobalEventHandlers, ev: Event) => any) | null,
  doc: Document
) {
  var s = doc.createElement("script");
  s.setAttribute("src", src);
  s.onload = callback;
  document.body.appendChild(s);
}

export function isDefinedNotEmpty(value: any): boolean {
  return value !== undefined && value !== null && value !== "";
}
export function isDefinedNotEmptyGuid(value: any): boolean {
  return (
    value !== undefined &&
    value !== null &&
    value !== "" &&
    value !== "00000000-0000-0000-0000-000000000000"
  );
}
export function isDefinedNotGuid(value: any): boolean {
  return (
    value !== undefined &&
    value !== null &&
    value !== "" &&
    !value.toString().containsGuid()
  );
}

export function camelCase(name: string) {
  return _.camelCase(name);
}

export function onlyUnique(value: any, index: any, self: any) {
  return self.indexOf(value) === index;
}

// export function validateViewDependencies(dependencies: ViewDependencies)
// {

//     dependencies.items.forEach(item=>
//         {
//             console.log(`Validating ${item.controlName} - ${item.viewName}`)
//             console.warn("TODO: find and allocate controls to dependencies")

//         })

// }



export function validateArray<T>(obj: T | T[] | undefined): T[] {
  if (obj === undefined) return [];
  if (!Array.isArray(obj)) obj = [obj];
  return obj;
}


export function xmlToXMLDocument(XML:string) : XMLDocument | undefined
{
    let retValue : XMLDocument | undefined
    let p0 = new PerformanceSession(`DOMParser().parseFromString(${name})`);
    try {
        retValue= new DOMParser().parseFromString(XML, "text/xml");
    }
    catch (err) {
        console.error(`Failed processing XML for : ${name} : ${err}`)
        //throw err
    }
    p0.finish()
    return retValue
        
}



export function toJSON(object:any) 
{
  debugger;
  let cache = new Array<any>();
  function cyclicReplacer(key: any, value: any) {
    
    if(typeof key ==='string')
    {
      if(key=="_as" || key=="as") return
      if(key=="parent" && typeof value === 'object') return
    }
      if (typeof value === 'object' && value !== null) {
          if (cache.indexOf(value) !== -1) {
              // Circular reference found, discard key
              return;
          }
          // Store value in our collection
          cache.push(value);
      }
      return value;
  }
  return JSON.stringify(object,cyclicReplacer)
}

export function jsonPathComplexObject(path: string, object:any) {  
  return JP.JSONPath({ path: path, json: toJSON(object) });
}


export function jsonPath(path: string, json: string) {
  return JP.JSONPath({ path: path, json: json });
}