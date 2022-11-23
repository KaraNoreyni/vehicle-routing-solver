import { awaitMatrixAndResolveProblem } from "../../../../actions";
import { Store } from "../../../../reducer";
import { setTestFleet } from "../../../../reducer/fleetReducer";
import { setTestJobs } from "../../../../reducer/jobsReducer";
import { setMapRoute } from "../../../../reducer/mapRouteReducer";
import { setRoutes } from "../../../../reducer/routeReducer";
import plan from '../../../../test/plan'



export class resolveButton extends HTMLElement {
    constructor () {
        super()
        this.button = document.createElement('button')
        this.button.textContent = "Optimiser vos tournées"
    }
    connectedCallback() {

        this.appendChild(this.button)
        this.button.onclick = (e) => {
            resolve()
        }
    }
}
const resolve = async function () {
    const state = Store.getState();
    const dispatch = Store.dispatch;
    const jobs = state.jobs;
    const fleet = state.fleet;

    const solution = await awaitMatrixAndResolveProblem(jobs, fleet);
    const routeMaps = JSON.parse(solution).tours.map((route, idx) => {
        return {
          id: idx, 
          center: {
              lat: 45.7756392,
              lng: 4.8037335,
          },
          zoom: 17,
          style: {
              width: 350 + 'px', 
              height: 350 + 'px'
          },
          route: route,
          ref: null,
        }
      })
    dispatch(setMapRoute(routeMaps))
    dispatch(setRoutes(JSON.parse(solution)))
}

export class testResolveButton extends HTMLElement {
    constructor () {
        super()
        this.testPlan = plan
        this.button = document.createElement('button')
        this.button.textContent = "Optimiser vos tournées"
    }
    connectedCallback() {

        this.appendChild(this.button)
        this.button.onclick = (e) => {
            testResolve(this.testPlan.plan.jobs, this.testPlan.fleet)
        }
    }
}
const testResolve = async function (testJobs, testFleet) {

    const dispatch = Store.dispatch;
    dispatch(setTestFleet(testFleet))
    dispatch(setTestJobs(testJobs))
    const state = Store.getState();
    const jobs = state.jobs;
    const fleet = state.fleet;

    const solution = await awaitMatrixAndResolveProblem(jobs, fleet);
    const routeMaps = JSON.parse(solution).tours.map((route, idx) => {
        return {
          id: idx, 
          center: {
              lat: 45.7756392,
              lng: 4.8037335,
          },
          zoom: 17,
          style: {
              width: 350 + 'px', 
              height: 350 + 'px'
          },
          route: route,
          ref: null,
        }
      })
    dispatch(setMapRoute(routeMaps))
    dispatch(setRoutes(JSON.parse(solution)))
}