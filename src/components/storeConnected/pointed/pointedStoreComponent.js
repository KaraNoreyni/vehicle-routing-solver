import { storeAttributePointer } from "../pointer/storeAttributePointer"

export class pointedStoreComponent extends HTMLElement {
    constructor() {
        super()
    }
    get storeAttributeKeysArray() {
        // define keys as string separated by simple colon ','
        // handle functions with single parameter by setting two 
        // keys without separation between colon
        return this.getAttribute(
            'storeAttributeKeys').split(',').map(key => {
                return (key.split(' ').length > 1) ?
                    key.split(' ') : key})}

    get dependencyKeysArray() {
        // Same as storeAttributeKeysArray
        // exept that return null if we don't set attribute
        return this.hasAttribute(
            'dependencyKeysArray') ?
            this.getAttribute(
                'dependencyKeysArray').split(',').map(key => {
                    return (key.split(' ').length > 1) ?
                        key.split(' ') : key}) : null} 
    get storeChangedCallback() {
        return this._storeChangedCallback}
    get condition() {
        return this._condition
    }

    connectStore() {
        this.storePointer = new storeAttributePointer(
            this.storeAttributeKeysArray,
            this.condition,
            this.storeChangedCallback,
            this.dependencyKeysArray
        )
    }
    disconnectedCallback() {
        this.storePointer.unsubscribe()
    }
}