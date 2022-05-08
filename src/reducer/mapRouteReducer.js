import { createSlice } from "@reduxjs/toolkit";
import { createRef } from "react";


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