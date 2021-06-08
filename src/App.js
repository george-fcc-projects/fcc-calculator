import './App.css';
import { Provider } from 'react-redux';
import React from "react";
import {createStore} from 'redux';
import { Button } from "reactstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { evaluate } from 'mathjs';


const INCREMENT = 'INCREMENT';
const DECREMENT = 'DECREMENT';

const ADD = 'ADD';
const SUBTRACT = 'SUBTRACT';
const MULTIPLY = 'MULTIPLY';
const DIVIDE = 'DIVIDE';
const NUMBER_INPUT = 'NUMBER_INPUT';
const CLEAR_INPUT = 'CLEAR_INPUT';
const OPERATOR_INPUT = 'OPERATOR_INPUT';
const DECIMAL_INPUT = 'DECIMAL_INPUT';
const ZERO_INPUT = 'ZERO_INPUT';
const EQUALS = 'EQUALS';

const numberInputAction = (valueIn) => {
    return {
        type: NUMBER_INPUT,
        value: valueIn
    }
};

const clearInputAction = () => {
    console.log('clear clicked');
    return {
        type: CLEAR_INPUT
    }
};

const operatorAction = (op) => {
    return {
        type: OPERATOR_INPUT,
        operator: op
    }
};

const decimalAction = () => {
    return {
        type: DECIMAL_INPUT
    }
};

const zeroAction = () => {
    return {
        type: ZERO_INPUT
    }
};

const equalAction = () => {
    return {
        type: EQUALS
    }
}

const initialState = {
    result: '0',
    input: '0',
    equalsed: false
};

const store = createStore(
    reducer,
    initialState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());



function reducer(state = initialState, action) {
    switch (action.type) {
        case NUMBER_INPUT:
            console.log('number clicked:', action.value);
            if (state.equalsed) {
                return {
                    ...state,
                    equalsed: false,
                    input: '0',
                    result: action.value
                }
            } else {
                if (state.result === '0') {
                    return {
                        ...state,
                        result: action.value
                    }
                } else {
                    return {
                        ...state,
                        result: state.result.concat(action.value)
                    }
                }
            }
        case CLEAR_INPUT:
            return {
                ...state,
                input: '0',
                result: '0'
            }
        case OPERATOR_INPUT:
            if (state.equalsed) {
                return {
                    ...state,
                    input: state.result.concat(action.operator),
                    result: '0',
                    equalsed: false,
                }
            } else {
                console.log(state.input.slice(-1), /[+*/]/.test(state.input.slice(-1)));
                if (action.operator === '-') {
                    if (state.result === '0') {
                        return {
                            ...state,
                            result: '-'
                        }
                    }
                }
                if (/[+*/]/.test(state.input.slice(-1)) && state.result === '0'){
                    return {
                        ...state,
                        input: state.input.slice(0,-1).concat(action.operator)
                    }
                }
                if (state.input === '0') {
                    return {
                        ...state,
                        input: state.result.concat(action.operator),
                        result: '0'
                    }
                } else {
                    return {
                        ...state,
                        input: state.input.concat(state.result.concat(action.operator)),
                        result: '0'
                    }
                }
            }

        case DECIMAL_INPUT:
            if (!/\./.test(state.result)) {
                return {
                    ...state,
                    result: state.result.concat('.')
                }
            } else {
                return {
                    ...state
                }
            }
            break;
        case ZERO_INPUT:
            if (state.result === '0') {
                return {
                    ...state
                }
            } else {
                return {
                    ...state,
                    result: state.result.concat('0')
                }
            }
        case EQUALS:
            if (!state.equalsed){
                return {
                    ...state,
                    result: evaluate(state.input.concat(state.result)).toString(),
                    input: state.input.concat(state.result),
                    equalsed: true
                }
            } else {
                return state
            }
            break;

        default:
            return state;
    }

}



