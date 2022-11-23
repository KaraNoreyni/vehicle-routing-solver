import { createSlice } from "@reduxjs/toolkit"
export const mapSlice = createSlice({
    name: "map",
    initialState: [
        {
            id: 1, 
            center: {
                lat: 45.7756392,
                lng: 4.8037335,
            },
            zoom: 25,
            style: {
                width: 350 + 'px', 
                height: 350 + 'px'
            },
            ref: null
        },
    ],
    reducers: {
        addMap: (state) => {
            const map = {
                id: state[state.length - 1].id + 1, 
                center: {
                    lat: 45.7756392,
                    lng: 4.8037335,
                },
                zoom: 12,

                style: {
                    width: 350 + 'px', 
                    height: 350 + 'px'
                },
                ref: null,
            };
            state.push(map)
        }
    }
})

export const { addMap } = mapSlice.actions