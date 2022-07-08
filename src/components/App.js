import React, { Component } from 'react'
import * as myLib from '../utilities/myLibrary.js'
import * as _ from 'lodash'
import simdFunction from '../utilities/simdFunction.json'
import styled from 'styled-components'
import logo from '../assets/logo.png'
import '../styles/App.css'
import CodeText from './CodeText'
import Operations from './Operations'
import Explanation from './Explanation'
// import Visualization from './Visualization';

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
const myDataListTab = myLib.constructDataListTable(simdFunction)
const initializeResultElt = anInstructionName => myLib.range(1, myLib.constInitialLinkingIndexInstruction(anInstructionName).length, 1).map(e => ({ state: 'inactive', fieldResult: null }))

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: '_mm_add_epi8',
      activeView: 'expert',
      isVisible: true,
      currentOperator: null,
      currentResult: null,
      linkingIndexTable: [{
        linkingIndex: myLib.constInitialLinkingIndexInstruction('_mm_add_epi8'),
        currentInstruction: myLib.findCurrentInstructionByName(myLib.operandsAndResults, '_mm_add_epi8'),
        resultTable: initializeResultElt('_mm_add_epi8')
      }],
      clickedButton: 1,
      msgToUser: { Type: { Type: null, state: false }, Name: { Name: null, state: false }, Rank: { Rank: null, state: false }, Dimension: { Dimension: null, state: false } },
      deletedName: []
    }
    this.handleOperandClick = this.handleOperandClick.bind(this)
    this.handleOnchange = this.handleOnchange.bind(this)
    this.handleDimensionOfOperandChange = this.handleDimensionOfOperandChange.bind(this)
    this.handleInsertClick = this.handleInsertClick.bind(this)
    this.handleDeleteClick = this.handleDeleteClick.bind(this)
    this.handleGroupClick = this.handleGroupClick.bind(this)
    this.handlePartClick = this.handlePartClick.bind(this)
    this.handleGroupPartSelect = this.handleGroupPartSelect.bind(this)
    this.handleNameOfOperandChange = this.handleNameOfOperandChange.bind(this)
    this.handleTypeOfOperandChange = this.handleTypeOfOperandChange.bind(this)
    this.handleRankOfOperandChange = this.handleRankOfOperandChange.bind(this)
  }

  componentDidMount () {

  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    const indexOfLinkingIndex = this.state.linkingIndexTable.findIndex(e => e.currentInstruction.name === this.state.value)
    const resultTable = this.state.linkingIndexTable[indexOfLinkingIndex].resultTable
    this.state.linkingIndexTable[indexOfLinkingIndex].linkingIndex.forEach((r, i, a) => {
      if (r.some((o, j) => j > 0 && o.find(x => x[2]))) {
        resultTable[i].state = 'active'
      } else {
        resultTable[i].state = 'inactive'
      }
    })
    if (!_.isEqual(resultTable, this.state.linkingIndexTable[indexOfLinkingIndex].resultTable)) {
      const linkingIndexTable = this.state.linkingIndexTable
      const newLinkinIndexObject = {
        linkingIndex: linkingIndexTable[indexOfLinkingIndex].linkingIndex,
        currentInstruction: linkingIndexTable[indexOfLinkingIndex].currentInstruction,
        resultTable: resultTable
      }
      linkingIndexTable[indexOfLinkingIndex] = newLinkinIndexObject
      this.setState(state => ({
        linkingIndexTable: linkingIndexTable
      }))
    }
  }

  componentWillUnmount () {

  }

  handleOnchange (evt) {
    if (myDataListTab.find(o => o[0] == evt.target.value)) {
      let linkingIndexTable = this.state.linkingIndexTable
      if (!(linkingIndexTable.find(e => e.currentInstruction.name === evt.target.value))) {
        const newLinkinIndexObject = {
          linkingIndex: myLib.constInitialLinkingIndexInstruction(evt.target.value),
          currentInstruction: myLib.findCurrentInstructionByName(myLib.operandsAndResults, evt.target.value),
          resultTable: initializeResultElt(evt.target.value)
        }
        linkingIndexTable = linkingIndexTable.map(e => ({ linkingIndex: e.linkingIndex.map(o => o.fill('inactive', 0, 1)), currentInstruction: e.currentInstruction }))
        linkingIndexTable = [...linkingIndexTable, newLinkinIndexObject]
      } else {
        const indexOfLinkingIndex = linkingIndexTable.findIndex(e => e.currentInstruction.name === evt.target.value)
        const newLinkinIndexObject = {
          linkingIndex: linkingIndexTable[indexOfLinkingIndex].linkingIndex.map(o => o.fill('inactive', 0, 1)),
          currentInstruction: linkingIndexTable[indexOfLinkingIndex].currentInstruction,
          resultTable: linkingIndexTable[indexOfLinkingIndex].resultTable
        }
        linkingIndexTable = linkingIndexTable.fill(newLinkinIndexObject, indexOfLinkingIndex, indexOfLinkingIndex + 1)
      }
      this.setState(state => ({
        linkingIndexTable: linkingIndexTable,
        currentOperator: null,
        currentResult: null,
        value: evt.target.value,
        isVisible: true
      }))
    } else {
      this.setState(prevState => ({
        isVisible: null
      }))
    }
  }

  handleOperandClick = (evt) => { // To handle both operand and result clickS
    const linkingIndexTable = this.state.linkingIndexTable; console.log('linkingIndexTable op', linkingIndexTable)
    const indexOfcurrentInstruction = linkingIndexTable.findIndex(e => e.currentInstruction.name === this.state.value)
    const currentInstructionR = linkingIndexTable[indexOfcurrentInstruction].currentInstruction.result.reduce((accumulator, currentValue) => [currentValue, ...accumulator], [])// just to reverse
    if (evt.currentTarget.id.includes('result')) { // result has been clicked
      const number = evt.currentTarget.textContent
      const indexR = currentInstructionR.findIndex(e => (String.fromCharCode(65 + linkingIndexTable[indexOfcurrentInstruction].currentInstruction.operands.length) + e) === number)
      linkingIndexTable[indexOfcurrentInstruction].linkingIndex = linkingIndexTable[indexOfcurrentInstruction].linkingIndex.map((e, i) => i === indexR ? e.map((x, j) => j === 0 ? 'active' : x) : e.map((x, j) => j === 0 ? 'inactive' : x))
      linkingIndexTable[indexOfcurrentInstruction].resultTable = linkingIndexTable[indexOfcurrentInstruction].resultTable.map((e, i) => i === indexR ? ({ state: e.state, fieldResult: number }) : e); console.log('number', number, 'index', indexR)
      indexR > -1 && this.setState(prevState => ({
        currentResult: number,
        linkingIndexTable: linkingIndexTable
      }))
    }
    const currentInstructionO = linkingIndexTable[indexOfcurrentInstruction].currentInstruction.operands.map(e => e.reduce((accumulator, currentValue) => [currentValue, ...accumulator], []))// just to reverse
    if (evt.currentTarget.id.includes('operand')) { // operand has been clicked
      const number = evt.currentTarget.textContent
      let indexO = null

      const indexOfOperand = currentInstructionO.findIndex((e, i) => {
        indexO = e.indexOf(e.find(o => (String.fromCharCode(65 + i) + o) === number))
        return indexO !== -1
      })
      const indexOfResult = linkingIndexTable[indexOfcurrentInstruction].linkingIndex.findIndex(e => e[0] === 'active')
      if (indexOfResult !== -1) {
        if (!linkingIndexTable[indexOfcurrentInstruction].linkingIndex[indexOfResult].some(e => Array.isArray(e) && e.length !== 0)) {
          linkingIndexTable[indexOfcurrentInstruction].linkingIndex[indexOfResult][indexOfOperand + 1] = [[number, 0, this.state.currentOperator], ...linkingIndexTable[indexOfcurrentInstruction].linkingIndex[indexOfResult][indexOfOperand + 1]]
          this.setState(prevState => ({
            currentOperator: null,
            linkingIndexTable: linkingIndexTable
          }))
        } else {
          if (this.state.currentOperator) {
            const g = (anArray, anIndex) => anArray[anIndex].reduce((acc, ov, id, alik2) => id != 0 && ov.length != 0 ? [...ov.map(x => x[1]), ...acc] : [...acc], [])
            let indexOfMaxRankArray
            const maxRank = Math.max(...g(linkingIndexTable[indexOfcurrentInstruction].linkingIndex, indexOfResult)) // The current maximun rank of contribution to the current result field

            // const operationIdx=(anArray,anIndex)=>anArray[anIndex].findIndex((e, i) => Array.isArray(e) && e.length != 0 && e.findIndex((o, j) => o.indexOf(Math.max(...g(anArray,anIndex))) != -1) != -1)

            const operationIdx = (anArray, anIndex) => anArray[anIndex].findIndex((e, i) => {
              if (Array.isArray(e) && e.length !== 0) {
                indexOfMaxRankArray = e.findIndex((o, j) => o.indexOf(Math.max(...g(anArray, anIndex))) !== -1)
                return indexOfMaxRankArray !== -1
              }
            })
            const indexOperand = operationIdx(linkingIndexTable[indexOfcurrentInstruction].linkingIndex, indexOfResult)// The index of the operand currently bearing the array of contribution to current result field with the maximun rank
            linkingIndexTable[indexOfcurrentInstruction].linkingIndex[indexOfResult][indexOfOperand + 1] = [[number, maxRank + 1, this.state.currentOperator], ...linkingIndexTable[indexOfcurrentInstruction].linkingIndex[indexOfResult][indexOfOperand + 1]]
            this.setState(prevState => ({
              currentOperator: null,
              linkingIndexTable: linkingIndexTable
            }))
          }
        }
      }
    }
  }

  handleOperatorClick = (evt) => { // To handle both Operator clickS
    const linkingIndexTable = this.state.linkingIndexTable
    const indexOfcurrentInstruction = linkingIndexTable.findIndex(e => e.currentInstruction.name === this.state.value)
    const indexOfResult = linkingIndexTable[indexOfcurrentInstruction].linkingIndex.findIndex(e => e[0] == 'active')
    const operator = evt.currentTarget.textContent
    if (indexOfResult !== -1) {
      this.setState(prevState => ({
        currentOperator: operator
      }))
    }
  }

  handlesimdButtonClick = (evt) => {
    const linkingIndexTable = this.state.linkingIndexTable
    const indexOfcurrentInstruction = linkingIndexTable.findIndex(e => e.currentInstruction.name === this.state.value)
    linkingIndexTable[indexOfcurrentInstruction].linkingIndex = linkingIndexTable[indexOfcurrentInstruction].linkingIndex.map(e => e[0] == 'active' ? e.fill([], 1) : e)
    this.setState(prevState => ({
      currentOperator: null,
      linkingIndexTable: linkingIndexTable
    }))
  }

  handleDimensionOfOperandChange = (evt) => {
    console.log('this.state.msgToUser.Dimension ', this.state.msgToUser.Dimension)
    const Dimension = { Dimension: evt.target.value, state: true }
    this.setState(prevState => ({
      msgToUser: { ...prevState.msgToUser, Dimension }
    })); console.log('this.state.msgToUser.Dimension ', this.state.msgToUser.Dimension)
  }

  handleNameOfOperandChange = (evt) => {
    if (evt.target.value === 'r') {
      const indexOfLinkingIndex = this.state.linkingIndexTable.findIndex(e => e.currentInstruction.name === this.state.value)
      const RankV = this.state.linkingIndexTable[indexOfLinkingIndex].currentInstruction.result.length === 0
        ? this.state.linkingIndexTable[indexOfLinkingIndex].currentInstruction.operands + 1
        : this.state.linkingIndexTable[indexOfLinkingIndex].currentInstruction.operands.length + 2
      const Rank = { Rank: RankV, state: this.state.msgToUser.Rank.state }
      const Name = { Name: evt.target.value, state: true }
      this.setState(prevState => ({
        msgToUser: { ...prevState.msgToUser, Name }
      }))
    } else {
      const Name = { Name: evt.target.value, state: true }
      this.setState(prevState => ({
        msgToUser: { ...prevState.msgToUser, Name }
      }))
    }
  }

  handleTypeOfOperandChange = (evt) => {
    const Type = { Type: evt.target.value, state: true }
    this.setState(prevState => ({
      msgToUser: { ...prevState.msgToUser, Type }
    }))
  }

  handleRankOfOperandChange = (evt) => {
    const indexOfLinkingIndex = this.state.linkingIndexTable.findIndex(e => e.currentInstruction.name === this.state.value)
    if (((evt.target.value === this.state.linkingIndexTable[indexOfLinkingIndex].currentInstruction.operands + 2) && this.state.linkingIndexTable[indexOfLinkingIndex].currentInstruction.result.length !== 0) ||
      ((evt.target.value === this.state.linkingIndexTable[indexOfLinkingIndex].currentInstruction.operands + 1) && this.state.linkingIndexTable[indexOfLinkingIndex].currentInstruction.result.length === 0)) {
      const Rank = { Rank: evt.target.value, state: true }
      const Name = { Name: 'r', state: this.state.msgToUser.Name.state }
      this.setState(prevState => ({
        msgToUser: { ...prevState.msgToUser, Rank }
      }))
    } else {
      const Rank = { Rank: evt.target.value, state: true }
      this.setState(prevState => ({
        msgToUser: { ...prevState.msgToUser, Rank }
      }))
    }
  }

  handleInsertClick = (evt) => {
    let deletedName = this.state.deletedName
    const linkingIndexTable = this.state.linkingIndexTable
    const msgToUser = this.state.msgToUser
    if (msgToUser.Name.state && msgToUser.Type.state && msgToUser.Rank.state && msgToUser.Dimension.state) {
      const indexOfLinkingIndex = linkingIndexTable.findIndex(e => e.currentInstruction.name === this.state.value)
      const modifiedCurrentInstruction = myLib.insertOperand(msgToUser.Name.Name, msgToUser.Type.Type, msgToUser.Rank.Rank, msgToUser.Dimension.Dimension, linkingIndexTable[indexOfLinkingIndex])
      deletedName = _.isEqual(linkingIndexTable[indexOfLinkingIndex], modifiedCurrentInstruction) ? deletedName : deletedName.filter(x => x !== msgToUser.Name.Name)
      linkingIndexTable[indexOfLinkingIndex] = modifiedCurrentInstruction
    }
    this.setState(prevState => ({
      deletedName: deletedName,
      clickedButton: evt.target.id,
      linkingIndexTable: linkingIndexTable,
      currentResult: null,
      msgToUser: { Type: { Type: null, state: false }, Name: { Name: null, state: false }, Rank: { Rank: null, state: false }, Dimension: { Dimension: null, state: false } }
    }))
  }

  handleDeleteClick = (evt) => {
    let deletedName = this.state.deletedName
    const linkingIndexTable = this.state.linkingIndexTable
    const msgToUser = this.state.msgToUser
    if (msgToUser.Name.state && msgToUser.Rank.state) {
      const indexOfLinkingIndex = linkingIndexTable.findIndex(e => e.currentInstruction.name === this.state.value)
      const modifiedCurrentInstruction = myLib.deleteOperand(msgToUser.Name.Name, msgToUser.Rank.Rank, linkingIndexTable[indexOfLinkingIndex])
      linkingIndexTable[indexOfLinkingIndex] = modifiedCurrentInstruction[0]
      deletedName = [modifiedCurrentInstruction[1], ...deletedName]
    }
    this.setState(prevState => ({
      deletedName: deletedName,
      clickedButton: evt.target.id,
      linkingIndexTable: linkingIndexTable,
      currentResult: null,
      msgToUser: { Type: { Type: null, state: false }, Name: { Name: null, state: false }, Rank: { Rank: null, state: false }, Dimension: { Dimension: null, state: false } }
    }))
  }

  handleGroupClick = (evt) => {

  }

  handlePartClick = (evt) => {

  }

  handleGroupPartSelect = (evt) => {
    // console.log("evtTarget select", evt.target, "evt.currentTarget select", evt.currentTarget)
  }

  handleNoviceViewClick = (evt) => {
    this.setState(prevState => ({
      activeView: 'expert'
    }))
  }

  handleExpertViewClick = (evt) => {
    this.setState(prevState => ({
      activeView: 'novice'
    }))
  }

  render () {
    console.log('linkingIndextable', this.state.linkingIndexTable)
    const indexOfLinkingIndex = this.state.linkingIndexTable.findIndex(e => e.currentInstruction.name == this.state.value)
    const linkingIndex = this.state.linkingIndexTable[indexOfLinkingIndex].linkingIndex
    const currentInstruction = this.state.linkingIndexTable[indexOfLinkingIndex].currentInstruction
    const resultTable = this.state.linkingIndexTable[indexOfLinkingIndex].resultTable
    return (

      <div id="application" className="application">
        <div id="codeTextExplanation" className="codeTextExplanation">
          <div id="codeText" className="codeText">
            <CodeText handleOnchange={this.handleOnchange} value={this.state.value} isVisible={this.state.isVisible} />
          </div>
          <div id="explanation" className="explanation">
            {this.state.isVisible && <Explanation value={this.state.value} handlesimdButtonClick={this.handlesimdButtonClick} linkingIndex={linkingIndex} msgToUser={this.state.msgToUser} deletedName={this.state.deletedName}
              currentOperator={this.state.currentOperator} currentResult={this.state.currentResult} currentInstruction={currentInstruction} clickedButton={this.state.clickedButton} resultTable={resultTable} activeView={this.state.activeView}
              handleDimensionOfOperandChange={this.handleDimensionOfOperandChange} handleRankOfOperandChange={this.handleRankOfOperandChange} handleTypeOfOperandChange={this.handleTypeOfOperandChange} handleNoviceViewClick={this.handleNoviceViewClick}
              handleExpertViewClick={this.handleExpertViewClick}
              handleNameOfOperandChange={this.handleNameOfOperandChange} handleInsertClick={this.handleInsertClick} handleDeleteClick={this.handleDeleteClick} handleGroupClick={this.handleGroupClick} handlePartClick={this.handlePartClick} />}
          </div>
        </div>
        <div id="operation" className="operation">
          {this.state.isVisible && <Operations value={this.state.value} currentInstruction={currentInstruction} linkingIndex={linkingIndex}
            handleOperandClick={this.handleOperandClick} handleOperatorClick={this.handleOperatorClick} />}
        </div>
      </div>
    )
  }
}

export default App
