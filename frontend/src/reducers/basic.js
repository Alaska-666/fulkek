const initialState = {
    login: "",
    password: "",
    logged_in: false,
    loading: true,
    error: null,
    tests: null,
    stats: null,
    loadingTests: true,
    loadingStat: true,
    showTests: true,
}


const basicReducer = (state=initialState, action) => {
    switch (action.type) {
        case "LOGIN":
            return {
                ...state,
                login: action.payload,
                logged_in: true,
                loading: false,
            };
        case "RAWLOGIN":
            return {
                ...state,
                login: action.payload,
            };
        case "PASSWORD":
            return {
                ...state,
                password: action.payload,
            };
        case "LOGOUT":
            return {
                ...state,
                logged_in: false,
            };
        case "LOADING":
            return {
                ...state,
                loading: true,
            };
        case "FAIL":
            return {
                ...state,
                error: action.payload,
                loading: false,
            };
        case "LOAD_TESTS":
            return {
                ...state,
                loadingTests: false,
                tests : action.payload,
            };
        case "LOADING_TESTS":
            return {
                ...state,
                loadingTests: true,
            };
        case "FAIL_TESTS":
            return {
                ...state,
                error: action.payload,
                loadingTests: false,
            };
        case "SWITCH_TESTS":
            return {
                ...state,
                showTests: true,
            };
        case "SWITCH_STATS":
            return {
                ...state,
                showTests: false,
            };
        case "LOAD_STAT":
            return {
                ...state,
                loadingStat: false,
                stats : action.payload,
            };
        case "LOADING_STAT":
            return {
                ...state,
                loadingStat: true,
            };
        case "FAIL_STAT":
            return {
                ...state,
                error: action.payload,
                loadingStat: false,
            };
        case "CLEAR":
            return {
                ...state,
                stats: null,
            };
        default:
            return state

    }
}

export default basicReducer;