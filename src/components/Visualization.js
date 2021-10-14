import React, { Component } from 'react';
import * as myLib from '../utilities/myLibrary.js';
import '../styles/Visualization.css';
import simdFunction from '../utilities/simdFunction.json';
import Operations from './Operations';
import Explanation from './Explanation';


const operandsAndResults = myLib.computeOperandsAndresultElt(simdFunction);
const constInitialLinkingIndexInstruction = (instructionName) => {console.log("instructionName", instructionName);
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
        
        /*         let indexOfLinkingIndex = this.state.linkingIndexTable.findIndex(e => e.currentInstruction.name == this.props.value);
                if (indexOfLinkingIndex === -1) {
                    this.linkingIndex = constInitialLinkingIndexInstruction(this.props.value);
                    this.currentInstruction = myLib.findCurrentInstructionByName(operandsAndResults, this.props.value);
                }
                else {
                    this.linkingIndex = this.state.linkingIndexTable[indexOfLinkingIndex].linkingIndex;
                    this.currentInstruction = this.state.linkingIndexTable[indexOfLinkingIndex].currentInstruction;
                } */
        return (

            <React.Fragment>
                <Explanation value={this.props.value} handlesimdButtonClick={this.props.handlesimdButtonClick} linkingIndex={this.props.linkingIndex} currentOperator={this.props.currentOperator} currentResult={this.props.currentResult} />
                <Operations value={this.props.value} currentInstruction={this.props.currentInstruction} linkingIndex={this.props.linkingIndex}
                    handleOperandClick={this.props.handleOperandClick} handleOperatorClick={this.props.handleOperatorClick} />
            </React.Fragment>
        )
    }
}

export default Visualization