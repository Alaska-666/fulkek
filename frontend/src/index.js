import React from 'react'
import ReactDOM from 'react-dom'
import App from "./components/App";
import {BrowserRouter as Router} from 'react-router-dom'
import {createStore} from "redux";
import {Provider} from 'react-redux'
import reducer from './reducers'

const store = createStore(
    reducer
)

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <App />
        </Router>
    </Provider>,
    document.getElementById("react")
);