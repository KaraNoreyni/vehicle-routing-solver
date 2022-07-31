import { Status, Wrapper } from "@googlemaps/react-wrapper";
import logo from './logo.svg';
import { Provider } from "react-redux";
import { Store } from "./reducer";
import './css/index.css'
import './notReactComponent/index'
const jobs = Store.getState().jobs.slice(1)
const fleet = Store.getState().fleet
const shift = fleet.vehicles[0].shifts[0];
const jobbers = fleet.vehicles[0].vehicleIds;

const startDate = new Date(shift.start.earliest)
const endDate = new Date(shift.end.latest)
const dateOptions = { weekday: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' }
const datesString = [
  new Intl.DateTimeFormat(
    "fr-FR", dateOptions).format(startDate),
  new Intl.DateTimeFormat(
    "fr-FR", dateOptions).format(endDate)
]

const render = (status = Status) => {
  return <h1>{status}</h1>;
};
function App() {
  return (<div class={'coral--light'}>

    <Wrapper apiKey={"AIzaSyCC-wNU3s8EZpAIP0Rdbp7M1w_9nriMeok"} render={render} libraries={["places"]}>
        <div style={{
          overflow: "hidden",
        }}>
          <header class="flex space-b">
            LOGO
            <tab-control
                 for="main-content"
                 class={'flex'}>
                  <tab-label content="maps">maps</tab-label>
                  <tab-label content="table">table</tab-label>
                </tab-control>
            <button 
              is='action-button'
              for='nav-content'>Menu</button>
          </header>

          <div className="flex">
            <div 
              style={{
                width:"100%"
              }}
              id="main-content">
              <tab-panel content="maps" show="">
                <fleet-map></fleet-map>
              </tab-panel>
              <tab-panel content="table">
                <job-table></job-table>
              </tab-panel>
            </div>
              
            <section>
              <div
                id="nav-content"
                class={'container'}>
                <tab-control
                 for="nav-content"
                 class={'flex'}>
                  <tab-label content="jobs">jobs</tab-label>
                  <tab-label content="addJob">addJob</tab-label>
                  <tab-label content="fleet">fleet</tab-label>
                </tab-control>
                <tab-panel content='jobs'>
                  <h4 class={'title'}>Livraisons</h4>
                  <hr class={'hr'} />
                  <job-list 
                    storeAttributeKeys='jobs,slice 1'
                    style={{display: 'block'}}>

                  </job-list>
                </tab-panel>
                <tab-panel content='addJob'>
                  <h4 className='title'>Ajouter une livraison</h4>
                  <hr className='hr' />
                  <form
                    is='job-setter'
                    className='flex column'
                    id='jobSetter'>
                    <div
                      className='content inputContainer'>
                      <label
                        htmlFor='jobSetterAddress'
                      >adresse de livraison</label>
                      <input
                        is='autocomplete-input'
                        name='addressInput'
                        autocomplete={"street-address"}
                        id='jobSetterAddress' />
                    </div>
                    <h5
                      className='title'>Plage horaire</h5>
                    <div
                      className='content inputContainer'>
                      <label
                        htmlFor='jobSetterScheduleStart'
                        className='scheduleLabel' >début</label>
                      <input
                        name='startDateInput'
                        id='jobSetterScheduleStart'
                        className='content'
                        type='datetime-local' />
                    </div>
                    <div
                      className='content inputContainer'>
                      <label
                        htmlFor='jobSetterScheduleEnd'
                        className='scheduleLabel'>fin</label>
                      <input
                        name='endDateInput'
                        id='jobSetterScheduleEnd'
                        className='content'
                        type='datetime-local' />
                    </div>
                    <input
                      type='submit'
                      value='ajouter'
                      className='toggleButton' />
                  </form>
                </tab-panel>
                <tab-panel content='fleet'>
                  <h4 className='title'>DEPOT</h4>
                  <hr className='hr' />
                  <ul>
                    <li className='list-item'>
                      <div
                        className='flex space-b'>
                        <p
                          className='component'>
                          <strong>Nombre de livreur</strong>
                          ${jobbers.length}
                        </p>
                        <dropdown-wrapper>
                          <button is='dropdown-button'>...</button>
                          <dropdown-content className='fill container'>
                            <ul is='jobbers-list'>
                              {jobbers.map(jobber => {
                                return (
                                  <li className='list-item'>
                                    <div
                                      className='flex space-b'>
                                      <span
                                        className='component'>{jobber}</span>
                                      <button
                                        is='jobber-delete'
                                        className='component end deleteButton'
                                        jobber={jobber}>supprimer</button>
                                    </div>
                                  </li>)
                              })}
                            </ul>
                          </dropdown-content>
                        </dropdown-wrapper>
                        <dropdown-wrapper>
                          <button is='dropdown-button'>+</button>
                          <dropdown-content className='fill container'>
                            <form
                              is='jobber-add'
                              id="addJobber"
                              className='width-maxCont'>
                              <label
                                htmlFor="addJobberInput">Ajouter un livreur</label>
                              <input
                                type="text"
                                id="addJobberInput"
                                name='jobberName' />
                              <input
                                type="submit"
                                value="ajouter" />
                            </form>
                          </dropdown-content>
                        </dropdown-wrapper>
                      </div>
                    </li>
                    <li className='list-item'>
                      <div className='flex space-b'>
                        <p className='component'><strong>adresse </strong>
                          <br />
                          <origin-address>
                            {Store.getState().jobs[0].id}
                          </origin-address>
                        </p>
                        <dropdown-wrapper>
                          <button is='dropdown-button'>...</button>
                          <dropdown-content
                            className='container fill'>
                            <form
                              is='origin-setter'
                              className='width-maxCont'>
                              <label
                                for={'shiftAddressInput'}>Modifier l'address du dépot</label>
                              <input
                                is='autocomplete-input'
                                name='address'
                                id='shiftAddressInput'
                                autocomplete={"street-address"}/>
                              <input
                                type='submit'
                                value='modifier' />
                            </form>
                          </dropdown-content>
                        </dropdown-wrapper>
                      </div>
                    </li>
                    <li className='list-item'>
                      <div className='flex space-b'>
                        <p className='component'><strong>debut </strong>
                          <br />
                          <origin-start-date>
                            ${datesString[0]}
                          </origin-start-date>
                        </p>
                        <dropdown-wrapper>
                          <button is='dropdown-button'>...</button>
                          <dropdown-content
                            className='container fill'>
                            <form
                              is='origin-start-date-setter'
                              className='width-maxCont'>
                              <label
                                htmlFor='shiftStartDateInput'>Modifier l'heure de début de shift</label>
                              <input
                                name='startDate'
                                id='shiftStartDateInput'
                                type='datetime-local' />
                              <input
                                type='submit'
                                value='modifier' />
                            </form>
                          </dropdown-content>
                        </dropdown-wrapper>
                      </div>
                    </li>
                    <li className='list-item'>
                      <div className='flex space-b'>
                        <p className='component'><strong>fin </strong>
                          <br />
                          <origin-end-date>
                            ${datesString[1]}
                          </origin-end-date>
                        </p>
                        <dropdown-wrapper>
                          <button is='dropdown-button'>...</button>
                          <dropdown-content
                            className='container fill'>
                            <form
                              is='origin-end-date-setter'
                              className='width-maxCont'>
                              <label
                                htmlFor='shiftEndDateInput'>Modifier l'heure de fin de shift</label>
                              <input
                                name='endDate'
                                id='shiftEndDateInput'
                                type='datetime-local' />
                              <input
                                type='submit'
                                value='modifier' />
                            </form>
                          </dropdown-content>
                        </dropdown-wrapper>
                      </div>
                    </li>
                  </ul>
                </tab-panel>
              </div>
            </section>
          </div>

        </div>
      <map-route-list></map-route-list>
    </Wrapper>
  </div>



  );
}

export default App;
