import React, { Component } from 'react';
import * as myLib from '../utilities/myLibrary.js';
import '../styles/Explanation.css';
import * as _ from "lodash";
import parse from 'html-react-parser';
import simdFunction from '../utilities/simdFunction.json';

const alphabethLetters = myLib.range('a'.charCodeAt(0), 'z'.charCodeAt(0), 1).map(x => String.fromCharCode(x));
const optionOfT=(arrayOfT)=>arrayOfT.map((e, i) =>i===0?<option key={`${e}+${i}`} value="">{e}</option>:<option key={`${e}+${i}`} value={e}>{e}</option>);
const optionsType=optionOfT(["--Choose operand type--",...myLib.returnTypeAndParam(simdFunction)]);

class Explanation extends Component {
    constructor(props) {
        super(props);
        this.currentResult = null;
        this.butonMsg = null;



    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.value !== prevProps.value||_.isEqual(this.props.linkingIndex, prevProps.linkingIndex)) {
            this.currentResult = this.props.currentResult
            this.butonMsg = myLib.readLinkingIndexMsg(this.props.linkingIndex);
        }

    }

    componentWillUnmount() {

    }


    render() {console.log()
        let availableLetters =this.props.currentInstruction.operands.length===0?alphabethLetters: alphabethLetters.filter(x => !this.props.currentInstruction.varnames.includes(x));
        let availableName=this.props.currentInstruction.operands.length===0?[...this.props.deletedName, ...availableLetters]:[...this.props.deletedName, ...availableLetters].filter(x => !this.props.currentInstruction.varnames.includes(x));
        let optionsName =optionOfT(["--Choose operand name--",...availableName]) 
        var canBeDeletedName =this.props.currentInstruction.varnames ;
        var optionNameToDelete =optionOfT(["--Operand name to delete--",...canBeDeletedName]);
        var canBeDeletedRank = myLib.range(1, this.props.currentInstruction.operands.length, 1);
        var optionRankToDelete = optionOfT(["--Operand rank to delete--",...canBeDeletedRank]);
        let canBeInsertRank = this.props.msgToUser.Name.Name?( this.props.msgToUser.Name.Name!=="r"?(this.props.currentInstruction.result.length === 0 ? myLib.range(1, this.props.currentInstruction.operands.length, 1) : myLib.range(1, this.props.currentInstruction.operands.length + 1, 1)):
        (this.props.currentInstruction.result.length === 0 ? myLib.range(this.props.currentInstruction.operands.length+1, this.props.currentInstruction.operands.length+1, 1) : myLib.range(this.props.currentInstruction.operands.length + 2, this.props.currentInstruction.operands.length + 2, 1))):
        (this.props.currentInstruction.result.length === 0 ? myLib.range(1, this.props.currentInstruction.operands.length+1, 1) : myLib.range(1, this.props.currentInstruction.operands.length + 2, 1));
        
        var optionRankToInsert = optionOfT(["--Choose operand rank--",...canBeInsertRank]);
        var dimension = [0,...myLib.range(0, 10, 1).map(e=>2**e)];
        var optionDimension = optionOfT(["--Choose operand dimension--",...dimension]); 
        var insertField = <div className='insert-operand'>
            <label htmlFor="type-of-operand-to-insert"><span className="button-insert"></span></label>
            <select id="type-of-operand-to-insert" form="explanationForm" name="type-of-operand-to-insert" autoComplete="on" required
              onChange={(evt) => this.props.handleTypeOfOperandChange(evt)}>
                {optionsType}
            </select><br />
            <label htmlFor="name-of-operand-to-insert"><span className="button-insert"></span></label>
            <select id="name-of-operand-to-insert" form="explanationForm" name="name-of-operand-to-insert" autoComplete="on" required
            onChange={(evt) => this.props.handleNameOfOperandChange(evt)}>
                {optionsName}
            </select><br />
            <label htmlFor="rank-of-operand-to-insert"><span className="button-insert"></span></label>
            <select id="rank-of-operand-to-insert" form="explanationForm" name="rank-of-operand-to-insert" autoComplete="on"
                required onChange={(evt) => this.props.handleRankOfOperandChange(evt)}>
                {optionRankToInsert}
            </select>
            <br />
            <label htmlFor="dimension-of-operand-to-insert"><span className="button-dimension"></span></label>
            <select id="dimension-of-operand-to-insert" form="explanationForm" name="dimension-of-operand-to-insert" autoComplete="on"
                required onChange={(evt) => this.props.handleDimensionOfOperandChange(evt)}>
                {optionDimension}
            </select>{/* <output id="rankOutput" className="rankOutput" name="outputRank" form="explanationForm" >
                {this.props.msgToUser.Dimension}
            </output> */}
        </div>
        var deleteField = <div className='delete-operand'>
            <label htmlFor="name-of-operand-to-delete"><span className="button-delete"></span></label>
            <select id="name-of-operand-to-delete" form="explanationForm" name="name-of-operand-to-delete" autoComplete="on"
                required onChange={(evt) => this.props.handleNameOfOperandChange(evt)}>
                {optionNameToDelete}
            </select>
            <br />
            <label htmlFor="rank-of-operand-to-delete"><span className="button-delete"></span></label>
            <select id="rank-of-operand-to-delete" name="rank-of-operand-to-delete" autoComplete="on"
                required onChange={(evt) => this.props.handleRankOfOperandChange(evt)}>
                {optionRankToDelete}
            </select>

        </div>
        this.butonMsg = myLib.readLinkingIndexMsg(this.props.linkingIndex);
        this.butonMsg=myLib.replaceOperandInMessage("Idx", this.butonMsg);
        //console.log("msg ",this.butonMsg ," Modified Msg ",myLib.replaceOperandInMessage("Idx", this.butonMsg) );
        this.currentResult = this.props.currentResult;
        if (this.props.clickedButton) {
            this.deletedButtonState =1;// this.props.clickedButton === "deleteOperandButton";
            this.insertButtonState = 1;
            this.groupButtonState = 1;
            this.partButtonState = 1;
        }


        return (


            <div id="explanation" className="explanation">
                <form id="explanationForm" className="explanationForm">
                    <p id="outputParagraph" className="outputParagraph">
                        <label>{this.currentResult && `How to compute the field  `}</label>
                        <output id="simdOutput" className="simdOutput" name="outputSimd" form="explanationForm" >
                            <span id="fieldFormul" className="fieldFormul">{this.currentResult && `${this.currentResult}:  `}</span><span id="textFormul" className="textFmormul">{this.currentResult && `${this.currentResult} =`}{parse(this.butonMsg)}</span>
                        </output>
                    </p>
                    <p id="buttonParagraph" className="buttonParagraph">
                        {this.currentResult && <button id="simdButton" className="simdButton" form="explanationForm" type="button" onClick={evt => this.props.handlesimdButtonClick(evt)}>
                            {`Reset the field ${this.currentResult}  `}
                        </button>}
                    </p>
                    <p id="buttonManageVectorOperands" className="buttonManageVectorOperands">
                        {this.insertButtonState && <button id="insertOperandButton" className="insertOperandButton" form="explanationForm" type="button" onClick={evt => this.props.handleInsertClick(evt)}>
                            Insert an operand
                        </button>}<br /><br />
                        {this.deletedButtonState && < button id="deleteOperandButton" className="deleteOperandButton" form="explanationForm" type="button" onClick={evt => this.props.handleDeleteClick(evt)}>
                            Delete an operand
                        </button>}<br /><br />
                        <button id="groupOperandsButton" className="groupOperandsButton" form="explanationForm" type="button" onClick={evt => this.props.handleGroupClick(evt)}>
                            Group selected scalar operands
                        </button><br /><br />
                        <button id="partOperandsButton" className="partOperandsButton" form="explanationForm" type="button" onClick={evt => this.props.handlePartClick(evt)}>
                            Part selected scalar operands
                        </button>
                    </p>
                    {insertField}{deleteField}
                </form>
            </div>




        )
    }
}

export default Explanation