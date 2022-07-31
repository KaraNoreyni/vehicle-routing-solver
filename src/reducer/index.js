import { configureStore, createSlice } from "@reduxjs/toolkit";
import { fleetSlice } from "./fleetReducer";
import { fleetMapSlice } from "./fleetMapReducer";
import { jobSlice } from "./jobsReducer";
import { mapSlice } from "./mapReducer";
import { mapRouteSlice } from "./mapRouteReducer";
import { matrixSlice } from "./matrixReducer";
import { routesSlice } from "./routeReducer";

export const Store = configureStore({
    reducer: {
        jobs: jobSlice.reducer,
        map: mapSlice.reducer, 
        fleet: fleetSlice.reducer,
        matrix: matrixSlice.reducer,
        routes: routesSlice.reducer,
        mapRoute: mapRouteSlice.reducer,
        fleetMap: fleetMapSlice.reducer,  
    },
}
)