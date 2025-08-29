import { IControl } from "../interfaces";
import { Framework } from "./framework";
import { PerformanceSession } from "./framework.performance";



export function applyEvalCommandsV2(framework: Framework) {


    let m = new PerformanceSession("AS.applyEvalCommands");
    // let controlToEval = framework.collections.viewInstanceControls.filter((ctr) =>
    //   ctr.name?.includes("%{")
    // );

    
  
    
    //Search for control that have ~{{}} nd translate the inside value into a eval fiunction
    try {
      framework.collections.viewInstanceControls.filter((ctr)=>typeof ctr.value =="string")
        .filter((ctr) => ctr.value?.includes("${"))
        .forEach((ctr) => {
          console.log(`${ctr.name} has script - ${ctr.value}`)
         
          if(!ctr.value) return;

          let val = ctr.value;

          const func = new Function( `return \`${val}\`;`);

          const result = func();
         
        if(result!="") ctr.value  = result;

          ctr.rules.OnChange?.addListener(`Script Change`,evt=>
          {
            let evtCtr = evt.detail.parent as IControl
            let script = extractScriptFromControlValue(evtCtr.value);

            const result = new Function( `return \`${script}\`;`)();


            //let scriptExecutionValue = expressionToString(script);//Convert expression into string in closed context
            if(result!="") evtCtr.value  = result; 
          })

          // ctr.events.smartformEventChanged.addEvent((e:EmittedControlEvent)=>
          // {
          //   let script = extractScriptFromControlValue(controlValue);
          //   ctr.value  = this.expressionToString(script); 
          // })


          // let replacers = _.uniq(controlValue.match(regexString));
          // let processedReplacers = new Array<{ name: string; value: string }>();

          // replacers.forEach((r) => {
          //   let newValue = r;

          //   try {
          //     if (newValue.length > 3) {
          //       newValue = newValue.substring(2, newValue.length - 2);
          //       newValue = this.expressionToString(newValue); //Convert expression into string in closed context
          //     }
          //   } catch (ex: any) {
          //     newValue = `-- Error [${ex.toString()}] `;
          //   }
          //   processedReplacers.push({ name: r, value: newValue });
          //   controlValue = controlValue.replace(
          //     new RegExp(this.escapeRegExp(r), "g"),
          //     newValue
          //   );
          // });

          // ctr.value = controlValue;
          // let expToEval = ctr.value
          // if(expToEval)
          // {
          //     ctr.value = eval(expToEval)
          // }

          // ctr.rules.Changed?.addListener(evt=>{

          //     let value = (evt.detail.parent as IControl).value || "";
          //     (evt.detail.parent as IControl).value = eval(value)

          // })
        });
    } catch (error) {

        console.warn(error);
    }
    m.finish();

    //this.formName.value = this._as.form?.name
    //this.viewsOnForm.value = this._as.collections.views.map((v) => v.name).toString()
  }


  export function applyEvalCommands(framework: Framework) {


    let m = new PerformanceSession("AS.applyEvalCommands");
    let controlToEval = framework.collections.viewInstanceControls.filter((ctr) =>
      ctr.name?.includes("~~")
    );

    controlToEval.forEach((ctr) => {
      let expToEval = ctr.name.split("~~")[1];
      if (expToEval) {
        ctr.value = eval(expToEval);
      }
    });

    //const regexString = /\{{([^\}}[]*)}}/gm;
    //const regexString = /\\~{{/gm;
 

  
    
    //Search for control that have ~{{}} nd translate the inside value into a eval fiunction
    try {
      framework.collections.viewInstanceControls.filter((ctr)=>typeof ctr.value =="string")
        .filter((ctr) => ctr.value?.includes("~{{"))
        .forEach((ctr) => {
          console.log(`${ctr.name} has script - ${ctr.value}`)
         

        
        let script = extractScriptFromControlValue(ctr.value);
        let scriptExecutionValue = expressionToString(script);//Convert expression into string in closed context
        if(scriptExecutionValue!="") ctr.value  = scriptExecutionValue; 
         


          ctr.rules.OnChange?.addListener(`Script Change`,evt=>
          {
            let evtCtr = evt.detail.parent as IControl
            let script = extractScriptFromControlValue(evtCtr.value);
            let scriptExecutionValue = expressionToString(script);//Convert expression into string in closed context
            if(scriptExecutionValue!="") evtCtr.value  = scriptExecutionValue; 
          })

          // ctr.events.smartformEventChanged.addEvent((e:EmittedControlEvent)=>
          // {
          //   let script = extractScriptFromControlValue(controlValue);
          //   ctr.value  = this.expressionToString(script); 
          // })


          // let replacers = _.uniq(controlValue.match(regexString));
          // let processedReplacers = new Array<{ name: string; value: string }>();

          // replacers.forEach((r) => {
          //   let newValue = r;

          //   try {
          //     if (newValue.length > 3) {
          //       newValue = newValue.substring(2, newValue.length - 2);
          //       newValue = this.expressionToString(newValue); //Convert expression into string in closed context
          //     }
          //   } catch (ex: any) {
          //     newValue = `-- Error [${ex.toString()}] `;
          //   }
          //   processedReplacers.push({ name: r, value: newValue });
          //   controlValue = controlValue.replace(
          //     new RegExp(this.escapeRegExp(r), "g"),
          //     newValue
          //   );
          // });

          // ctr.value = controlValue;
          // let expToEval = ctr.value
          // if(expToEval)
          // {
          //     ctr.value = eval(expToEval)
          // }

          // ctr.rules.Changed?.addListener(evt=>{

          //     let value = (evt.detail.parent as IControl).value || "";
          //     (evt.detail.parent as IControl).value = eval(value)

          // })
        });
    } catch (error) {

        console.warn(error);
    }
    m.finish();

    //this.formName.value = this._as.form?.name
    //this.viewsOnForm.value = this._as.collections.views.map((v) => v.name).toString()
  }

  export function expressionToString(expression: string): string {
    let retValue = "";
    if(typeof expression!="string") return "";
    if(expression.length==0) return "";

    try {
      retValue = Function(`"use strict";return (${expression.toString()})`)();
    } catch (error) {
      console.warn(`Error executing script on control:`, error)
    }
    
    return retValue
  }


  function extractScriptFromControlValue(controlValue?: string) {
  
    if(typeof controlValue!="string") return "";
    if(controlValue.indexOf("~{{")==-1) return "";
    
      let scriptStartPosition = controlValue.indexOf("~{{") + 3;
      let script = controlValue.substring(scriptStartPosition);
      return script;
    
  
  }