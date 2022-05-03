import { createSlice } from "@reduxjs/toolkit";

export const matrixSlice = createSlice({
    name: "matrix",
    initialState: null,
    reducer: {
        addMatrix: (state, action) => {
            state = action.payload;
            return state
        }
    }
})

export const { addMatrix } = matrixSlice.actions