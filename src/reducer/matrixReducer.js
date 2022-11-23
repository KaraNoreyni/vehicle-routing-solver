import { createSlice } from "@reduxjs/toolkit"
export const matrixSlice = createSlice({
    name: "matrix",
    initialState: null,
    reducer: {
        setMatrix: (state, action) => {
            state = action.payload;
            return state
        }
    }
})

export const { setMatrix } = matrixSlice.actions