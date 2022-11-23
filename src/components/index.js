import { addressAutofill } from './addressAutofill/addressAutocompleteInput';
import jobTable from './storeConnected/jobTable/component/jobTable';
import { resolveButton, testResolveButton } from './storeToggler/components/setter/resolveButton';
import { jobRow } from './storeConnected/jobTable/component/jobRow';
import { mapRoute, mapRouteList } from './storeConnected/routeMap/routeMap';
import { jobSetter } from './storeToggler/components/setter/jobSetter';
import { dropdown, dropdownButton, dropdownContent } from './dropDown';
import { jobbersList } from './storeConnected/jobbersList';
import { deleteJobberButton } from './storeToggler/components/deleter/deleteJobber';
import {  jobberAdd } from './storeToggler/components/adder/JobberAdd';
import { originSetter } from './storeToggler/components/setter/originSetter';
import { originStartDateSetter } from './storeToggler/components/setter/originStartDateSetter';
import { originEndDateSetter } from './storeToggler/components/setter/originEndDateSetter';
import { fleetAddressComponent } from './storeConnected/fleetAddressComponent';
import { startDateComponent } from './storeConnected/startDateComponent';
import { endDateComponent } from './storeConnected/endDateComponent';
import { fleetMap } from './storeConnected/fleetMap/component/fleetMap';
import { tabControl, tabLabel, tabPanel } from './tabPanel/components/tabPanel';
import { contentTogglerButton } from './actionButtons/components/contentTogglerButton';
import { pointedjobsListComponent } from './storeConnected/jobsStoreComponents/jobsListComponent';
import { pointedJobComponent } from './storeConnected/jobsStoreComponents/jobComponent';
import { jobAttributeComponent } from './storeConnected/jobsStoreComponents/jobAttributeComponent';
import { googleMapComponent, googleMapLoader } from './googleMapComponent/components/googleMapComponent';
import { pointedVehicleNumberComponent } from './storeConnected/fleetStoreComponents/vehicleNumberComponent';


customElements.define('autocomplete-input', addressAutofill, {
    extends: 'input'})
customElements.define('job-table', jobTable)
customElements.define('job-row', jobRow, {
    extends: 'tr'})
customElements.define('resolve-button', resolveButton)
customElements.define('test-resolve-button', testResolveButton)


customElements.define('map-route-list', mapRouteList)
customElements.define('map-route', mapRoute)

customElements.define('fleet-map', fleetMap)

customElements.define('job-setter', jobSetter, {
    extends: 'form'})

customElements.define('dropdown-wrapper', dropdown)
customElements.define('dropdown-button', dropdownButton, {
    extends: 'button'})
customElements.define('dropdown-content', dropdownContent)

customElements.define('tab-control', tabControl)
customElements.define('tab-label', tabLabel)
customElements.define('tab-panel', tabPanel)

customElements.define('action-button', contentTogglerButton, {
    extends: 'button'})
    
customElements.define('jobbers-list', jobbersList, {
    extends: 'ul'})

customElements.define('jobber-delete', deleteJobberButton, {
    extends: 'button'})

customElements.define('jobber-add', jobberAdd, {
    extends: 'form'} )

customElements.define('origin-setter', originSetter, {
    extends: 'form'})

customElements.define('origin-start-date-setter', originStartDateSetter, {
    extends: 'form'})
customElements.define('origin-end-date-setter', originEndDateSetter, {
    extends: 'form'})

customElements.define('origin-address', fleetAddressComponent)
customElements.define('origin-start-date', startDateComponent)
customElements.define('origin-end-date', endDateComponent)


customElements.define('vehicle-number', pointedVehicleNumberComponent)
customElements.define('job-list', pointedjobsListComponent)
customElements.define('job-component', pointedJobComponent)
customElements.define('job-attribute-component', jobAttributeComponent)


/* TEST */
customElements.define('test-google-map-loader', googleMapLoader)
customElements.define('test-google-map-component', googleMapComponent)