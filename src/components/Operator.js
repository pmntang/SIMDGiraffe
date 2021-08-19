import React, { Component } from 'react';
import * as myLib from '../utilities/myLibrary.js';
import '../styles/Operator.css';
import simdFunction from '../utilities/simdFunction.json';


const operators = ['+', 'x', '-', '/', 'mov', ':(int)', 'exp', 'ln','(', ')'];


class Operand extends Component {
    constructor(props) {
        super(props);

    }

    componentDidMount() {

    }

    componentDidUpdate() {

    }

    componentWillUnmount() {

    }
    handleOperatorClick=(evt)=>{

    }

    render() {
        
        var rectOprHeight = this.props.rectOprHeight, rectOprWidth = 35, spaceOprBetween = 17, xOpr0 = "0", yOpr0 = "0";
        const gOperator = operators.map((e, i) => <g key={"operator" + i} id={"operator" + i} className={"operator" + i} onClick={evt => this.handleOperatorClick(evt)}>
          <rect key={"rectOperator"+i} id={"rectOperator"+i} className={"rectOperator"+i} x={xOpr0 + (i * (rectOprHeight + spaceOprBetween))} y={yOpr0} width={"" + rectOprWidth} height={"" + rectOprHeight}></rect>
          <text key={"txtOperator"+i} id={"txtOperator"+i} className={"txtOperator"+i} x={xOpr0 + (i * (rectOprHeight + spaceOprBetween))} dx= {""+ rectOprWidth/2}  y={yOpr0} dy= {""+ rectOprWidth/2}  dominantBaseline="middle" textAnchor="middle">{e}</text></g>);
    
   
    
    return (
            <>
                {gOperator}
            </>
        )
    }
}

export default Operand