import { FormatType, IStyle, so_Controller, StyleFormat } from "asFramework/src/index";
import { k2StyleNameToJavascriptName } from "../../Common/StyleHelper";

export function applyK2FormatToFormatter(
  k2StyleObject: IStyle,
  formatter: any,
  systemName:string,
  dataType?:so_Controller.Type
): any {


  if (!k2StyleObject) return undefined;
  let retValue: any = formatter || {};


  let format : StyleFormat= k2StyleObject.format || {}
  let formatType = format.type || dataType || FormatType.Text
  
  // console.log(`System Name [${systemName}] Format Type [${formatType}]`,format.type)

  let conversionFunction: Function | undefined;

  switch (formatType) {
    case FormatType.AutoGUID:
    case FormatType.GUID:
    case FormatType.AutoNumber:
        
        break;
    case FormatType.Currency:
      let currencySymbol = format.currencySymbol;
      let culture = format.culture;
      conversionFunction = function (props: any) {
        let retValue =
          currencySymbol +
          Number.parseFloat(props.row[systemName]).toLocaleString(culture, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
        if (retValue.includes("NaN")) return "-";
        return retValue;
      };
      break;
    case FormatType.Decimal:
      break;
    case FormatType.Number:
      if (format._ == "N0") {
      }
      //TODO check format type
      conversionFunction = function (props: any) {
        return Number.parseFloat(props.row[systemName]).toLocaleString();
      };
      break;
    case FormatType.Date:
      conversionFunction = function (props: any) {
        let dateValue = new Date(Date.parse(props.row[systemName]));
        return dateValue.toLocaleDateString();
      };
      break;

      break;
    case FormatType.DateTime:
      conversionFunction = function (props: any) {
        let dateValue = new Date(Date.parse(props.row[systemName]));
        return dateValue.toLocaleString();
      };
      break;
    case FormatType.Time:
        conversionFunction = function (props: any) {
            let dateValue = new Date(Date.parse(props.row[systemName]));
            return dateValue.toLocaleTimeString();
          };
      break;
    case FormatType.File:
      break;
    case FormatType.Hyperlink:
      break;
    case FormatType.Image:
      break;
    case FormatType.Memo:
      break;
    case FormatType.MultiValue:
      break;
    case FormatType.YesNo:
        conversionFunction = function (props: any) {
            try {
              // console.log("YesNo")
              if(props.row[systemName]=="false")
              {
                return "✓"
              }
              return "𐄂"
            } catch (err: any) {
              return props.row[systemName];
            }
          };
      break;
    case FormatType.Text:
      conversionFunction = function (props: any) {
        // console.log(systemName)
        return props.row[systemName]
      };
      break;

    default:
      break;
  }


  // //TODO: remove here to hard code for debug
  // conversionFunction = function (props: any) {
  //   // console.log(systemName)
  //   return props.row[systemName]
  // };

  if (conversionFunction) {
    retValue = function (props: any) {
      try {
      
        if (conversionFunction) return conversionFunction(props);
        else return props.row[systemName];
      } catch (err: any) {
        return err.toString();
      }
    };
  }
  else
  {
    console.warn(`Format type ${format.type} not implemented yet.`)
  }



  
  return retValue;
}

export function applyK2StyleToRenderer(
  k2StyleObject: any,
  renderer?: any
): any {
  let retValue: any = renderer || {};
  retValue.styles = retValue.style || {};

  for (const key in k2StyleObject) {
    let styleGroup = k2StyleObject[key];

    if (key == "font" || key == "text") {
      for (const k2StyleName in styleGroup) {
        let style = styleGroup[k2StyleName];
        let propperName = k2StyleNameToJavascriptName(k2StyleName);
        retValue.styles[propperName] = style.toLowerCase();
      }
    }
  }
  return retValue;
}
