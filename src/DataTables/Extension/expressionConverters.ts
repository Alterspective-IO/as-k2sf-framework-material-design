import { Log } from "asFramework/src/index"
import { CustomButtonRenderer } from "../CustomRenderer/Button";
import { OverriddenDefaultRenderer } from "../CustomRenderer/Default";
import { CustomColumnHeader } from "../CustomRenderer/Header";
import { CustomProcessBarRenderer } from "../CustomRenderer/progressBar";
import { CustomSliderRenderer } from "../CustomRenderer/Slider";
import { DataGridRenderOptions, IPassPack } from "./interfaces";

  /**
   * Convert functions found in settings.OptGrid.column[].formatter into executable functions
   * @param instance
   * @returns
   */
   export function convertExpressions<T>(obj: any, passPack: IPassPack): T {
    
    for (var k in obj) {
      let currentObject = obj[k];
      if (k == "template") {
        Log(`got  template -------`);
      }
      if (k == "exp") {
        obj = convertStringToFunction(obj, k, obj[k], passPack);
        break;
      } else {
        if (k != "dataBoundK2Controls" && k != "extraInfo" && k != "options" && k != "SupportingObjects") {
          if (typeof currentObject == "object" && currentObject !== null)  {
          // console.log("TCL: currentObject", currentObject)
            
            obj[k] = convertExpressions(currentObject, passPack);
          }
        }
      }
      // else {
      //   if (typeof currentObject == "string") {
      //     if (currentObject.startsWith("exp:")) {
      //       obj[k] = this.convertStringToFunction(obj,k, currentObject.replace("exp:", ""), passPack);
      //     }
      //   }
      // }
    }
    return obj;
  }

  function convertStringToFunction(
    parent: any,
    propertyName: string,
    expressionValue: string | Array<string>,
    passPack: IPassPack
  ): string | Function {
    let str = Array.isArray(expressionValue)
      ? expressionValue.join(" ")
      : expressionValue;

    let retValue: string | Function = str;
    let strToShow = JSON.stringify(str.replace(/\`/g, '"'));

    let name = "unknown";
    if (parent.name) {
      name = parent.name;
    }

    let expressions = "";
    //TODO - search str and only build required expressions.
    //Build expressions
    if (passPack.processedSettings.expressions) {
      for (
        let index = 0;
        index < passPack.processedSettings.expressions.length;
        index++
      ) {
        const exp = passPack.processedSettings.expressions[index];

        let expressionText = Array.isArray(exp.expression)
          ? exp.expression.join("\n")
          : exp.expression;
        expressions += `function ${exp.name} { return ${expressionText};}`;
      }
    }

    //function aud(){return parseFloat(value|summary?.sum|0).toLocaleString(undefined,{ style:'currency', currency:'AUD'})}

    str = Function(`"use strict";
          return ( (props)=> 
          { 
            console.log("Expression for ${name}.${propertyName}"); 
            let row, column, value, rowKey, summary;
            value = props?.value; 

            summary = props

            if(props.row){
            // console.log(\`[${propertyName}] [\${props.row._attributes.rowNum}] [\${props.column.header}] [\${props.column.name}] \`);
             row = props.row;
             column = props.column;
             rowKey = props.row._attributes.rowNum;
            }
            else if (props.grid)
            {
            // console.log(\`[${propertyName}] [\${props.rowKey}]  [\${props.value}] [\${props.formattedValue}] [\${props.columnInfo.header}] [\${props.columnInfo.name}] \`);
            rowKey = props.rowKey; 
            row = props.grid.getData()[rowKey]
             column =props.columnInfo             
            }

           

            let retValue = value;
            try{          
              ${expressions}   
                retValue = ${str};              
            }
            catch (err)
            {
              console.warn(\`Error executing expression for property [${propertyName}] with property value:[${strToShow}] - Error [\${err.message}]\`);
            }
            //console.log(\`[${propertyName}] [\${rowKey}] ---> ${strToShow} ---> value =[\${retValue}]\`);
           // console.log(row);
           if(!something) var something=[]
           something.push({"${propertyName}":retValue})

            return retValue;
          })`)();

    return str;
  }


  /**
   * Convert any found renderer to a renderer object
   * @param instance
   * @returns
   */
   export function convertRenderers<T>(
    obj: any,
    passPack: IPassPack,
    previousObjectPath?: string
  ): T {
    if (!previousObjectPath) previousObjectPath = "root";
    for (var k in obj) {
      let objectPath = previousObjectPath + "." + k;
      // Log(objectPath, { color: "brown" });
      let currentObjectValue = obj[k];
      if (k == "renderer") {
        obj[k] = createRenderedObject(
          currentObjectValue,
          passPack,
          objectPath
        );
      } else {
        if (
          typeof currentObjectValue == "object" &&
          currentObjectValue !== null &&
          k != "dataBoundK2Controls" && k!="extraInfo"
        ) {
          obj[k] = convertRenderers(
            currentObjectValue,
            passPack,
            objectPath
          );
        }
      }
    }
    return obj;
  }

  function createRenderedObject(
    renderer: any,
    passPack: IPassPack,
    objectPath: string
  ): any {
    let newRenderer = {} as any;
    if (typeof renderer == "string") {
      newRenderer.type = renderer;
    } else {
      newRenderer = renderer || {};
    }

    let options: DataGridRenderOptions = newRenderer.options;

    if (!options)
      options = {
        as: window.as,
        passPack: passPack,
      };
    else {
      options.as = window.as;
      options.passPack = passPack;
    }
    newRenderer.options = options;

    

    if (newRenderer.type) {
      if(typeof newRenderer.type != "function") //if not already a function
      {
      switch ((newRenderer.type as string).toLocaleLowerCase()) {
        case "button":
          newRenderer.type = CustomButtonRenderer;
          break;
        case "slider":
          newRenderer.type = CustomSliderRenderer;
          break;
        case "defaultheader":
          newRenderer.type = CustomColumnHeader;
          break;
          case "progress":
            newRenderer.type = CustomProcessBarRenderer;
            break;
        default:
          newRenderer.type = OverriddenDefaultRenderer;
          break;
      }
      }

      if (objectPath.includes("root.optGrid.header.columns")) {
        //Header renderes dont have an object, just the class passed in
        newRenderer = newRenderer.type;
      }
    }

    return newRenderer;
  }