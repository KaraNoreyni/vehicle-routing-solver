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
                            "earliest": "2022-05-05T08:00:00Z",
                            "location": {
                                "index": 0
                            }
                        },
                        "end": {
                            "latest": "2022-05-05T18:00:00Z",
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
    }
})

export const { addVehicle } = mapSlice.actions