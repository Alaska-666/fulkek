const initialState = {
    currentQuestion: 0,
    test: null,
    loading: true,
    error: null,
    stat: "",
    selected: -1,
}

const testReducer = (state=initialState, action) => {
    switch (action.type) {
        case "NEXT":
            return {
                ...state,
                selected: -1,
                currentQuestion: state.currentQuestion + 1,
            };
        case "SET_QUESTION":
            return {
                ...state,
                currentQuestion: action.payload.current,
                stat: action.payload.statistics,
                loading: false,
            };
        case "SET_SESSION":
            return {
                ...state,
                stat: action.payload,
            };
        case "SET_TEST":
            return {
                ...state,
                test: action.payload,
                loading: false,
            };
        case "ERROR":
            return {
                ...state,
                error: action.payload,
                loading: false,
            };
        case "START":
            return {
                ...state,
                loading: true,
            };
        case "SELECT":
            return {
                ...state,
                selected: action.payload,
            };
        case "CLEAR":
            return initialState;
        default:
            return state
    }

}

export default testReducer;