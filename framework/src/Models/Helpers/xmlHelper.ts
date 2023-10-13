
export function getAttributeValue(attributeName: string, xmlEventElement : Element): any {
    attributeName = attributeName.toLocaleLowerCase();
    let retValue = undefined
    let foundAttribute = xmlEventElement.getAttributeNames().find(name=>name.toLocaleLowerCase()==attributeName)
    if(foundAttribute)
    {
        retValue = xmlEventElement.getAttribute(foundAttribute)
        console.log(`Element [${xmlEventElement.tagName}] [${attributeName}] = [${retValue}] `) 
    }
    else
    {
        console.warn(`Element [${xmlEventElement.tagName}] does not contain attribute [${attributeName}] `) 
    }
    
    return retValue
        
}
export function getTextValue( xmlEventElement : Element): string {
    return xmlEventElement.textContent || ""
}