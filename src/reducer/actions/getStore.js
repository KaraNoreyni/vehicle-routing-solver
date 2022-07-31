import { Store } from ".."

export function getStoreStateAttributeFromKeysArray(array) {
    /*
    if you want to pass through a function, set corresponding
    key as array with first element as function without ()
    and the second as parameter
    */
    // 
    const state = Store.getState()
    let target = state 
    array.forEach(key => {
        console.log(key)
        const newTarget = typeof(key) === "object" ?
            target[key[0]](key[1]) :
            target[key]
        target = newTarget
    })
    return target
}