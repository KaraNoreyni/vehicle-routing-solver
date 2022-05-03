import { configureStore, createSlice } from "@reduxjs/toolkit";
import { fleetSlice } from "./fleetReducer";
import { jobSlice } from "./jobsReducer";
import { mapSlice } from "./mapReducer";
import { matrixSlice } from "./matrixReducer";

export const Store = configureStore({
    reducer: {
        jobs: jobSlice.reducer,
        map: mapSlice.reducer, 
        fleet: fleetSlice.reducer,
        matrix: matrixSlice.reducer,
    }}
)