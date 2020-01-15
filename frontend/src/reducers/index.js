import {combineReducers} from "redux";

import basicReducer from './basic'
import testReducer from "./test"

const rootReducer = combineReducers({
    basicReducer,
    testReducer,
});

export default rootReducer;