export default function loadingReducer(state, action) {
    if (!action.type) return state;
    switch (action.type) {
        case "LOAD_GO":
            return true;

        case "LOAD_GO_SUCCESS":
        case "LOAD_GO_FAILURE":
            return false;

        default:
            return state;
    }
}
