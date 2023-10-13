
//const css = require("./developerMode.css")


//import {} from "../../Globals"
import { IDeveloperMode } from "../interfaces/IdeveloperMode";
import { IFramework } from "../interfaces/IFramework";
import css from "./developerMode.css"

export class DeveloperMode implements IDeveloperMode{

    devBarHTMLTemplate = "<div id='as-dev-header' class='as dev-header'><div class='as dev-header-tab'>Developer Mode</div></div>";
    debugMode: boolean = false
    devMode: boolean = false
    dragging = false;
    devModeWindowState : "open" | "closed"


    constructor(public as: IFramework) {
        this.devModeWindowState="closed"
    }

    async initialize() {
        this.validateModes()
        if (this.devMode == true) this.implementDevMode()
        if(this.debugMode == true) this.implementDebugMode()
        
    }
    /**
     * If we have ?asdebugmode=true then find all as table debug tables and make them visable
     */

    implementDebugMode() {
        
        this.as.collections.viewInstanceControls.filter(c=>c.name.toLowerCase().includes("as-debug")).forEach(c=>
            {
                c.setControlVisibility(true);
            })

        this.as.collections.viewInstances.forEach(vi=>{
            //TODO: set to visable 
        })

    }

    validateModes() {
        const urlParams = new URLSearchParams(window.location.search);

        const lowerCaseParams = new URLSearchParams();
        for (const [name, value] of urlParams) {
            lowerCaseParams.append(name.toLowerCase(), value);
        } 


        if (lowerCaseParams) {
            this.debugMode = (/true/i).test(lowerCaseParams.get('asdebugmode') || '')
            this.devMode = (/true/i).test(lowerCaseParams.get('asdevmode') || '')
        }
    }


    async implementDevMode() { 

        //import script require
        require("../../bower_components/slidereveal/src/slidereveal")
        css.use("window.document")
        this.createDevModeSlider()
    }

    open():void
    {
        if(this.devModeWindowState=="closed")
        {
            $("#as-dev-sidebar-handler",this.as.window.document).trigger("click")
        }
    }

    createDevModeSlider() {

        let currentLocation = window.location;
        let smartformsBaseUrl = currentLocation.protocol + "//" + currentLocation.host + "/" + currentLocation.pathname.split('/')[1];

        let imageHtmlCollapsed = '<i class="fas fa-angle-left"><</i>';
        let imageHtmlExpanded = '<i class="fas fa-angle-right">></i>';
        let formSystemName = (this.as.window as any)._runtimeArtifactName

        let menuFormUrl = smartformsBaseUrl + '/Runtime/Form/AS.Framework.System.DeveloperMode.Form?FormSystemName=' + formSystemName;

        let iframeHtml = '<iframe id="as-dev-sidebar-iframe" src="' + menuFormUrl + '" frameborder="0" class="as dev-sidebar-iframe"/>';
        let html = '<div id="as-dev-sidebar" class="as dev-sidebar-panel">' +
            '<span id="as-dev-sidebar-position"></span>' +
            '<div id="as-dev-sidebar-dragbar"></div>' +
            '<div id="as-dev-sidebar-handler"class="as dev-sidebar-handle dev-header-tab">' +
            imageHtmlCollapsed +
            '</div>' + iframeHtml +
            '</div>';
        ///   $(html).insertBefore("body")
        // $(this.devBarHTMLTemplate).insertBefore("body")
        $('body').prepend($(html));
        $('body').prepend(this.devBarHTMLTemplate);
        
        var thisObj = this
        let slider = ($("#as-dev-sidebar") as any).slideReveal({
            push: false,
            position: "right",
            width: "50%",
            top: "34px",
            overlay: false,
            overlayColor: "grey",
            trigger: $("#as-dev-sidebar-handler"),
            shown: function (obj: any) {
                obj.find("#as-dev-sidebar-handler").html(imageHtmlExpanded);
                obj.addClass("left-shadow-overlay");
                thisObj.devModeWindowState="open"
            },
            hidden: function (obj: any) {
                obj.find("#as-dev-sidebar-handler").html(imageHtmlCollapsed);
                obj.removeClass("left-shadow-overlay");
                thisObj.devModeWindowState="closed"
            }
        });


    }


}