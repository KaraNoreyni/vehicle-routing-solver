import { createSlice } from "@reduxjs/toolkit"
export const mapRouteSlice = createSlice({
    name: "mapRoute",
    initialState: [
    ],
    reducers: {
        setMapRoute: (state, action) => {
            state = action.payload
            return state
        }
    }
})

export const { setMapRoute } = mapRouteSlice.actions