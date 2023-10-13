
export function processParameters() {

}


// export function getObject()
// {
//     for (let [key, value] of Object.entries(meals)) {
//         console.log(key + ':' + value);
//       }

// }

export function autoMapAttributesToProperties(fromAttributes: any, toObject: any, matchCase: boolean = true) {

    if (matchCase == true) {
        Object.keys(toObject).forEach(key => {

            if (fromAttributes[key]) {
                toObject[key] = fromAttributes[key]
            }
        })
    }
    else {

        Object.keys(toObject).forEach(key => {

            Object.keys(fromAttributes).forEach(fKey => {

                if (key.toLowerCase() == fKey.toLowerCase())
                    toObject[key] = fromAttributes[fKey]
            })
        })
    }
}
