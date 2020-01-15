import React from 'react'
import {ACCESS_TOKEN, getTests, getStat} from "../../util/APIutils";
import {connect} from "react-redux";
import "../../styles/page_2/styles.css"
import {Link} from "react-router-dom"


class Main extends React.Component {
    constructor(props) {
        super(props);
    }

    signOut(event) {
        event.preventDefault();
        localStorage.removeItem(ACCESS_TOKEN);
        this.props.logout();
    }

    componentDidMount() {
        this.props.loadingTests();
        this.props.loadingStat();
        getTests().then(tests => this.props.loadTests(tests)).catch(e => {console.warn(e); this.props.dofailTests(e)});
        getStat().then(stat => this.props.loadStat(stat)).catch(e => {console.warn(e); this.props.dofailStat(e)});

    }

    componentDidUpdate() {
        if (!this.props.stats)
            getStat().then(stat => this.props.loadStat(stat)).catch(e => {console.warn(e); this.props.dofailStat(e)});
    }



    render() {
        let form;
        if (this.props.showTests) {
            form = this.props.tests ? this.props.tests.map((test) => <p key={test.name}><b><Link to={"/test/" + test.name}>{test.name}</Link></b></p> ) : "Тестов нет(((";
        } else {
            form = "Нет статистики(((";
            if (this.props.stats && this.props.tests && this.props.stats.filter(stat => stat.status ==="done").length > 0) {
                const data = this.props.stats.filter(stat => stat.status ==="done");
                form = data.map(stat => {
                    const test = this.props.tests.find((t) => t.name === stat.test);
                    if (!test) {
                        console.warn("FAILED TO FIND TEST");
                        return;
                    }
                    const variants = test.answers.split("|");
                    const values = stat.statistics.split("|").map((e) => parseInt(e));
                    const ans = variants[values.indexOf(Math.max(...values))];
                    return <p key={stat.statistics}><b>В тесте {test.name} у тебя ответ {ans}:)</b></p>
                });
            }
        }
        console.log("main", this.props);
        return <div id="base" className="">
            <div id="u10" className="ax_default primary_button">
                <button id="u10_text" className="text " onClick={(e) => this.signOut(e)}>Выход пака!!</button>
            </div>
            <div id="u11" className="ax_default primary_button">
                <button id="u11_text" className="text " onClick={() => this.props.showStat()}>Твоя статистика!!</button>
            </div>

            <div id="u12" className="ax_default primary_button">
                <button id="u12_text" className="text " onClick={() => this.props.showTest()}>Выбирай тестики:)</button>
            </div>
            <div id="u13" className="ax_default box_1">
                <div id="u13_div" className=""></div>
                <div id="u13_text" className="text " >
                    {(this.props.loadingT || this.props.loadingS) ? "Загружаю:)" : form}
                </div>
            </div>
        </div>
    }
}

function mapToStateProps(state) {
    const {basicReducer} = state;
    return {
        login: basicReducer.login,
        password: basicReducer.password,
        tests: basicReducer.tests,
        loadingT: basicReducer.loadingTests,
        loadingS: basicReducer.loadingStat,
        showTests: basicReducer.showTests,
        stats: basicReducer.stats,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        logout: () => dispatch({type: "LOGOUT"}),
        showTest: () => dispatch({type: "SWITCH_TESTS"}),
        showStat: () => dispatch({type: "SWITCH_STATS"}),
        loadTests: (tests) => dispatch({type: "LOAD_TESTS", payload: tests}),
        loadingTests: () => dispatch({type: "LOADING_TESTS"}),
        dofailTests: (e) => dispatch({type: "FAIL_TESTS", payload: e}),
        loadStat: (tests) => dispatch({type: "LOAD_STAT", payload: tests}),
        loadingStat: () => dispatch({type: "LOADING_STAT"}),
        dofailStat: (e) => dispatch({type: "FAIL_STAT", payload: e}),
    }
}

export default connect(mapToStateProps, mapDispatchToProps)(Main);