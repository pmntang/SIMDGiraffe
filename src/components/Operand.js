import React, { Component } from 'react';
import * as myLib from '../utilities/myLibrary.js';
import '../styles/Operand.css';
import * as _ from "lodash";
import simdFunction from '../utilities/simdFunction.json';

class Operand extends Component {
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
      var  result = this.props.operand.reduce((accumulator, currentValue) => [currentValue, ...accumulator], []);
        var rank = this.props.rank, result = result, type=this.props.type;
               const rectOprHeight = 50, rectOprWidth = 80, spaceOprBetween = 10, xOpr0 = "0", yOpr0 = "0";
        const rectOperandHeight = 20, rectOperandWidth = 20, spaceBetweenOperand = 0.5, xOperand0 = "0", yOperand0 = "0";
        const gOperand = result.map((o, j) => <g key={(type.toLowerCase() + rank) + o} id={(type.toLowerCase() + rank) + o} className={(type.toLowerCase() + rank) + o} onClick={evt => this.props.handleOperandClick(evt)}>
            <rect key={"recScalar"+type + (rank + j)} id={"recScalar"+type + (rank + j)} className={"recScalar"+type + (rank + j)} y={yOperand0 + (rank * (rectOperandHeight + spaceOprBetween))} x={xOperand0 + (j * (rectOperandWidth + spaceBetweenOperand))} width={"" + rectOperandWidth}
                height={"" + rectOperandHeight}></rect>
            <text key={"txtScalar"+type + (rank + j)} id={"txtScalar"+type + (rank + j)} className={"txtScalar"+type + (rank + j)} dy="0 2%" y={yOperand0 + (rank * spaceOprBetween + (2 * rank + 1) * rectOperandHeight / 2)} dx="0 0.07%" x={xOperand0 +
                (j * (rectOperandWidth + spaceBetweenOperand) + (rectOperandHeight / 2))} dominantBaseline="middle" textAnchor="middle">{String.fromCharCode(65 + rank)}{o}</text></g>)

        return (
            <>
                {gOperand}
            </>
        )
    }
}

export default Operand