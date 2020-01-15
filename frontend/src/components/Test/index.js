import React from 'react'

import "../../styles/page_3/styles.css"

import {withRouter} from "react-router-dom"
import {connect} from "react-redux";
import {getStat, getTest, postStat} from "../../util/APIutils";
import {notification} from "antd";
import testReducer from "../../reducers/test";


class Test extends React.Component {
    constructor(props) {
        super(props);
        this.testName = this.props.match.params.name;
    }

    onExit(event) {
        event.preventDefault();
        this.props.history.push("/");
        postStat(JSON.stringify({
            test: this.testName,
            current: this.props.current,
            status: this.props.current === this.props.test.items.length ? "done" : "running",
            statistics: this.props.stat,
        })).then(() => {
            notification.success({
                message: "Выход",
                description: "Сохранили твои результатики))))",
            });
            this.props.clear();
        }).catch((e) => {
            notification.error({
                message: "Выход",
                description: "Не удалось сохранить результат! прости(",
            });
            console.warn(e)
        });
    }

    onNext(event) {
        event.preventDefault();
        const data = this.props.stat.split("|").map(a => parseInt(a));
        console.log(data);
        data[this.props.selected] += 1;
        this.props.setSession(data.join("|"));
        this.props.setNext();
    }

    onSelect(event) {
        console.log(event.target.value);
        this.props.setSelect(event.target.value);
    }

    componentDidMount() {
        getTest(this.testName).then(json => this.props.setTest(json)).catch((e) => {console.warn(e); this.props.setError(e);}).then(
            () => {
                getStat().then(json => {
                const sessions = json.filter(session => session.status==="running" && session.test === this.testName);
                if (sessions.length) {
                    this.props.setCurrent(sessions[0]);
                } else {
                    this.props.setSession(this.props.test.answers.split("|").map(_ => "0").join("|"));
                }
            }).catch((e) => {console.warn(e); this.props.setError(e);})
            }
        )
    }

    render() {
        let next = "ДАЛЕЕ";
        let questions = "Грузится...";
        let done = false;
        if (this.props.test) {
            if (this.props.test.items.length -1 === this.props.current) next = "ЗАВЕРШИТЬ";
            if (this.props.test.items.length  === this.props.current) {
                done = true;
                const values = this.props.stat.split("|").map((e) => parseInt(e));
                const ans = this.props.test.answers.split("|")[values.indexOf(Math.max(...values))];
                questions = <div>
                    <h1 style={{color: "cornflowerblue"}}>Поздравляю! Вы прошли тест {this.props.test.name}!!!!</h1>
                    <h2 style={{color: "cornflowerblue"}}>Вы - {ans}</h2>
                </div>
            } else {
                const question = this.props.test.items[this.props.current];
                const variants = question.variants.split("|");
                questions = <div>
                    <h1 style={{color: "cornflowerblue"}}>{question.text}</h1>
                    <div onChange={e => this.onSelect(e)}>
                        {variants.map((variant, key) => <p key={variant}><input
                            key={variant} type="radio" value={key} name="questions"
                            defaultChecked={this.props.selected === key}/>{variant}</p>)}
                    </div>
                </div>
            }
        }
        return (
            <div id="base" className="">

                <div id="u14" className="ax_default box_3">
                    <div id="u14_div" className=""></div>
                    <div id="u14_text" className="text " >
                        {questions}
                    </div>
                </div>

                <div id="u15" className="ax_default primary_button disabled">
                    <button id="u15_text" className="text " onClick={(e) => this.onExit(e)}>ВЫХОД</button>
                </div>

                <div id="u16" className="ax_default primary_button">
                    <button id="u16_text" className="text " onClick={(e) => this.onNext(e)} disabled={done}>{next}</button>
                </div>
            </div>
        )
    }
}

function mapToStateProps(state) {
    const {testReducer} = state;
    return {
        loading: testReducer.loading,
        error: testReducer.error,
        test: testReducer.test,
        current: testReducer.currentQuestion,
        stat: testReducer.stat,
        selected: testReducer.selected,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setTest: (test) => dispatch({type: "SET_TEST", payload: test}),
        setCurrent: (current) => dispatch({type: "SET_QUESTION", payload: current}),
        setSession: (session) => dispatch({type: "SET_SESSION", payload: session}),
        setLoad: () => dispatch({type: "START"}),
        setError: (err) => dispatch({type: "ERROR", payload: err}),
        setNext: () => dispatch({type: "NEXT"}),
        setSelect: (ans) => dispatch({type: "SELECT", payload: ans}),
        clear: () => dispatch({type: "CLEAR"}),
    }
}


export default withRouter(connect(mapToStateProps, mapDispatchToProps)(Test));