import React, { Component } from 'react';
import * as myLib from '../utilities/myLibrary.js';
import '../styles/Operands.css';
import simdFunction from '../utilities/simdFunction.json';
import Operand from './Operand';


class Operands extends Component {
    constructor(props) {
        super(props);

    }

    componentDidMount() {;

    }

    componentDidUpdate() {

    }

    componentWillUnmount() {

    }
  
    render() {console.log(  "this.props.currentInstruction  ",  this.props.currentInstruction)
        const currentInstruction = this.props.currentInstruction, xPrefixWidth=this.props.xPrefixWidth;
        const currentInstructionMember = [...currentInstruction.operands, currentInstruction.result]
        const operands = currentInstructionMember.map((e, i) =>(currentInstructionMember.length - 1 == i)?
                                     <Operand xPrefixWidth={xPrefixWidth} key={i} operand={e} rank={i} handleOperandClick={this.props.handleOperandClick} type={ "Result"} varType={currentInstruction.retType} varName="res"></Operand>:
                                                                    <Operand xPrefixWidth={xPrefixWidth} key={i} operand={e} rank={i} handleOperandClick={this.props.handleOperandClick} type={"Operand"} varType={currentInstruction.types[i]} varName={currentInstruction.varnames[i]}></Operand>);
        return (

            <g id="operands" className="operands" transform={"translate( 0," + this.props.translation + ")"}>
                {operands}
            </g>
        )
    }
}
export default Operands