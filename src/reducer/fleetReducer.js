import { createSlice } from "@reduxjs/toolkit"
import { mapSlice } from "./mapReducer"

export const fleetSlice = createSlice({
    name: "fleet",
    initialState: {
        "vehicles": [
            {
                "typeId": "vehicle",
                "vehicleIds": [
                    "jober1",
                    "jober2",
                    "jober3",
                ],
                "profile": {
                    "matrix": "normal_car"
                },
                "costs": {
                    "fixed": 22,
                    "distance": 0.0002,
                    "time": 0.004806
                },
                "shifts": [
                    {
                        "start": {
                            "earliest": "2022-07-10T09:00:00.000Z",
                            "location": {
                                "index": 0
                            }
                        },
                        "end": {
                            "latest": "2022-07-10T19:30:00.000Z",
                            "location": {
                                "index": 0
                            }
                        }
                    }
                ],
                "capacity": [
                    5
                ]
            }
        ],
        "profiles": [
            {
                "name": "normal_car"
            }
        ]
    },
    reducers: {
        addVehicle: (state, action) => {
            state.vehicles.vehicleIds.push(action.payload)
        },
        setShift: (state, action) => {
            state.vehicles[0].shifts[0] = action.payload
            return state
        },
        addJobber: (state, action) => {
            state.vehicles[0].vehicleIds.push(action.payload)
        },
        deleteJobber: (state, action) => {
            state.vehicles[0].vehicleIds = state.vehicles[0].vehicleIds.filter((id) => id !== action.payload)
            return state
        },
        setShiftStartDate: (state, action) => {
            state.vehicles[0].shifts[0].start.earliest = action.payload;
            return state
        },
        setShiftEndDate: (state, action) => {
            state.vehicles[0].shifts[0].end.latest = action.payload;
            return state
        },
    }
})

export const { addVehicle, setShift, addJobber, deleteJobber, setShiftStartDate, setShiftEndDate } = fleetSlice.actions