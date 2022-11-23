import { pointedStoreComponent } from "../pointed/pointedStoreComponent"

export class pointedVehicleNumberComponent extends pointedStoreComponent {
    constructor() {
        super()
        this._storeChangedCallback =(oldVehicleNumber, newVehicleNumber, 
            oldDependencyValue, newDependencyValue) => {
                this.vehicleNumber = newVehicleNumber
                return this.vehicleNumber
        }
        this._condition = (oldVehicleNumber, newVehicleNumber,
            oldDependencyValue, newDependencyValue) => {
                return (oldVehicleNumber != newVehicleNumber)
        }
    }
    render() {
        this.innerHTML = `
        <strong>Nombre de vehicule: </strong> ${this.vehicleNumber}
        `
    }
    connectedCallback() {
        this.connectStore()
        this._vehicleNumber = this.storePointer.storeAttributeValue
        this.render()
    }
    get vehicleNumber() {
        return this._vehicleNumber
    }
    set vehicleNumber(newVehicleNumber) {
        if (this.vehicleNumber != newVehicleNumber) {
            this._vehicleNumber = newVehicleNumber
            this.render()
        }
    }
}