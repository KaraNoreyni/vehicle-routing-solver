import { createSlice } from "@reduxjs/toolkit"
export const fleetMapSlice = createSlice({
    name: "fleetMap",
    initialState: {},
    reducers: {
        setFleetMap: (state, action) => {
            state = action.payload;
            return state
        }
    }
})

export const { setFleetMap } = fleetMapSlice.actions 