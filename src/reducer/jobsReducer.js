import { createSlice } from "@reduxjs/toolkit"

export const jobSlice = createSlice({
    name: "jobs",
    initialState: [
        {   
            id: "40 Rue Marietton, 69009 Lyon",
            deliveries: [
                {
                    places: [
                        {
                            location: {
                                index: 0,
                                lat : 45.7756392,
                                lng : 4.8037335
                            },
                            duration: 300,
                            times: [
                                [
                                    "2022-05-03T08:00:00Z",
                                    "2022-05-03T18:00:00Z"
                                ]
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    reducers: {
        addJob: (state, action) => {
            state.push(action.payload)
        },
    }
})

export const { addJob } = jobSlice.actions