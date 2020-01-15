import React from 'react'
import {connect} from "react-redux";
import {login, ACCESS_TOKEN, signUp} from "../../util/APIutils";
import {notification} from "antd";
import "../../styles/page_1/index.css"

class Login extends React.Component {
    constructor(props) {
        super(props);
    }

    signIn(event) {
        event.preventDefault();
        login(this.props.login, this.props.password).then(response => {
            localStorage.setItem(ACCESS_TOKEN, response.token);
            this.props.doLogin(this.props.login);
            notification.success({
                message: "Вход",
                description: "Привет) ты на сайте))"
            })
        }).catch(e => {
            notification.error({
                message: "Вход",
                description: "Что-то пошло не таккк((("
            });
            console.warn(e);
        })

    }

    signUp(event) {
        event.preventDefault();
        signUp(this.props.login, this.props.password).then(response => {
            localStorage.setItem(ACCESS_TOKEN, response.token);
            this.props.doLogin(this.props.login);
            notification.success({
                message: "Регистрация",
                description: "Зарегестрировали тебя и впустили)))"
            })
        }).catch(e => {
            notification.error({
                message: "Регистрация",
                description: "Что-то пошло не так(: " + e.username
            })
            console.warn(e);
        });

    }

    render() {
        return (
            <form id="base">
                <div id="u3" className="ax_default" data-left="262" data-top="216" data-width="500" data-height="378">
                    <div id="u4" className="ax_default box_3">
                        <div id="u4_div" className=""></div>
                        <div id="u4_text" className="text " style={{display:'none', visibility: 'hidden'}}>
                            <p></p>
                        </div>
                    </div>
                </div>
                <div id="u5" className="ax_default text_field">
                    <div id="u5_div" className=""></div>
                    <input id="u5_input" type="text" className="u5_input" placeholder="Твое имя?" onChange={(event) => this.props.setLogin(event.target.value)}/>
                </div>
                <div id="u6" className="ax_default" data-left="290" data-top="424" data-width="444" data-height="50">
                    <div id="u7" className="ax_default text_field">
                        <div id="u7_div" className=""></div>
                        <input id="u7_input" type="password" className="u7_input" placeholder="Твой пароль<3" onChange={(event) => this.props.setPassword(event.target.value)}/>
                    </div>
                </div>
                <div id="u8" className="ax_default primary_button">
                    <button id="u8_text" className="text " onClick={(e) => this.signIn(e)}>ВХОООД!!</button>
                </div>
                <div id="u9" className="ax_default primary_button">
                    <button id="u9_text" className="text " onClick={(e) => this.signUp(e)}>РЕГИСТРАЦИЯ</button>
                </div>
            </form>
        )
    }
}

function mapToStateProps(state) {
    const {basicReducer} = state;
    return {
        login: basicReducer.login,
        password: basicReducer.password,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setPassword: (pass) => dispatch({type: "PASSWORD", payload: pass}),
        setLogin: (login) => dispatch({type: "RAWLOGIN", payload: login}),
        doLogin: (login) => dispatch({type: "LOGIN", payload: login}),
    }
}

export default connect(mapToStateProps, mapDispatchToProps)(Login);