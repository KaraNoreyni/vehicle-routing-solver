import { createSlice } from "@reduxjs/toolkit"

export const jobSlice = createSlice({
    name: "jobs",
    initialState: [
        {
            "id": "40 Rue Marietton, 69009 Lyon",
            "deliveries": [
                {
                    "places": [
                        {
                            "location": {
                                "index": 0,
                                "lat": 45.7756392,
                                "lng": 4.8037335
                            },
                            "duration": 300,
                            "times": [
                                [
                                    "2022-05-03T08:00:00Z",
                                    "2022-05-03T18:00:00Z"
                                ]
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "id": "40 rue marietton 69009",
            "deliveries": [
                {
                    "places": [
                        {
                            "location": {
                                "index": 1,
                                "lat": 45.7756392,
                                "lng": 4.8037335
                            },
                            "duration": 300,
                            "times": [
                                [
                                    "2022-07-10T09:00:00.000Z",
                                    "2022-07-10T09:30:00.000Z"
                                ]
                            ]
                        }
                    ],
                    "demand": [
                        1
                    ]
                }
            ]
        },
        {
            "id": "11 rue d'ivry 69004",
            "deliveries": [
                {
                    "places": [
                        {
                            "location": {
                                "index": 2,
                                "lat": 45.7773095,
                                "lng": 4.8336913
                            },
                            "duration": 300,
                            "times": [
                                [
                                    "2022-07-10T09:00:00.000Z",
                                    "2022-07-10T09:30:00.000Z"
                                ]
                            ]
                        }
                    ],
                    "demand": [
                        1
                    ]
                }
            ]
        }
    ],
    reducers: {
        setTestJobs: (state, action) => {
            state = action.payload
            return state
        },
        addJob: (state, action) => {
            state.push(action.payload);
        },
        deleteJob: (state, action) => {
            const jobIndex = action.payload.deliveries[0].places[0].location.index
            console.log(jobIndex)
            state.splice(jobIndex, 1)
            state.forEach(job => {
                if (job.deliveries[0].places[0].location.index > jobIndex) {
                    job.deliveries[0].places[0].location.index -=1
                }
            })
            return state
        },
        editJob: (state, action) => {
            const job = state[action.payload.jobIndex]

            job.deliveries[0].places[0].times[0] = action.payload.schedule
            job.id = action.payload.address
            job.deliveries[0].places[0].location = action.payload.location
            
            state[action.payload.jobIndex] = job
            return state
        },
        editJobSchedule: (state, action) => {
            const jobIndex = action.payload.jobIndex
            const job = state[jobIndex]
            job.deliveries[0].places[0].times[0] = action.payload.schedule
            state[jobIndex] = job
            return state
        },
        
        editJobAddress: (state, action) => {
            const jobIndex = action.payload.jobIndex
            const job = state[jobIndex]
            job.id = action.payload.address
            job.deliveries[0].places[0].location.lat = action.payload.location.lat
            job.deliveries[0].places[0].location.lng = action.payload.location.lng
            state[jobIndex] = job
            return state
        },
        setRouteOrigin: (state, action) => {
            state[0] = action.payload
            return state
        },
        setRouteOriginstartDates: (state, action) => {
            state[0].deliveries[0].places[0].times[0][0] = action.payload;
            return state
        },
        setRouteOriginendDates: (state, action) => {
            state[0].deliveries[0].places[0].times[0][1] = action.payload;
            return state
        }
    }
})

export const { setTestJobs, addJob, deleteJob, editJob, editJobAddress, editJobSchedule, setRouteOrigin, setRouteOriginstartDates, setRouteOriginendDates } = jobSlice.actions