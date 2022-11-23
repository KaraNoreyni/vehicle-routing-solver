import { Store } from "../../../reducer"
import { getStoreStateAttributeFromKeysArray } from "../../../reducer/actions/getStore"

export class storeAttributePointer {
    // storeChangedCalback should return the value that you want to
    // toggle
    constructor(
        storeAttributeKeysArray,
        condition,
        storeChangedCallback,
        dependencyKeysArray,
    ) {    
        this._storeAttributeValue = 
            getStoreStateAttributeFromKeysArray(
                storeAttributeKeysArray)

        this.dependencyValue = !!dependencyKeysArray ? 
            getStoreStateAttributeFromKeysArray(
                dependencyKeysArray) :
            null

        this.unsubscribe = Store.subscribe(() => { 
            const oldValue = this.storeAttributeValue
            const newValue = getStoreStateAttributeFromKeysArray(
                storeAttributeKeysArray)

            const oldDependencyValue = this.dependencyValue
            const newDependencyValue = !!dependencyKeysArray ? 
                getStoreStateAttributeFromKeysArray(
                    dependencyKeysArray) :
                null
            if (condition(oldValue, newValue,
                oldDependencyValue, newDependencyValue)) {
                    this.storeAttributeValue = storeChangedCallback(
                        oldValue, newValue, 
                        oldDependencyValue, newDependencyValue)
            }
        })
    }
    get storeAttributeValue() {
        return this._storeAttributeValue
    }
    set storeAttributeValue(newValue) {
        this._storeAttributeValue = newValue
    }
}
