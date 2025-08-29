import { IControl } from "../../interfaces";
import { Control } from "../control";

export interface IStaticListItem {
    text: string;
    value: string;
    selected: boolean;
    disabled: boolean;
    className: string;
    metadata: any;
}


export const staticListItemValueTemplate:IStaticListItem = {
    text: "New Option Text",  // The display text for the item
    value: "newValue",       // The value for the item
    selected: false,         // Whether this item should be selected
    disabled: false,         // Whether this item should be disabled
    className: "custom-class", // Additional CSS class for styling
    metadata: {}             // Optional metadata
};


export function addListToDropdownList(items: Array<string>, list: Control) {
    
    let widgetInstance = list.widgetInstance();
    if(widgetInstance == null) {
        // console.error(`Cannot add items to dropdown list, widget instance not found for control ${list.id}`);
        throw new Error(`Cannot add items to dropdown list, widget instance not found for control ${list.id}`);
    }

    
    if (items && items.length > 0) {
        items.forEach((item) => {

            let newStaticItem : IStaticListItem = {
                text: item,
                value: item,
                selected: false,
                disabled: false,
                className: "",
                metadata: {}
            };

            addItemToDropdownList(newStaticItem, list,false);
        });


        switch (list.type) {
            case "DropDown":
                widgetInstance.refresh(); // Refresh the dropdown to reflect changes
                break;
            case "AutoComplete":
                widgetInstance.setListData(); // Refresh the dropdown to reflect changes
                break;
            default:
                console.error("Control is not a dropdown, multiselect checkbox, or autocomplete control.");
                return;
        }


        // widgetInstance.refresh(); // Refresh the dropdown to reflect changes
    }
}


export function addItemToDropdownList(item: IStaticListItem, list: Control, refresh: boolean = true) {
    
    //make sure item is in the correct format
    if (!item) {
        console.error("Item must have a text and value property.");
        console.log("Ensure item value is in the following format: ", staticListItemValueTemplate);
        throw new Error("Item must have a text and value property.");
        return;
    }
    
    //ensure item has at leave a text
    if (!item.text) {
        console.error("Item must have a text property.");
        console.log("Ensure item value is in the following format: ", staticListItemValueTemplate);
        throw new Error("Item must have a text property.");
        return;
    }

    //if no value is provided, use the text as the value
    if (!item.value) {
        item.value = item.text;
    }


   
   

    
    let widgetInstance = list.widgetInstance();

    if (widgetInstance) {


        switch (list.type) {
            case "DropDown":
                var appended = widgetInstance.AppendItem(item);
                if (appended) {
                    console.log("Item appended successfully!");
                    if (refresh)
                    {
                        widgetInstance.refresh(); // Refresh the dropdown to reflect changes
                    }
                } else {
                    console.log("Item already exists or could not be appended.");
                    console.log("Ensure item value is in the following format: ", staticListItemValueTemplate);
                }
            break;
            case "AutoComplete":


            let newAutoCompleteItem = {
                value: item.value, display: item.text, isDefault: item.selected
            }

            let currentItems = JSON.parse(widgetInstance.options.fixedListItems);
            currentItems.push(newAutoCompleteItem);

            widgetInstance.options.fixedListItems = JSON.stringify(currentItems);
                
            
                    if (refresh)
                    {
                        widgetInstance.setListData(); // Refresh the dropdown to reflect changes
                    }

            

                break;
            default:
                console.error("Control is not a dropdown, multiselect checkbox, or autocomplete control.");
                return;
        }


       
    } else {
        console.error("Dropdown widget instance not found.");
    }


}


export function getControlWidgetHTMLElement(control: Control): HTMLElement | null {
    
    if (control == null) return null;
    if (control.id == null || control.type == null) 
    {
        console.error(`Control Id [${control.id}] or type [${control.type}] is null, could not get widget element. for control`,control);
        return null;
    }

    let jQueryElement = $("#" + control.id);
    
    if (jQueryElement.length == 0) {
        // console.error(`Could not find widget element for control ${control.id} of type ${control.type}`);
        // return null;
        jQueryElement = $("#" + control.id + "_" + control.type);
        if (jQueryElement.length == 0) {
            console.error(`Could not find widget element for control ${control.id} of type ${control.type}`);
            return null;
        }
    }

    return jQueryElement[0];

    
}


    /**
     * Gets the type of the K2 widget from the data attributes.
     * If the type is already cached, it returns the cached value.
     */
    export function getWidgetType(element:HTMLElement): string | undefined
     {

        if(element == null) return undefined;
        const elementData = $(element).data();
        for (const key in elementData) {
            if (key.startsWith("ui-") || key.startsWith("sfc-")) { 
                return key;
            }
        }
        return undefined;
    }

    /**
     * Gets the K2 widget instance from the control.
     * @param control The control to get the widget instance from.
     * @returns 
     */
    export function getControlWidgetInstance(control: Control): any {
        
        let widgetElement = getControlWidgetHTMLElement(control);
        if (widgetElement == null) return null;
        let widgetType = getWidgetType(widgetElement);
        if (widgetType == null) return null;

        return $(widgetElement).data(widgetType)

    }