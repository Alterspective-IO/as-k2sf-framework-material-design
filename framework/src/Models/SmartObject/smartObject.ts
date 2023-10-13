import { IK2SerialisedArray } from "../../interfaces/SmartObjects/IK2SerialisedArray"




export class SerialisedSmartObjectBaseArrayFactory {
  static createFromSerialisedDataArray<T extends SmartObjectBase<T>>(TCreator: { new(): T; }, serialisedDataArray: string): T[] {
    let retValue = new Array<T>()
    if (serialisedDataArray.length == 0) return retValue

    try {

      let array: IK2SerialisedArray<T> = JSON.parse(serialisedDataArray)

      array.$values.forEach(item => {
        let newitem: T = new TCreator()
        newitem.createFromData(item)
        retValue.push(newitem)
      })
    }
    catch (err) {
      console.warn(`There was an issue de-serialising smartobject string for [${TCreator.name}] with value [${serialisedDataArray}]`)
    }
    return retValue
  }
}

export  class SmartObjectBase<T extends SmartObjectBase<T>>
{
  createFromData(data: any) {
    Object.assign(this, data)
  }

  createFromSerialisedData(serialisedData: string) {
    Object.assign(this, JSON.parse(serialisedData))
  }

  static getArrayFromSerialisedArrayData<T extends SmartObjectBase<T>>(TCreator: { new(): T; }, serialisedArrayData: string): T[] {
    return SerialisedSmartObjectBaseArrayFactory.createFromSerialisedDataArray(TCreator, serialisedArrayData)
  }
}





