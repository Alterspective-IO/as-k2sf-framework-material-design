
import { IFramework } from "@alterspective-io/as-k2sf-framework"
import { AS_MaterialDesign_TagNames } from "../Common/commonSettings";

export class alterspectiveMaterialDesignIconExtension {
    //Dependencies - adjust names as required
    keyword = AS_MaterialDesign_TagNames.icon;
    constructor(as: IFramework) {
    
        as.collections.viewInstanceControls.filter(c=>c.name.toLocaleLowerCase().includes(this.keyword)).forEach(c=>{

            console.log("got")
            let settings = c.value?.split(" ")

            if(settings)
            {
            let iconName = settings[0] || ""
            let iconSize = settings[1] || ""

            let newIcon = document.createElement("mwc-icon")
            
            if(iconSize)
            {
               // newIcon.style.color = "#03a9f4";
                newIcon.style.setProperty("--mdc-icon-size", iconSize);              
            }
            
            newIcon.append(iconName)

            c.getHTMLElement().parentElement?.replaceChild(newIcon,c.getHTMLElement())
            }


        })
    
    }

}