class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            result: store.getState().result,
            input: store.getState().input
        }

        this.subscribeListener = () => {
            this.setState({
                result: store.getState().result,
                input: store.getState().input
            })
        }

        store.subscribe(this.subscribeListener)


    }

    render() {
    return (
        <Provider store={store}>
            <div className="App">
              <header className="App-header">
                  <div className='calculator'>
                      <Display
                        resultDisplayContent={this.state.result}
                        inputDisplayContent={this.state.input}
                      />
                      {/*<CountButtons/>*/}
                      <ButtonContainer/>
                  </div>
              </header>
            </div>
        </Provider>
    );
  }
}

class Display extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div className='display-wrapper'>
                <div className='input-display-wrapper'>
                    <code id='input-display'>{this.props.inputDisplayContent}</code>
                </div>
                <div className='result-display-wrapper'>
                    <code id="display">{this.props.resultDisplayContent}</code>
                </div>
            </div>
        );
    }
}

class ButtonContainer extends React.Component {
    render() {
        return (
            <div className='all-buttons'>
                <ClearButton/>
                <NumberButtons/>
                <OperatorButtons/>
                <EqualsButton/>
                <MyTests/>
            </div>
        );
    }
}

class ClearButton extends React.Component {

    handleClick() {
        store.dispatch(clearInputAction())
    }

    render() {
        return (
            <div className='clear-button-container'>
                <Button
                    id='clear'
                    color='danger'
                    className='clear-button'
                    onClick={this.handleClick}
                >AC</Button>
            </div>
        );
    }
}

class OperatorButtons extends React.Component {

    operatorArr = [
        {op: '+', action: ADD, id: 'add'},
        {op: '-', action: SUBTRACT, id: 'subtract'},
        {op: '/', action: DIVIDE, id: 'divide'},
        {op: '*', action: MULTIPLY, id: 'multiply'}
    ]

    handleClick(event) {
        store.dispatch(operatorAction(event.target.innerText))
    }

    render() {
        return (
            <div className='operator-button-container'>
                {this.operatorArr.map(ele => {
                    return (
                        <Button
                            key={Math.floor(Math.random()*100000)}
                            className='operator-button'
                            color='danger'
                            id={ele.id}
                            onClick={this.handleClick}
                        >{ele.op}</Button>
                    )
                })}

            </div>
        );
    }
}

class EqualsButton extends React.Component {

    handleClick() {
        store.dispatch(equalAction())
    }

    render() {
        return (
            <div className='equals-button-container'>
                <Button
                    id='equals'
                    className='equals-button'
                    color='warning'
                    onClick={this.handleClick}
                >=</Button>
            </div>
        );
    }
}

class MyTests extends React.Component {
    handleClick() {
        document.getElementById('one').click();
        document.getElementById('two').click();
        document.getElementById('three').click();
        console.log('test complete:', document.getElementById('display').innerText)
    }

    render() {
        return (
            <div className='test-div'>
                <Button
                    onClick={this.handleClick}
                >Test</Button>
            </div>
        );
    }
}


class NumberButtons extends React.Component {
    numberArr = [
        {value:7, id:"seven"},
        {value:8, id:"eight"},
        {value:9, id:"nine"},
        {value:4, id:"four"},
        {value:5, id:"five"},
        {value:6, id:"six"},
        {value:1, id:"one"},
        {value:2, id:"two"},
        {value:3, id:"three"}
        ];

    handleClickNumber(event) {
        store.dispatch(numberInputAction(event.target.innerText))
    }

    handleClickDecimal() {
        store.dispatch(decimalAction())
    }

    handleClickZero() {
        store.dispatch(zeroAction())
    }

    render() {
        return (
            <div className='number-button-container'>
                {this.numberArr.map(ele => {
                    return (
                        <Button
                            key={Math.floor(Math.random()*100000)}
                            className='number-button'
                            color='primary'
                            id={ele.id}
                            onClick={this.handleClickNumber}
                        >{ele.value}</Button>
                    )
                })}
                <div className='zero-button-container'>
                    <Button
                        color='primary'
                        className='zero-button'
                        id='zero'
                        onClick={this.handleClickZero}
                    >0</Button>
                </div>
                <Button
                    color='primary'
                    className='dec-button'
                    id='decimal'
                    onClick={this.handleClickDecimal}
                >.</Button>
            </div>
        );
    }
}

export default App;
