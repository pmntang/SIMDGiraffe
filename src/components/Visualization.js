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
        
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    componentWillUnmount() {

    }

   
   

    render() {

        return (

            <React.Fragment>
                <Explanation value={this.props.value} handlesimdButtonClick={this.props.handlesimdButtonClick} linkingIndex={this.props.linkingIndex}  msgToUser={this.props.msgToUser} deletedName={this.props.deletedName}
                    currentOperator={this.props.currentOperator} currentResult={this.props.currentResult} currentInstruction={this.props.currentInstruction} clickedButton={this.props.clickedButton} 
                    handleDimensionOfOperandChange={this.props.handleDimensionOfOperandChange} handleRankOfOperandChange={this.props.handleRankOfOperandChange} handleTypeOfOperandChange={this.props.handleTypeOfOperandChange}
                    handleNameOfOperandChange={this.props.handleNameOfOperandChange} handleInsertClick={this.props.handleInsertClick} handleDeleteClick={this.props.handleDeleteClick} handleGroupClick={this.props.handleGroupClick} handlePartClick={this.props.handlePartClick}/>
                <Operations value={this.props.value} currentInstruction={this.props.currentInstruction} linkingIndex={this.props.linkingIndex}
                    handleOperandClick={this.props.handleOperandClick} handleOperatorClick={this.props.handleOperatorClick} />
            </React.Fragment>
        )
    }
}

export default Visualization