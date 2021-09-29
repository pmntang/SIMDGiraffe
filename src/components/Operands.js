import React, { Component } from 'react';
import * as myLib from '../utilities/myLibrary.js';
import '../styles/Operands.css';
import simdFunction from '../utilities/simdFunction.json';
import Operand from './Operand';


class Operands extends Component {
    // eslint-disable-next-line no-useless-constructor
    constructor(props) {
        super(props);

    }

    componentDidMount() {;

    }

    componentDidUpdate() {

    }

    componentWillUnmount() {

    }
  
    render() {
        const currentInstruction = this.props.currentInstruction, xPrefixWidth=this.props.xPrefixWidth;
        const currentInstructionMember = [...currentInstruction.operands, currentInstruction.result]
        const operands = currentInstructionMember.map((e, i) =>(currentInstructionMember.length - 1 == i)?
                                     <Operand xPrefixWidth={xPrefixWidth} key={i} operand={e} rank={i} handleOperandClick={this.props.handleOperandClick} type={ "Result"} varType={currentInstruction.retType} varName="r"></Operand>:
                                                                    <Operand xPrefixWidth={xPrefixWidth} key={i} operand={e} rank={i} handleOperandClick={this.props.handleOperandClick} type={"Operand"} varType={currentInstruction.types[i]} varName={currentInstruction.varnames[i]}></Operand>);
        return (

            <g id="operands" className="operands" transform={"translate( 0," + this.props.translation + ")"}>
                {operands}
            </g>
        )
    }
}
export default Operands