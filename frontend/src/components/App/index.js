import React from 'react'

import Login from '../Login'
import Main from '../Main'
import Test from '../Test'

import {connect} from "react-redux";

import {notification} from "antd";



import {
    Route,
    withRouter,
    Switch
} from 'react-router-dom';
import {getUser} from "../../util/APIutils";


class App extends React.Component {
    constructor(props) {
        super(props);
        notification.config({
            placement: "topRight",
            top: 70,
            duration: 3,
        })
    }

    componentDidMount() {
        //load user via provided token
        this.props.setLoading();
        getUser().then(result => this.props.setLogin(result.username)).catch(e => this.props.setFail(e))
    }

    render() {
        if (this.props.loading) {
            return <p>Загрузочка))))...</p>
        }

        const form = this.props.logged_in ? Main : Login;

        return (
            <Switch>
                <Route path='/test/:name' component={Test}/>
                <Route path='/' component={form}/>
            </Switch>
        )
    }
}


function mapToStateProps(state) {
    const {basicReducer} = state;
    return {
        logged_in: basicReducer.logged_in,
        loading: basicReducer.loading,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setLogin: (login) => dispatch({type: "LOGIN", payload: login}),
        setFail: (error) => dispatch({type: "FAIL", payload: error}),
        setLoading: () => dispatch({type: "LOADING"})
    }

}

export default withRouter(connect(mapToStateProps, mapDispatchToProps)(App));