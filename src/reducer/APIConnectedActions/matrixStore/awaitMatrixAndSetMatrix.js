import { getMatrix } from "../../../actions/getMatrix"
import { Store } from "../.."
import { setMatrix } from "../../matrixReducer"

export const awaitMatrixAndSetMatrix = async function(waypoints, matrixName) {
    const matrix = await getMatrix(waypoints)
    return Store.dispatch(setMatrix(
        formatMatrixForStore(matrix, matrixName)))
}

export const formatMatrixForStore = function(matrix, matrixName) {
    return [{
        "matrix": matrixName,
        "travelTimes": matrix.durations.flat().map(
            x => Math.floor(x)),
        "distances": matrix.distances.flat().map(
            x => Math.floor(x))
    }]
}
