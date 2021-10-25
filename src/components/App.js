import React, { Component } from 'react';
import * as myLib from '../utilities/myLibrary.js';
import simdFunction from '../utilities/simdFunction.json';
import styled from 'styled-components'
import logo from '../assets/logo.png';
import '../styles/App.css';
import CodeText from './CodeText';
import Visualization from './Visualization';

const Container = styled.div`
  display: flex;
`

const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh
  width: 50vw;
  overflow: auto;
`

const RightContainer = styled.div`
  width: 50vw;
  height: 100vh;
  overflow: hidden;
`
const myDataListTab = myLib.constructDataListTable(simdFunction);
const operandsAndResults = myLib.computeOperandsAndresultElt(simdFunction);
const constInitialLinkingIndexInstruction = (instructionName) => {
  let operand = operandsAndResults.find(e => e.name == instructionName);
  return operand.result.map(o => ["inactive", ...operand.operands.map(e => [])])
}



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "_mm_add_epi8", isVisible: true, currentOperator: null, currentResult: null, linkingIndexTable: [{
        linkingIndex: constInitialLinkingIndexInstruction("_mm_add_epi8"),
        currentInstruction: myLib.findCurrentInstructionByName(operandsAndResults, "_mm_add_epi8")
      }], clickedButton: 1, msgToUser: { Type: { Type: null, state: false }, Name: { Name: null, state: false }, Rank: { Rank: null, state: false }, Dimension: { Dimension: null, state: false } },
      deletedName: []
    };
    this.handleOperandClick = this.handleOperandClick.bind(this);
    this.handleOnchange = this.handleOnchange.bind(this);
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

  componentDidUpdate() {

  }

  componentWillUnmount() {

  }
  handleOnchange(evt) {
    if (myDataListTab.find(o => o[0] == evt.target.value)) {
      var linkingIndexTable = this.state.linkingIndexTable
      if (!(linkingIndexTable.find(e => e.currentInstruction.name === evt.target.value))) {
        let newLinkinIndexObject = { linkingIndex: constInitialLinkingIndexInstruction(evt.target.value), currentInstruction: myLib.findCurrentInstructionByName(operandsAndResults, evt.target.value) }
        linkingIndexTable = linkingIndexTable.map(e => ({ linkingIndex: e.linkingIndex.map(o => o.fill("inactive", 0, 1)), currentInstruction: e.currentInstruction }))
        linkingIndexTable = [...linkingIndexTable, newLinkinIndexObject]
      }
      else {
        let indexOfLinkingIndex = linkingIndexTable.findIndex(e => e.currentInstruction.name === evt.target.value);
        let newLinkinIndexObject = { linkingIndex: linkingIndexTable[indexOfLinkingIndex].linkingIndex.map(o => o.fill("inactive", 0, 1)), currentInstruction: linkingIndexTable[indexOfLinkingIndex].currentInstruction };
        linkingIndexTable = linkingIndexTable.fill(newLinkinIndexObject, indexOfLinkingIndex, indexOfLinkingIndex + 1);

      }
      this.setState(prevState => ({
        linkingIndexTable: linkingIndexTable,
        currentOperator: null,
        currentResult: null,
        value: evt.target.value,
        isVisible: true
      }));

    }
    else {
      this.setState(prevState => ({
        isVisible: null
      }));
    }
  }
  handleOperandClick = (evt) => {//To handle both operand and result clickS
    var linkingIndexTable = this.state.linkingIndexTable; console.log("linkingIndexTable op", linkingIndexTable)
    let indexOfcurrentInstruction = linkingIndexTable.findIndex(e => e.currentInstruction.name === this.state.value);
    var currentInstructionR = linkingIndexTable[indexOfcurrentInstruction].currentInstruction.result.reduce((accumulator, currentValue) => [currentValue, ...accumulator], []);//just to reverse
    if (evt.currentTarget.id.includes("result")) {//result has been clicked
      let number = evt.currentTarget.textContent;
      let indexR = currentInstructionR.findIndex(e => (String.fromCharCode(65 + linkingIndexTable[indexOfcurrentInstruction].currentInstruction.operands.length) + e) == number);
      linkingIndexTable[indexOfcurrentInstruction].linkingIndex = linkingIndexTable[indexOfcurrentInstruction].linkingIndex.map((e, i) => i == indexR ? e.map((x, j) => j == 0 ? "active" : x) : e.map((x, j) => j == 0 ? "inactive" : x));
      indexR > -1 && this.setState(prevState => ({
        currentResult: number,
        linkingIndexTable: linkingIndexTable
      }));
    }
    var currentInstructionO = linkingIndexTable[indexOfcurrentInstruction].currentInstruction.operands.map(e => e.reduce((accumulator, currentValue) => [currentValue, ...accumulator], []));//just to reverse
    if (evt.currentTarget.id.includes("operand")) {//operand has been clicked
      let number = evt.currentTarget.textContent;
      var indexO = null;

      let indexOfOperand = currentInstructionO.findIndex((e, i) => {
        indexO = e.indexOf(e.find(o => (String.fromCharCode(65 + i) + o) == number))
        return indexO != -1
      })
      let indexOfResult = linkingIndexTable[indexOfcurrentInstruction].linkingIndex.findIndex(e => e[0] == "active");
      if (indexOfResult != -1) {
        if (!linkingIndexTable[indexOfcurrentInstruction].linkingIndex[indexOfResult].some(e => Array.isArray(e) && e.length != 0)) {
          linkingIndexTable[indexOfcurrentInstruction].linkingIndex[indexOfResult][indexOfOperand + 1] = [[number, 0, this.state.currentOperator], ...linkingIndexTable[indexOfcurrentInstruction].linkingIndex[indexOfResult][indexOfOperand + 1]];
          this.setState(prevState => ({
            currentOperator: null,
            linkingIndexTable: linkingIndexTable
          }));
        }
        else {
          if (this.state.currentOperator) {
            const g = (anArray, anIndex) => anArray[anIndex].reduce((acc, ov, id, alik2) => id != 0 && ov.length != 0 ? [...ov.map(x => x[1]), ...acc] : [...acc], [])
            var indexOfMaxRankArray
            var maxRank = Math.max(...g(linkingIndexTable[indexOfcurrentInstruction].linkingIndex, indexOfResult)) //The current maximun rank of contribution to the current result field

            // const operationIdx=(anArray,anIndex)=>anArray[anIndex].findIndex((e, i) => Array.isArray(e) && e.length != 0 && e.findIndex((o, j) => o.indexOf(Math.max(...g(anArray,anIndex))) != -1) != -1)

            const operationIdx = (anArray, anIndex) => anArray[anIndex].findIndex((e, i) => {
              if (Array.isArray(e) && e.length != 0) {
                indexOfMaxRankArray = e.findIndex((o, j) => o.indexOf(Math.max(...g(anArray, anIndex))) != -1)
                return indexOfMaxRankArray != -1
              }
            })
            var indexOperand = operationIdx(linkingIndexTable[indexOfcurrentInstruction].linkingIndex, indexOfResult);//The index of the operand currently bearing the array of contribution to current result field with the maximun rank
            linkingIndexTable[indexOfcurrentInstruction].linkingIndex[indexOfResult][indexOfOperand + 1] = [[number, maxRank + 1, this.state.currentOperator], ...linkingIndexTable[indexOfcurrentInstruction].linkingIndex[indexOfResult][indexOfOperand + 1]];
            this.setState(prevState => ({
              currentOperator: null,
              linkingIndexTable: linkingIndexTable
            }));
          }


        }
      }

    }

  }
  handleOperatorClick = (evt) => {//To handle both Operator clickS
    var linkingIndexTable = this.state.linkingIndexTable;
    let indexOfcurrentInstruction = linkingIndexTable.findIndex(e => e.currentInstruction.name === this.state.value);
    let indexOfResult = linkingIndexTable[indexOfcurrentInstruction].linkingIndex.findIndex(e => e[0] == "active");
    let operator = evt.currentTarget.textContent;
    if (indexOfResult !== -1) {
      this.setState(prevState => ({
        currentOperator: operator
      }));
    }
  }

  handlesimdButtonClick = (evt) => {
    var linkingIndexTable = this.state.linkingIndexTable;
    let indexOfcurrentInstruction = linkingIndexTable.findIndex(e => e.currentInstruction.name === this.state.value);
    linkingIndexTable[indexOfcurrentInstruction].linkingIndex = linkingIndexTable[indexOfcurrentInstruction].linkingIndex.map(e => e[0] == "active" ? e.fill([], 1) : e);
    this.setState(prevState => ({
      currentOperator: null,
      linkingIndexTable: linkingIndexTable
    }));

  }

  handleDimensionOfOperandChange = (evt) => {
    console.log("this.state.msgToUser.Dimension ", this.state.msgToUser.Dimension);
    let Dimension = { Dimension: evt.target.value, state: true };
    this.setState(prevState => ({
      msgToUser: { ...prevState.msgToUser, Dimension }
    })); console.log("this.state.msgToUser.Dimension ", this.state.msgToUser.Dimension);
  }

  handleNameOfOperandChange = (evt) => {
    let Name = { Name: evt.target.value, state: true };
    if (Name.Name === "r") {
      let indexOfLinkingIndex = this.state.linkingIndexTable.findIndex(e => e.currentInstruction.name === this.state.value);
      let RankV = this.state.linkingIndexTable[indexOfLinkingIndex].currentInstruction.result.length === 0 ? this.state.linkingIndexTable[indexOfLinkingIndex].currentInstruction.operands + 1 :
        this.state.linkingIndexTable[indexOfLinkingIndex].currentInstruction.operands.length + 2;
      let Rank = { Rank: RankV, state: this.state.msgToUser.Rank.state }
      this.setState(prevState => ({
        msgToUser: { ...prevState.msgToUser, Name, Rank }
      }));

    }
    else {
      this.setState(prevState => ({
        msgToUser: { ...prevState.msgToUser, Name }
      }));
    }

  }

  handleTypeOfOperandChange = (evt) => {
    let Type = { Type: evt.target.value, state: true };
    this.setState(prevState => ({
      msgToUser: { ...prevState.msgToUser, Type }
    }))
  }

  handleRankOfOperandChange = (evt) => {
    let Rank = { Rank: evt.target.value, state: true };
    let Name = { Name: "r", state: this.state.msgToUser.Name.state };
    let indexOfLinkingIndex = this.state.linkingIndexTable.findIndex(e => e.currentInstruction.name === this.state.value);
    if (((Rank.Rank === this.state.linkingIndexTable[indexOfLinkingIndex].currentInstruction.operands + 2) && this.state.linkingIndexTable[indexOfLinkingIndex].currentInstruction.result.length !== 0)
      || ((Rank.Rank === this.state.linkingIndexTable[indexOfLinkingIndex].currentInstruction.operands + 1) && this.state.linkingIndexTable[indexOfLinkingIndex].currentInstruction.result.length === 0)) {
      this.setState(prevState => ({
        msgToUser: { ...prevState.msgToUser, Name, Rank }
      }))
    }
    else {
      this.setState(prevState => ({
        msgToUser: { ...prevState.msgToUser, Rank }
      }));
    }

  }

  handleInsertClick = (evt) => {
    var linkingIndexTable = this.state.linkingIndexTable;
    var msgToUser = this.state.msgToUser;
    if (msgToUser.Name.state && msgToUser.Type.state && msgToUser.Rank.state && msgToUser.Dimension.state) {
      let indexOfLinkingIndex = linkingIndexTable.findIndex(e => e.currentInstruction.name === this.state.value);
      let modifiedCurrentInstruction = myLib.insertOperand(msgToUser.Name.Name, msgToUser.Type.Type, msgToUser.Rank.Rank, msgToUser.Dimension.Dimension, linkingIndexTable[indexOfLinkingIndex].currentInstruction);
      linkingIndexTable[indexOfLinkingIndex].currentInstruction = modifiedCurrentInstruction;
    }
    this.setState(prevState => ({
      linkingIndexTable:linkingIndexTable
    }));

  }

  handleDeleteClick = (evt) => {
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

  render() {console.log("linkingIndextable", this.state.linkingIndexTable);
    let indexOfLinkingIndex = this.state.linkingIndexTable.findIndex(e => e.currentInstruction.name == this.state.value);
    let linkingIndex = this.state.linkingIndexTable[indexOfLinkingIndex].linkingIndex;
    let currentInstruction = this.state.linkingIndexTable[indexOfLinkingIndex].currentInstruction;
    return (
      <div id="displayZone" className="displayZone">
        <CodeText handleOnchange={this.handleOnchange} value={this.state.value} isVisible={this.state.isVisible} />
        {this.state.isVisible && <Visualization deletedName={this.state.deletedName} currentOperator={this.state.currentOperator} currentResult={this.state.currentResult} handlesimdButtonClick={this.handlesimdButtonClick}
          currentInstruction={currentInstruction} linkingIndex={linkingIndex} handleOperandClick={this.handleOperandClick} handleOperatorClick={this.handleOperatorClick} value={this.state.value}
          clickedButton={this.state.clickedButton} handleDimensionOfOperandChange={this.handleDimensionOfOperandChange} handleRankOfOperandChange={this.handleRankOfOperandChange}
          handleInsertClick={this.handleInsertClick} handleDeleteClick={this.handleDeleteClick} handleGroupClick={this.handleGroupClick} handlePartClick={this.handlePartClick} msgToUser={this.state.msgToUser}
          handleTypeOfOperandChange={this.handleTypeOfOperandChange} handleNameOfOperandChange={this.handleNameOfOperandChange} />}
      </div>
    );
  }

}

export default App;
