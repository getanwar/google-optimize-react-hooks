import { useReducer, useEffect, useState } from "react";
import loadingReducer from "./loading-reducer";

/**
 * Google Optimize Hook
 * @param {String} experimentID
 * @returns {Array} [loadingState, variant]
 */
export default function useGoogleOptimize(experimentID) {
    const [variant, setVariant] = useState(null);
    const [loading, dispatch] = useReducer(loadingReducer, true);
    const updateVariant = (value, name) => {
        console.log("Experiment with ID: " + name + " is on variant: " + value);
        setVariant(value === undefined || value === null ? "0" : value);
    };

    useEffect(() => {
        dispatch({ type: "LOAD_GO" });
        const { dataLayer } = window;

        // will be called once google optimize initialized
        const delayedInitialization = () => {
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
        };

        if (dataLayer) {
            // delayedInitialization will be called once Google Optimize is initialized or timeout
            const hideEnd = dataLayer && dataLayer.hide && dataLayer.hide.end;

            if (hideEnd) {
                dataLayer.hide.end = () => {
                    delayedInitialization();
                    hideEnd();
                };
            } else {
                delayedInitialization();
            }

            // Activating the experiment
            dataLayer.push("event", "optimize.callback", {
                name: experimentID,
                callback: updateVariant
            });
        }

        // Deactivating the event when component is unmounted
        return () => {
            dataLayer.push("event", "optimize.callback", {
                name: experimentID,
                callback: updateVariant,
                remove: true
            });
        };
    }, [experimentID]);

    return [loading, variant];
}
