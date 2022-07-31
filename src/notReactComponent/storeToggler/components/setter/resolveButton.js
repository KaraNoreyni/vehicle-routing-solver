import { createRef } from "react";
import { awaitMatrixAndResolveProblem } from "../../../../actions";
import { Store } from "../../../../reducer";
import { setMapRoute } from "../../../../reducer/mapRouteReducer";
import { setRoutes } from "../../../../reducer/routeReducer";

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
          ref: createRef(),
        }
      })
    dispatch(setMapRoute(routeMaps))
    dispatch(setRoutes(JSON.parse(solution)))
}