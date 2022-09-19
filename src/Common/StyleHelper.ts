import { IFramework } from "@alterspective-io/as-k2sf-framework"

function resetElementFontSize(htmlElement: HTMLElement) {}
function getResetFontSize(fontSizeToAdjust: number) {
  return getAdjustedFontSizeToReferenceElement($("html")[0], fontSizeToAdjust);
}

function getAdjustedFontSizeToReferenceElement(
  referenceElement: HTMLElement,
  fontSizeToAdjust: number
) {
  //Get the HTML font size, this is set by K2 to a specific % nwe get the calculated size and then work out the % against HTML default font size of 16px
  let rootFontSizeText = window
    .getComputedStyle($("html")[0], null)
    .getPropertyValue("font-size");
  let rootFontSize = parseFloat(
    rootFontSizeText.substring(0, rootFontSizeText.indexOf("px")).trim()
  );
  let htmlFontSizePercentage = rootFontSize / 16; //Get the K2 html font size as a % against HTML default font size of 16px
  let differenceToDefault = 1 - htmlFontSizePercentage; //Percentage different K2 applies
  return fontSizeToAdjust / differenceToDefault;
}

export function displayFormIfHidden() {
  let styleControl = window.as.getControlsByName(
    "Private - Style Display None"
  )[0];

  if (!styleControl) return;

  // let styleValue = styleControl.value
  $(".runtime-content").fadeOut(2);
  $(".runtime-content").fadeIn(1000);

  window.as.getControlsByName(
    "Private - Style Display None"
  ).forEach(c=>c.value="")


}

export function removeOverflows() {
  $("[controltype='Cell']")
    .addClass("sux")
    .addClass("sux-container")
    .addClass("sux-overflow");
  $("[name='Table']")
    .addClass("sux")
    .addClass("sux-container")
    .addClass("sux-overflow");
  $(".panel-body-wrapper")
    .addClass("sux")
    .addClass("sux-container")
    .addClass("sux-overflow");
  $("body").addClass("sux-extensions");
}

export function getK2ThemeVariable(variable:string): string
{
  return window.getComputedStyle(document.getElementsByClassName("theme-entry")[0]).getPropertyValue(variable);
}

export function addDependantTopLevelStyles(as:IFramework) {
  //TODO: need better way as duplicates could happen
  var link = as.window.document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href =
    "https://fonts.googleapis.com/css?family=Material+Icons&display=block";
  as.window.document.head.appendChild(link);
}


export function k2StyleNameToJavascriptName(k2StyleName: string): string {
  switch (k2StyleName) {
    case "Family":
      return "fontFamily";
      break;
    case "Weight":
      return "fontWeight";
      break;
    case "Style":
      return "fontStyle";
      break;
    case "Size":
      return "fontSize";
      break;
    case "Color":
      return "color";
    case "Decoration":
      return "textDecoration";
      break;
    default:
      return k2StyleName;
      break;
  }
}
