import React, { Component } from 'react';
import * as myLib from '../utilities/myLibrary.js';
import '../styles/Visualization.css';
import simdFunction from '../utilities/simdFunction.json';
import Operations from './Operations';
import Explanation from './Explanation';


const operandsAndResults = myLib.computeOperandsAndresultElt(simdFunction);
const constInitialLinkingIndexInstruction = (instructionName) => {
    console.log("instructionName", instructionName);
    let operand = operandsAndResults.find(e => e.name == instructionName);
    return operand.result.map(o => ["inactive", ...operand.operands.map(e => [])])
}


class Visualization extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clickedButton: "a",
            msgToUser: { Type: null, Name: null, Rank: null, Dimension: null }
        };
        this.handleDimensionOfOperandChange = this.handleDimensionOfOperandChange.bind(this);
        this.handleInsertClick = this.handleInsertClick.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.handleGroupClick = this.handleGroupClick.bind(this);
        this.handlePartClick = this.handlePartClick.bind(this);
        this.handleGroupPartSelect = this.handleGroupPartSelect.bind(this);
        this.handleNameOfOperandChange = this.handleNameOfOperandChange.bind(this);
        this.handleTypeOfOperandChange = this.handleTypeOfOperandChange.bind(this);
        this.handleRankOfOperandChange = this.handleRankOfOperandChange.bind(this);
        
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    componentWillUnmount() {

    }

    handleDimensionOfOperandChange = (evt) => {
        let Dimension = 2 ** evt.target.value;
        this.setState(prevState => ({
            msgToUser: { ...prevState.msgToUser, Dimension }
        }));
    }

    handleNameOfOperandChange = (evt) => {

    }
    handleTypeOfOperandChange = (evt) => {
        let Type = evt.target.value;
        this.setState(prevState => ({
            msgToUser: { ...prevState.msgToUser, Type }
        })); console.log("testeeee", evt.target.value);
    }
    handleRankOfOperandChange = (evt) => {

    }

    handleInsertClick = (evt) => {
        console.log("evt.currentTarget insert", evt.target.id)
        this.setState(prevState => ({
            clickedButton: evt.target.id
        }));
  
    }

    handleDeleteClick = (evt) => {
        console.log("evt.currentTarget delete", evt.target)
        this.setState(prevState => ({
            clickedButton: evt.target.id
        }));
    }
    handleGroupClick = (evt) => {

    }

    handlePartClick = (evt) => {

    }
    handleGroupPartSelect = (evt) => {
        //console.log("evtTarget select", evt.target, "evt.currentTarget select", evt.currentTarget)
    }
   

    render() {

        return (

            <React.Fragment>
                <Explanation value={this.props.value} handlesimdButtonClick={this.props.handlesimdButtonClick} linkingIndex={this.props.linkingIndex}  msgToUser={this.state.msgToUser}
                    currentOperator={this.props.currentOperator} currentResult={this.props.currentResult} currentInstruction={this.props.currentInstruction} clickedButton={this.state.clickedButton} 
                    handleDimensionOfOperandChange={this.handleDimensionOfOperandChange} handleRankOfOperandChange={this.handleRankOfOperandChange}
                    handleInsertClick={this.handleInsertClick} handleDeleteClick={this.handleDeleteClick} handleGroupClick={this.handleGroupClick} handlePartClick={this.handlePartClick}/>
                <Operations value={this.props.value} currentInstruction={this.props.currentInstruction} linkingIndex={this.props.linkingIndex}
                    handleOperandClick={this.props.handleOperandClick} handleOperatorClick={this.props.handleOperatorClick} />
            </React.Fragment>
        )
    }
}

export default Visualization