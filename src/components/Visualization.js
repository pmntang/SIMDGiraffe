import React, { Component } from 'react';
import * as myLib from '../utilities/myLibrary.js';
import '../styles/Visualization.css';
import simdFunction from '../utilities/simdFunction.json';
import Operations from './Operations';
import Explanation from './Explanation';


const operandsAndResults = myLib.computeOperandsAndresultElt(simdFunction);
const constInitialLinkingIndexInstruction = (instructionName) => {
    let operand = operandsAndResults.find(e => e.name == instructionName);
    return operand.result.map(o => ["inactive", ...operand.operands.map(e => [])])
}


class Visualization extends Component {
    constructor(props) {
        super(props);
        this.state = {currentInstruction:myLib.findCurrentInstructionByName(operandsAndResults,props.value), linkingIndex: constInitialLinkingIndexInstruction(props.value), currentOperator: null, currentResult: null };
        this.handleOperandClick = this.handleOperandClick.bind(this);
        this.currentInstruction = operandsAndResults.find(e => e.name == props.value);
        this.linkingIndexTable = []
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.value !== prevProps.value) {
            this.currentInstruction = operandsAndResults.find(e => e.name == this.props.value);
            let newLinkinIndexObject = { name: prevProps.value, linkingIndex: this.state.linkingIndex }
            let indexOfPrevLinkingIndex = this.linkingIndexTable.findIndex(e => e.name == prevProps.value)
            this.linkingIndexTable = indexOfPrevLinkingIndex == -1 ? [...this.linkingIndexTable, newLinkinIndexObject] : this.linkingIndexTable.fill(indexOfPrevLinkingIndex, newLinkinIndexObject, indexOfPrevLinkingIndex + 1);
            let linkingIndex = this.linkingIndexTable.find(e => e.name == this.props.value) ? this.linkingIndexTable.find(e => e.name == this.props.value).linkingIndex : constInitialLinkingIndexInstruction(this.props.value);
            linkingIndex = linkingIndex.map(e => e.fill("inactive", 0, 1))
            this.setState(prevState => ({
                linkingIndex: linkingIndex,
                currentOperator: null,
                currentResult: null
            }));
        }
    }

    componentWillUnmount() {

    }
    handleOperandClick = (evt) => {//To handle both operand and result clickS
        var currentInstructionR = this.currentInstruction.result.reduce((accumulator, currentValue) => [currentValue, ...accumulator], []);//just to reverse
        if (evt.currentTarget.id.includes("result")) {//result has been clicked
            let number = evt.currentTarget.textContent;
            let indexR = currentInstructionR.findIndex(e => (String.fromCharCode(65 + this.currentInstruction.operands.length) + e) == number);
            var linkingIndex = this.state.linkingIndex;
            linkingIndex = linkingIndex.map((e, i) => i == indexR ? e.map((x, j) => j == 0 ? "active" : x) : e.map((x, j) => j == 0 ? "inactive" : x));
            this.setState(prevState => ({
                linkingIndex: linkingIndex
            }));
            indexR > -1 && this.setState(prevState => ({
                currentResult: number
            }));
        }
        var currentInstructionO = this.currentInstruction.operands.map(e => e.reduce((accumulator, currentValue) => [currentValue, ...accumulator], []));//just to reverse
        if (evt.currentTarget.id.includes("operand")) {//operand has been clicked
            let number = evt.currentTarget.textContent;
            var indexO = null;

            let indexOfOperand = currentInstructionO.findIndex((e, i) => {
                indexO = e.indexOf(e.find(o => (String.fromCharCode(65 + i) + o) == number))
                return indexO != -1
            })
            var linkingIndex = this.state.linkingIndex;
            let indexOfResult = linkingIndex.findIndex(e => e[0] == "active");
            if (indexOfResult != -1) {
                if (!linkingIndex[indexOfResult].some(e => Array.isArray(e) && e.length != 0)) {
                    linkingIndex[indexOfResult][indexOfOperand + 1] = [[number, 0, this.state.currentOperator], ...linkingIndex[indexOfResult][indexOfOperand + 1]];
                    this.setState(prevState => ({
                        currentOperator: null
                    }));
                }
                else {
                    if (this.state.currentOperator) {
                        const g = (anArray, anIndex) => anArray[anIndex].reduce((acc, ov, id, alik2) => id != 0 && ov.length != 0 ? [...ov.map(x => x[1]), ...acc] : [...acc], [])
                        var indexOfMaxRankArray
                        var maxRank = Math.max(...g(linkingIndex, indexOfResult)) //The current maximun rank of contribution to the current result field

                        // const operationIdx=(anArray,anIndex)=>anArray[anIndex].findIndex((e, i) => Array.isArray(e) && e.length != 0 && e.findIndex((o, j) => o.indexOf(Math.max(...g(anArray,anIndex))) != -1) != -1)

                        const operationIdx = (anArray, anIndex) => anArray[anIndex].findIndex((e, i) => {
                            if (Array.isArray(e) && e.length != 0) {
                                indexOfMaxRankArray = e.findIndex((o, j) => o.indexOf(Math.max(...g(anArray, anIndex))) != -1)
                                return indexOfMaxRankArray != -1
                            }
                        })
                        var indexOperand = operationIdx(linkingIndex, indexOfResult);//The index of the operand currently bearing the array of contribution to current result field with the maximun rank
                        linkingIndex[indexOfResult][indexOfOperand + 1] = [[number, maxRank + 1, this.state.currentOperator], ...linkingIndex[indexOfResult][indexOfOperand + 1]];
                        this.setState(prevState => ({
                            currentOperator: null
                        }));
                    }


                }
            }

        }

    }
    handleOperatorClick = (evt) => {//To handle both Operator clickS
        var linkingIndex = this.state.linkingIndex;
        let indexOfResult = linkingIndex.findIndex(e => e[0] == "active");
        let operator = evt.currentTarget.textContent;
        if (indexOfResult != -1) {
            this.setState(prevState => ({
                currentOperator: operator
            }));
        }
    }

    handlesimdButtonClick = (evt) => {
        let linkingIndex = this.state.linkingIndex;
        linkingIndex.map(e => e[0] == "active" ? e.fill([], 1) : e)
        this.setState(prevState => ({
            linkingIndex: linkingIndex,
            currentOperator: null
        }));

    }

    render() {


        return (

            <React.Fragment>
                <Explanation value={this.props.value} handlesimdButtonClick={this.handlesimdButtonClick} linkingIndex={this.state.linkingIndex} currentOperator={this.state.currentOperator} currentResult={this.state.currentResult} />
                <Operations value={this.props.value} currentInstruction={this.currentInstruction} linkingIndex={this.state.linkingIndex}
                    handleOperandClick={this.handleOperandClick} handleOperatorClick={this.handleOperatorClick} />
            </React.Fragment>
        )
    }
}

export default Visualization