import { useEffect, useState, useReducer } from "react";
import loadingReducer from "./loading-reducer";

/**
 * Google Optimize Hook
 * @param {String} experimentID
 * @param {String} customEventName
 * @returns {Array} [loadingState, variant]
 */
export default function useGoogleOptimizeSPA(experimentID, customEventName) {
    const [variant, setVariant] = useState(null);
    const [loading, dispatch] = useReducer(loadingReducer, true);

    useEffect(() => {
        dispatch({ type: "LOAD_GO" });
        const { dataLayer } = window;
        const intervalMS = 100;
        const maxWait = 100; // not ms; interval count
        let currentWait = 0;
        let intervalId = setInterval(() => {
            if (window.google_optimize !== undefined) {
                const value = window.google_optimize.get(experimentID);
                setVariant(value);
                clearInterval(intervalId);
                dispatch({ type: "LOAD_GO_SUCCESS" });
            }

            if (currentWait >= maxWait) {
                dispatch({ type: "LOAD_GO_FAILURE" });
                clearInterval(intervalId);
            } else {
                currentWait++;
            }
        }, intervalMS);

        dataLayer && dataLayer.push({ event: customEventName });
    }, [experimentID]);

    return [loading, variant];
}
