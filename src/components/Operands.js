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
  
    render() {
        const currentInstruction = this.props.currentInstruction;
        const currentInstructionMember = [...currentInstruction.operands, currentInstruction.result]
        const operands = currentInstructionMember.map((e, i) => <Operand key={i} operand={e} rank={i} handleOperandClick={this.props.handleOperandClick}
            type={((currentInstructionMember.length - 1 == i) && "Result") || "Operand"}></Operand>);
        return (

            <g id="operands" className="operands" transform={"translate( 0," + this.props.translation + ")"}>
                {operands}
            </g>
        )
    }
}
export default Operands